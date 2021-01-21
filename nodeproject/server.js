//Create database
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('products.db');

db.serialize(() => {
   //Creating table
   db.run(`
      CREATE TABLE IF NOT EXISTS products
      (id 	  INTEGER PRIMARY KEY,
      product	CHAR(100) NOT NULL,
      origin 	CHAR(100) NOT NULL,
      best_before_date 	CHAR(20) NOT NULL,
      amount  CHAR(20) NOT NULL,
      image   CHAR(254) NOT NULL
        )`);
   
   console.log("database and table created");

   //Inserting apples for testing purposes
   db.all('SELECT COUNT(*) AS count FROM PRODUCTS', function(err, result) {
      if (result[0].count == 0) {
         db.run(`INSERT INTO products (product, origin, best_before_date, amount, image) VALUES (?, ?, ?, ?, ?)`,
         ["Apples", "The Netherlands", "November 2019", "100kg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Apples.jpg/512px-Apples.jpg"]);
      }
   })
});

const express = require("express");
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

app.get('/', (req, res) => {
   res.send("GETTING ALL");
});

app.get('/:productID', (req, res) => {
   res.send("GETTING");
});

app.post('/', (req, res) => {
   res.send("ADDING")
});

app.put('/', (req, res) => {
   res.send("UPDATING")
});

app.delete('/', (req, res) => {
   res.send("DELETING")
});

app.listen(3000);