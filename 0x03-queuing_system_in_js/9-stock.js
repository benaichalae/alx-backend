#!/usr/bin/env node
const express = require('express');
const { createClient } = require('redis');

const listProducts = [
  {
    itemId: 1,
    itemName: 'Suitcase 250',
    price: 50,
    initialAvailableQuantity: 4
  },
  {
    itemId: 2,
    itemName: 'Suitcase 450',
    price: 100,
    initialAvailableQuantity: 10
  },
  {
    itemId: 3,
    itemName: 'Suitcase 650',
    price: 350,
    initialAvailableQuantity: 2
  },
  {
    itemId: 4,
    itemName: 'Suitcase 1050',
    price: 550,
    initialAvailableQuantity: 5
  },
];

const getItemById = (id) => {
  const item = listProducts.find(obj => obj.itemId === id);

  if (item) {
    return Object.fromEntries(Object.entries(item));
  }
};

const app = express();
const client = createClient();
const PORT = 1245;

const reserveStockById = (itemId, stock, callback) => {
  client.SET(`item.${itemId}`, stock, callback);
};

const getCurrentReservedStockById = (itemId, callback) => {
  client.GET(`item.${itemId}`, callback);
};

app.get('/list_products', (_, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId(\\d+)', (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const productItem = getItemById(Number.parseInt(itemId));

  if (!productItem) {
    res.json({ status: 'Product not found' });
    return;
  }
  getCurrentReservedStockById(itemId, (err, result) => {
    if (err) {
      console.error(err);
      res.json({ status: 'Error occurred' });
      return;
    }
    const reservedStock = Number.parseInt(result || 0);
    productItem.currentQuantity = productItem.initialAvailableQuantity - reservedStock;
    res.json(productItem);
  });
});

app.get('/reserve_product/:itemId', (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const productItem = getItemById(Number.parseInt(itemId));

  if (!productItem) {
    res.json({ status: 'Product not found' });
    return;
  }
  getCurrentReservedStockById(itemId, (err, result) => {
    if (err) {
      console.error(err);
      res.json({ status: 'Error occurred' });
      return;
    }
    const reservedStock = Number.parseInt(result || 0);
    if (reservedStock >= productItem.initialAvailableQuantity) {
      res.json({ status: 'Not enough stock available', itemId });
      return;
    }
    reserveStockById(itemId, reservedStock + 1, (err) => {
      if (err) {
        console.error(err);
        res.json({ status: 'Error occurred' });
        return;
      }
      res.json({ status: 'Reservation confirmed', itemId });
    });
  });
});

const resetProductsStock = () => {
  listProducts.forEach(item => {
    client.SET(`item.${item.itemId}`, 0);
  });
};

app.listen(PORT, () => {
  resetProductsStock();
  console.log(`API available on localhost port ${PORT}`);
});

module.exports = app;
