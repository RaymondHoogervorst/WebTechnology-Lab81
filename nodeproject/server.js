const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('products.db');

const express = require("express");
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

//app.use(express.static("public"));

//app.listen(3000);