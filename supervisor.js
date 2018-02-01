require('dotenv').config();

var keys = require("./keys.js");
var mysql = require('mysql');
var Table = require('easy-table');
var inquirer = require('inquirer');
var availableItems = []
var connection = mysql.createConnection(keys.sqlLogin);


//connection to Database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connectead as id " + connection.threadId);
    supervisorLogin();
});

function supervisorLogin() {
    ordered = [];
    inquirer.prompt([
        {
            type: "list",
            message: "You're the Supervisor.... Supervise!:  \n",
            choices: ["View Product Sales by Department", "Create New Department", "Log Out"],
            name: "supervisorTask"
        }
    ]).then(function (answer) {
        var userInput = answer.supervisorTask;

        switch (userInput){
            case "View Product Sales by Department":
            getProductSales();
            break;

            case "Create New Department":
            createDepartment();
            break;

            case "Log Out":
            logout();
            break;

        }
    });
};

function openStore() {
    console.log("Here's the Status Report Chief:\n");
    connection.query("SELECT * FROM departments", function (err, res) {
        if (err) throw err;
        var data = res;
        console.log(res);
        var t = new Table;
        // using the easy-table npm package for node to create CLI table print out
        data.forEach(function (departments) {
            t.cell('Department ID', departments.department_id);
            t.cell('Department Name', departments.department_name);
            t.cell('Over Head Costs', departments.over_head_costs);
            t.cell('Product Sales', 0.00, Table.number(2));
            t.cell('Total Profit', 0.00, Table.number(2));
            t.newRow()
        });
        console.log(t.toString());
        supervisorLogin();
    });
};

function logout() {
    connection.end();
};

function getProductSales() {
    connection.query("SELECT item_id, product_sales FROM products INNER JOIN departments ON products.department_name = departments.department_name;",
    function(err, res) {
        if (err) throw err;
        console.log(res);
    });
};