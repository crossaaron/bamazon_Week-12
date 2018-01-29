require('dotenv').config();

var keys = require("./keys.js");
var mysql = require('mysql');
var Table = require('easy-table');
var inquirer = require('inquirer');
var availableItems = []
var connection = mysql.createConnection(keys.sqlLogin);
var ordered = [];

//connection to Database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connectead as id " + connection.threadId);
    managerLogin();
});

function managerLogin() {
    ordered = [];
    inquirer.prompt([
        {
            type: "list",
            message: "You're the Manager.... Manage!:  \n",
            choices: ["View Products for Sale", "View Low Inventory", "Add Inventory", "Add New Product", "Log Out"],
            name: "managerTask"
        }
    ]).then(function (answer) {
        var userInput = answer.managerTask;

        switch (userInput){
            case "View Products for Sale":
            openStore();
            break;

            case "View Low Inventory":
            lowInventory();
            break;

            case "Add Inventory":
            addInventory();
            break;

            case "Add New Product":
            addProduct();
            break;

            case "Log Out":
            logout();
            break;

        }
    });
};

function openStore() {
    console.log("Welcome to BAM!azon\nHere's what's Available:\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var data = res;
        var t = new Table;
        // using the easy-table npm package for node to create CLI table print out
        data.forEach(function (product) {
            availableItems.push(product.product_name);
            t.cell('Item ID', product.item_id);
            t.cell('Product Name', product.product_name);
            t.cell('Department', product.department_name);
            t.cell('Price', product.price, Table.number(2));
            t.cell('In Stock', product.stock_quantity);
            t.newRow()
        });
        console.log(t.toString());
        managerLogin();
    });
};

function lowInventory () {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5",
    function (err, res) {
        if (err) throw err;
        var data = res;
        var t = new Table;

        data.forEach(function(product) {
            t.cell('Item ID', product.item_id);
            t.cell('Product Name', product.product_name);
            t.cell('Department', product.department_name);
            t.cell('Price', product.price, Table.number(2));
            t.cell('In Stock', product.stock_quantity);
            t.newRow()
        });
        console.log(t.toString());
        managerLogin();
    });
};

function addInventory() {
    inquirer.prompt([
        {
            type: "input",
            message: "Select the Product ID to increase inventory",
            name: "selectedProduct"
        },
        {
            type: "input",
            message: "Enter number to add to Inventory",
            name: "quantityReq"
        }
    ]).then(function(answer) {
        //pushing the quantity to a global variable..... wasn't able to get this functionality alternatively
        ordered.push(answer.quantityReq);
        //finds the item in the database
        connection.query("SELECT * FROM products WHERE ?",
            {
                item_id: answer.selectedProduct
            },
            function (err, res) {
                if (err) throw err;
                    //updates the stock quantity 
                    connection.query("UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: parseInt(res[0].stock_quantity) + parseInt(answer.quantityReq)
                            },
                            {
                                product_name: res[0].product_name
                            }
                        ],
                        function (err, res) {
                        });
                console.log("Inventory Added");
                inquirer.prompt([
                    {
                        type: "list",
                        message: "Would you like to add any more inventory?",
                        choices: ["Yes", "No"],
                        name: "addMore"
                    }
                ]).then(function (input) {
                    if (input.addMore === "Yes") {
                        addInventory();
                    } else {
                        connection.end();
                    }
                });
            });
    });
};

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            message: "enter Item ID",
            name: "input1" 
        },
        {
            type: "input",
            message: "enter Product Name",
            name: "input2"
        },
        {
            type: "list",
            message: "enter Department",
            choices: ["cleaning supplies", "toiletries", "produce", "meat", "pet supplies", "appliances", "lawn and garden", "tools"],
            name: "input3"
        },
        {
            type: "input",
            message: "enter Price (00.00)",
            name: "input4"
        },
        {
            type: "input",
            message: "enter Number in Stock",
            name: "input5"
        }
    ]).then(function(answer) {
        connection.query("INSERT INTO products SET ? ",
            {
            item_id: parseInt(answer.input1),
            product_name: answer.input2,
            department_name: answer.input3,
            price: answer.input4,
            stock_quantity: answer.input5
            },
            function (err, res) {
                console.log("product added")
                openStore();
            }
        );
    });
};

function logout() {
    connection.end();
};