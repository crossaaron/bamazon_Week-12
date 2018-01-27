require('dotenv').config();

var keys = require("./keys.js")
var mysql = require('mysql');

console.log(keys);
var connection = mysql.createConnection(keys.sqlLogin);

connection.connect(function (err) {
    if (err) throw err;
    console.log("connectead as id " + connection.threadId);
    openStore();
});

function openStore () {
    console.log("Welcome to BAM!azon\nHere's what's Available:");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log(res);
        // connection.end();

    });
};
