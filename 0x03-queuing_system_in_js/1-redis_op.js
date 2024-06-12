#!/usr/bin/yarn dev
import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.toString());
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

const setNewSchool = async (schoolName, value) => {
  try {
    await client.set(schoolName, value);
    console.log(`Set value for ${schoolName}`);
  } catch (err) {
    console.error('Error setting value:', err);
  }
};

const displaySchoolValue = async (schoolName) => {
  try {
    const value = await client.get(schoolName);
    console.log(value);
  } catch (err) {
    console.error('Error getting value:', err);
  }
};

const main = async () => {
  await client.connect();
  
  await displaySchoolValue('Holberton');
  await setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');

  client.quit();
};

main();
