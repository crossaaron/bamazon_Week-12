# bamazon_Week-12
# Node.js & MySQL

## Overview

A LOOSELY based Amazon-like storefront with the MySQL skills learned this week. The app will take in orders from customers and deplete stock from the store's inventory. As a bonus task, you can track product sales across your store's departments and then provide a summary of the highest-grossing departments in the store.


## Instructions

### Customer View 

Access by running `node bamazonCustomer.js`

1. The app should will prompt users with two messages.

   * The first will them the ID of the product they would like to buy.
   * The second message will ask how many units of the product they would like to buy.

7. Once the customer has placed the order, your application will check if your store has enough of the product to meet the customer's request.

   * If not, the app will prevent the order from going through.

8. However, if the store _does_ have enough of the product, the order will be fulfilled.
   * This updates the SQL database to reflect the remaining quantity.
   * Once the update goes through, show the customer the total cost of their purchase.

![alt text](/img/ss2.png)



### Challenge #2: Manager View (Next Level)

* Access by runging `node manager.js`. Running this application will:

  * List a set of menu options:

    * View Products for Sale
    
    * View Low Inventory
    
    * Add to Inventory
    
    * Add New Product

  * If a manager selects `View Products for Sale`, the app will list every available item: the item IDs, names, prices, and quantities.

  * If a manager selects `View Low Inventory`, then it will list all items with an inventory count lower than five.

  * If a manager selects `Add to Inventory`, the app will display a prompt that will let the manager "add more" of any item currently in the store.

  * If a manager selects `Add New Product`, it will allow the manager to add a completely new product to the store.

![alt text](/img/ss4.png)
![alt text](/img/ss5.png)
![alt text](/img/ss6.png)
- - -


### Challenge #3: Supervisor View (Final Level)

Access by running  `node supervisor`. Running this application will eventually include the following columns:

   * department_id

   * department_name

   * over_head_costs (A dummy number you set for each department)

2. Modify the products table so that there's a product_sales column and modify the `bamazonCustomer.js` app so that this value is updated with each individual products total revenue from each sale.

3. Modify your `bamazonCustomer.js` app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

   * Make sure your app still updates the inventory listed in the `products` column.

4. Create another Node app called `bamazonSupervisor.js`. Running this application will list a set of menu options:

   * View Product Sales by Department
   
   * Create New Department

5. When a supervisor selects `View Product Sales by Department`, the app should display a summarized table in their terminal/bash window. Use the table below as a guide.

| department_id | department_name | over_head_costs | product_sales | total_profit |
| ------------- | --------------- | --------------- | ------------- | ------------ |
| 01            | Electronics     | 10000           | 20000         | 10000        |
| 02            | Clothing        | 60000           | 100000        | 40000        |

6. The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.
