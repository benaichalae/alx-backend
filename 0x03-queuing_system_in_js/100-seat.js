#!/usr/bin/env node
const express = require('express');
const { createQueue } = require('kue');
const { createClient } = require('redis');

const app = express();
const client = createClient({ name: 'reserve_seat' });
const queue = createQueue();
const INITIAL_SEATS_COUNT = 50;
let reservationEnabled = false;
const PORT = 1245;

const reserveSeat = (number, callback) => {
  client.SET('available_seats', number, callback);
};

const getCurrentAvailableSeats = (callback) => {
  client.GET('available_seats', callback);
};

app.get('/available_seats', (_, res) => {
  getCurrentAvailableSeats((err, numberOfAvailableSeats) => {
    if (err) {
      res.json({ error: err.message });
      return;
    }
    res.json({ numberOfAvailableSeats: Number.parseInt(numberOfAvailableSeats || 0) });
  });
});

app.get('/reserve_seat', (_req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
    return;
  }
  try {
    const job = queue.create('reserve_seat');

    job.on('failed', (err) => {
      console.log(
        'Seat reservation job',
        job.id,
        'failed:',
        err.message || err.toString(),
      );
    });
    job.on('complete', () => {
      console.log(
        'Seat reservation job',
        job.id,
        'completed'
      );
    });
    job.save();
    res.json({ status: 'Reservation in process' });
  } catch {
    res.json({ status: 'Reservation failed' });
  }
});

app.get('/process', (_req, res) => {
  res.json({ status: 'Queue processing' });
  queue.process('reserve_seat', (_job, done) => {
    getCurrentAvailableSeats((err, availableSeats) => {
      if (err) {
        done(err);
        return;
      }
      availableSeats = Number.parseInt(availableSeats || 0);
      reservationEnabled = availableSeats <= 1 ? false : reservationEnabled;
      if (availableSeats >= 1) {
        reserveSeat(availableSeats - 1, done);
      } else {
        done(new Error('Not enough seats available'));
      }
    });
  });
});

const resetAvailableSeats = (initialSeatsCount, callback) => {
  client.SET('available_seats', Number.parseInt(initialSeatsCount), callback);
};

app.listen(PORT, () => {
  resetAvailableSeats(process.env.INITIAL_SEATS_COUNT || INITIAL_SEATS_COUNT, (err) => {
    if (err) {
      console.error('Error resetting available seats:', err.message);
      return;
    }
    reservationEnabled = true;
    console.log(`API available on localhost port ${PORT}`);
  });
});

module.exports = app;
