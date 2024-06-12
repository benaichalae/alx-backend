#!/usr/bin/yarn dev
import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => {
  console.error('Redis client not connected to the server:', err.toString());
});

const publishMessages = () => {
  const messages = [
    { message: 'Holberton Student #1 starts course', time: 100 },
    { message: 'Holberton Student #2 starts course', time: 200 },
    { message: 'KILL_SERVER', time: 300 },
    { message: 'Holberton Student #3 starts course', time: 400 },
  ];

  messages.forEach(({ message, time }) => {
    setTimeout(() => {
      console.log(`About to send ${message}`);
      client.publish('holberton school channel', message);
    }, time);
  });
};

client.on('connect', () => {
  console.log('Redis client connected to the server');
  publishMessages();
});
