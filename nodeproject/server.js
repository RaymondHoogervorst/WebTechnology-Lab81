//Create database
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('products.db');

db.serialize(() => {
   //Creating table
   db.run(`
      CREATE TABLE IF NOT EXISTS products
      (id 	  INTEGER PRIMARY KEY,
      name	CHAR(100) NOT NULL,
      origin 	CHAR(100) NOT NULL,
      best_before_date 	CHAR(20) NOT NULL,
      amount  CHAR(20) NOT NULL,
      image   CHAR(254) NOT NULL
        )`);
   
   console.log("database and table created");

   //Inserting apples for testing purposes
   db.all('SELECT COUNT(*) AS count FROM products', function(err, result) {
      if (result[0].count == 0) {
         db.run(`INSERT INTO products (name, origin, best_before_date, amount, image) VALUES (?, ?, ?, ?, ?)`,
         ["Apples", "The Netherlands", "November 2019", "100kg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Apples.jpg/512px-Apples.jpg"]);
      }
   })
});

const express = require("express");
const app = express();

var bodyParser = require("body-parser");
const { request } = require('express');
app.use(bodyParser.json());

app.get('/', (req, res) => {
   db.all('SELECT * FROM products', function(err, result) {
      res.send(result);
   })
});

app.get('/:productID', (req, res) => {
   db.all('SELECT * FROM products WHERE id = ' + req.params.productID, function(err, result) {
      if(result.length === 1) {
         res.send(result[0]);
      }
      else {
         res.status(404).send("No item in our database has ID: " + req.params.productID);
      }
   })
});

app.post('/', (req, res) => {
   res.send("ADDING")
});

app.put('/:productID', (req, res) => {
   var updateList = "";

   object = req.body;

   for (column in object) {
      updateList += column + ' = "' + object[column] + '", ';
   }

   updateList = updateList.substr(0, updateList.length - 2);

   var query = 'UPDATE products SET ' + updateList + ' WHERE id = ' + req.params.productID;

   db.run(query, function(err,result) {
      if (this.changes !== 1) {
         res.status(404).send("No item in our database has ID: " + req.params.productID);
      }
      res.send();
   });
});

app.delete('/', (req, res) => {
   res.send("DELETING")
});

app.listen(3000);