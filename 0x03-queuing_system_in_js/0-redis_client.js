#!/usr/bin/yarn dev
import { createClient } from 'redis';

(async () => {
  const client = createClient();

  client.on('error', (err) => {
    console.error('Redis client not connected to the server:', err);
  });

  client.on('connect', () => {
    console.log('Redis client connected to the server');
  });

  await client.connect();
})();
