#!/usr/bin/yarn dev
import { createClient } from 'redis';

const client = createClient();
const EXIT_MSG = 'KILL_SERVER';

client.on('error', (err) => {
  console.error('Redis client not connected to the server:', err.toString());
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
  client.subscribe('holberton school channel', (err, count) => {
    if (err) {
      console.error('Failed to subscribe: ', err);
    } else {
      console.log(`Subscribed to ${count} channel(s).`);
    }
  });
});

client.on('message', (channel, message) => {
  console.log(`Received message from ${channel}: ${message}`);
  if (message === EXIT_MSG) {
    client.unsubscribe(channel, (err, success) => {
      if (err) {
        console.error('Failed to unsubscribe: ', err);
      } else {
        console.log('Unsubscribed successfully.');
        client.quit();
      }
    });
  }
});
