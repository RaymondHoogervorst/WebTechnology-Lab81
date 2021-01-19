const sqlite = require('sqlite3').verbose();
let db = my_database('./products.db');

const express = require("express");
const app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(express.static("public"));

app.listen(3000);