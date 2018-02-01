//hiding keys since I'm utilizing gitHub with dotenv package
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
    openStore();
});

//Function to Open Bamazon Store in node Prompt

function openStore () {
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
            t.cell('Product Sales', product.product_sales);
            t.newRow()
        });
        console.log(t.toString())
        userSale();
    });
};

//Inquirer prompts for user input to interact with store inventory

function userSale() {
    ordered = [];
    inquirer.prompt([
        {
            type: "input",
            message: "Please Choose the Product ID of your purchase:  \n",
            name: "selectedProduct"
        },
        {
            type: "input",
            message: "How many units?\n",
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
                if(err) throw err;
                if (parseInt(res[0].stock_quantity) - parseInt(answer.quantityReq) < 0) {
                    console.log("There are not enough units to fufill your Order. Thank you! Come again!")
                    connection.end();
                    return;
                };
                if (res[0].stock_quantity > 0) {
            //updates the stock quantity and tracks the sales 
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: parseInt(res[0].stock_quantity) - parseInt(answer.quantityReq),
                            product_sales: res[0].product_sales + (parseInt(answer.quantityReq) * parseInt(res[0].price))
                        },
                        {
                            product_name: res[0].product_name
                        }
                    ],
                    function (err, res) {
                    });
                }else {
                    //if the item is not in stock it notifies the user and restarts the store
                    console.log("Sorry we're all sold out. Please choose another item.")
                    userSale();
                };
                //totals the users order
                console.log("Your total is " + "$" + res[0].price * ordered[0]);
                inquirer.prompt([
                    {
                        type: "list",
                        message: "Would you like to continue shopping?",
                        choices: ["Yes", "No"],
                        name: "shopMore"
                    }
                ]).then( function (input) {
                    if (input.shopMore === "Yes") {
                        openStore();
                    }else {
                        connection.end();
                    }
                });
            });
        });    
};



