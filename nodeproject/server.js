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
app.use(bodyParser.json());


//RETRIEVE ALL
app.get('/', (req, res) => {
   db.all('SELECT * FROM products', function(err, result) {  
      if (err) {sendRequest(req, res, err, 500)}
      else {
         sendRequest(req, res, result);
      }
   })
});

//RETRIEVE
app.get('/:productID', (req, res) => {
      db.all('SELECT * FROM products WHERE id = ' + req.params.productID, function(err, result) {
         if (err) {sendRequest(req, res, err, 500)}
         else if(result.length === 1) {
            sendRequest(req, res, result[0]);
         }
         else {
            sendRequest(req, res, "No item in our database has ID: " + req.params.productID, 404);
         }
      })
});


//CREATE
app.post('/', (req, res) => {

   //Create array of new row data
   var item = req.body;
   var item = [
      item["name"],
      item["origin"],
      item["best_before_date"],
      item["amount"],
      item["image"]
   ];

   //Check if all fields are filled
   for (cell of item) {
      if (cell === undefined) {
         sendRequest(req, res, "At least one field is undefined", 400);
      }
   }

   //Run query
   if (!req.headerSend) {
      db.all('INSERT INTO products (name, origin, best_before_date, amount, image) VALUES (?, ?, ?, ?, ?)',
      item, function(err) {
         if (err) {sendRequest(req, res, err, 500)}
         else {sendRequest(req, res)}
      })
   }
});


//UPDATE
app.put('/:productID', (req, res) => {
   var updateList = "";
   object = req.body;

   //Compose data values to change into sql query
   for (column in object) {
      updateList += column + ' = "' + object[column] + '", ';
   }

   //Trim and compose full query
   updateList = updateList.substr(0, updateList.length - 2);
   var query = 'UPDATE products SET ' + updateList + ' WHERE id = ' + req.params.productID;

   //Run query
   db.run(query, function(err) {
      if (err) {sendRequest(req, res, err, 500)}
      else if (this.changes !== 1) {
         sendRequest(req, res, "No item in our database has ID: " + req.params.productID, 404);
      }
      else {
         sendRequest(req, res);
      }
   });
});


//DELETE
app.delete('/:productID', (req, res) => {
   db.run('DELETE FROM products WHERE id = ' + req.params.productID, function(err) {
      if (err) {sendRequest(req, res, err, 500)}
      else if (this.changes !== 1) {
         sendRequest(req, res, "No item in our database has ID: " + req.params.productID, 404);
      }
      else {
         sendRequest(req, res);
      }
   })
});


//DEFAULT for unsupported requests
app.all('*', (req, res) => {
   sendRequest(req, res, "This type of request is not supported", 403);
})

//Sends request and logs request
sendRequest = function (req, res, message, status) {
   res.status(200);
   //Composing appropiate return message
   if (status) {
      res.status(status);
   }
   if (res.statusCode === 500) {
      console.log(message);
      message = "Internal server error";
   }
   if (res.statusCode !== 200) {
      message = '{"error":"' + message + '"}';
   }
   res.send(message);

   //Creating log message
   var log = "";
   log += "IP: " + req.connection.remoteAddress + " ";
   log += "Method: " + req.method + " ";
   log += "Status: " + res.statusCode + " ";
   console.log(log);
} 

app.listen(port);
console.log("Succesfully started server and now listening at port:" + port);
