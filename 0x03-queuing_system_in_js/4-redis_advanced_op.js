#!/usr/bin/yarn dev
import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => {
  console.error('Redis client not connected to the server:', err.toString());
});

const updateHash = async (hashName, fieldName, fieldValue) => {
  try {
    await client.hSet(hashName, fieldName, fieldValue);
    console.log(`Updated hash ${hashName} with field ${fieldName} and value ${fieldValue}`);
  } catch (err) {
    console.error(`Error updating hash ${hashName}:`, err);
  }
};

const printHash = async (hashName) => {
  try {
    const reply = await client.hGetAll(hashName);
    console.log(reply);
  } catch (err) {
    console.error(`Error retrieving hash ${hashName}:`, err);
  }
};

async function main() {
  const hashObj = {
    Portland: 50,
    Seattle: 80,
    'New York': 20,
    Bogota: 20,
    Cali: 40,
    Paris: 2,
  };
  
  for (const [field, value] of Object.entries(hashObj)) {
    await updateHash('HolbertonSchools', field, value);
  }
  await printHash('HolbertonSchools');
}

client.on('connect', async () => {
  console.log('Redis client connected to the server');
  await main();
  client.quit();
});

await client.connect();
