const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');

// Setup a GET route to get all the inventory items
router.get('/', (req, res) => {
  const sqlText = `SELECT * FROM inventory ORDER BY name;`;
  pool.query(sqlText)
    .then((result) => {
      //console.log(`Got inventory:`, result);
      res.send(result.rows);
    })
    .catch((error) => {
      console.log(`Error making database query ${sqlText}`, error);
      res.sendStatus(500); // Good server always responds
    })
})

// GET inventory item by id
router.get('/:id', (req, res) => {
  const idToGet = req.params.id;
  const sqlText = `SELECT * FROM inventory WHERE id=$1`;
  pool.query(sqlText, [idToGet])
    .then((result) => {
      //console.log(`Inventory item id=${idToGet}`, result.rows);
      res.send(result.rows);
    })
    .catch((error) => {
      console.log(`Error making database query ${sqlText}`, error);
      res.sendStatus(500); // Good server always responds
    })
})

// POST route to add a new inventory item 
// body expected with name, quantity & measure
router.post('/', (req, res) => {
  const newItem = req.body;
  const sqlText = `INSERT INTO inventory (name, quantity, measure) 
      VALUES ($1, $2, $3)`;
  pool.query(sqlText, [newItem.name, newItem.quantity, newItem.measure])
    .then((result) => {
      console.log(`Added song to the database`, newItem);
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log(`Error making database query ${sqlText}`, error);
      res.sendStatus(500); // Good server always responds
    })
})

// DELETE will remove an inventory item based on id
router.delete('/:id', (req, res) => {
  let reqId = req.params.id;
  console.log('Delete request for id', reqId);
  let sqlText = 'DELETE FROM inventory WHERE id=$1;';
  pool.query(sqlText, [reqId])
    .then((result) => {
      console.log('Song deleted');
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(`Error making database query ${sqlText}`, error);
      res.sendStatus(500); // Good server always responds
    })
})

// PUT will modify the quantity of an inventory item by id
// The body needs to contain the new quantity for the item
router.put('/quantity/:id', (req, res) => {
  let idToUpdate = req.params.id;
  let quantity = req.body.quantity;

  if (!quantity) {
    // If we don't get expected quantity, send back bad status
    res.sendStatus(500);
    return; // Do it now, don't run code below
  }

  let sqlText = `UPDATE inventory SET quantity=$2 WHERE id=$1`;
  pool.query(sqlText, [idToUpdate, quantity])
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(`Error making database query ${sqlText}`, error);
      res.sendStatus(500);
    })
})

// PUT will modify the values an inventory item by id
// The body needs to contain the new values for the item
// values may be name, quantity, and/or measure. 
// Not all values are required. Will only update sent values.
router.put('/:id', (req, res) => {
  let idToUpdate = req.params.id;
  let info = req.body;
  let count = 1;
  let sqlText = 'UPDATE inventory SET ';
  let values = [];

  if (info.name) {
    sqlText += ` name=$${count},`;
    values.push(info.name);
    count++;
  } 
  if (info.quantity) {
    sqlText += ` quantity=$${count},`;
    values.push(info.quantity);
    count++;
  } 
  if (info.measure) {
    sqlText += ` measure=$${count},`;
    values.push(info.measure);
    count++;
  } 
  sqlText = sqlText.substr(0, sqlText.length-1);
  sqlText += ` WHERE ID=$${count};`;
  values.push(idToUpdate);
  
  // If we don't get expected values, send back bad status
  if (values.length === 0) {
    res.sendStatus(500);
    return; // Do it now, don't run code below
  }

  pool.query(sqlText, values)
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(`Error making database query ${sqlText}`, error);
      res.sendStatus(500);
    })
})

module.exports = router;