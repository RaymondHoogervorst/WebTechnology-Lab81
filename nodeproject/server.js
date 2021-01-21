console.log("Starting MaxMarket CRUD api");
var port = 3000;

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

   //Inserting apples for testing purposes
   db.all('SELECT COUNT(*) AS count FROM products', function(err, result) {
      if (result[0].count == 0) {
         db.run(`INSERT INTO products (name, origin, best_before_date, amount, image) VALUES (?, ?, ?, ?, ?)`,
         ["Apples", "The Netherlands", "November 2019", "100kg", "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Apples.jpg/512px-Apples.jpg"]);
      }
   })
});

console.log("Database created");

const express = require("express");
const app = express();

var bodyParser = require("body-parser");
const { request } = require('express');
app.use(bodyParser.json());

app.get('/', (req, res) => {
   db.all('SELECT * FROM products', function(err, result) {
      sendRequest(req, res, result);
   })
});

app.get('/:productID', (req, res) => {
   db.serialize (() => {
      db.all('SELECT * FROM products WHERE id = ' + req.params.productID, function(err, result) {
         if(result.length === 1) {
            sendRequest(req, res, result[0]);
         }
         else {
            sendRequest(req, res, "No item in our database has ID: " + req.params.productID, 404);
         }
      })
   });
});

app.post('/', (req, res) => {

   var item = req.body;
   var item = [
      item["name"],
      item["origin"],
      item["best_before_date"],
      item["amount"],
      item["image"]
   ];

   for (cell of item) {
      if (cell === undefined) {
         sendRequest(req, res, "At least one field is undefined", 400);
      }
   }

   if (!req.headerSend) {
      db.all('INSERT INTO products (name, origin, best_before_date, amount, image) VALUES (?, ?, ?, ?, ?)',
      item, function(err, result) {
         sendRequest(req, res);
      })
   }
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
         sendRequest(req, res, "No item in our database has ID: " + req.params.productID, 404);
      }
      sendRequest(req, res);
   });
});

app.delete('/:productID', (req, res) => {
   db.run('DELETE FROM products WHERE id = ' + req.params.productID, function(err, result) {
      if (this.changes !== 1) {
         sendRequest(req, res, "No item in our database has ID: " + req.params.productID, 404);
      }
      sendRequest(req, res);
   })
   logRequest(req, res);
});

app.all('*', (req, res) => {
   sendRequest(req, res, "This type of request is not supported", 403);
})

sendRequest = function (req, res, message, status) {
   res.status(200);
   if (status) {
      res.status(status);
   }
   res.send(message);


   var log = "";
   log += "IP: " + req.connection.remoteAddress + " ";
   log += "Method: " + req.method + " ";
   log += "Status: " + res.statusCode + " ";
   console.log(log);
} 

app.listen(port);
console.log("Succesfully started server and now listening at port:" + port);
