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
   
   //Inserting apples for testing purposes
   db.all('SELECT COUNT(*) AS COUNT FROM PRODUCTS', function(err, result) {
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

//app.use(express.static("public"));

app.listen(3000);