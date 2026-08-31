create database assignment2;
\c assignment2
CREATE TABLE Store (store_id SERIAL PRIMARY KEY, store_name VARCHAR(100) NOT NULL, manager VARCHAR(100), register_no INT);
CREATE TABLE Receipt (receipt_id VARCHAR(20) PRIMARY KEY, store_id INT NOT NULL, receipt_date DATE NOT NULL, receipt_time TIME NOT NULL, cashier VARCHAR(100), status VARCHAR(20), payment_method VARCHAR(30), card_last4 CHAR(4), entry_method VARCHAR(30), approval_code VARCHAR(20), subtotal NUMERIC(10,2), tax NUMERIC(10,2), total NUMERIC(10,2), saved_amount NUMERIC(10,2), FOREIGN KEY (store_id) REFERENCES Store(store_id));
CREATE TABLE Receipt_Item (item_id SERIAL PRIMARY KEY, receipt_id VARCHAR(20) NOT NULL, item_name VARCHAR(100) NOT NULL, quantity NUMERIC(5,2), amount NUMERIC(10,2), FOREIGN KEY (receipt_id) REFERENCES Receipt(receipt_id));
\dt
INSERT INTO Store (store_name, manager, register_no) VALUES ('Green Market', 'David Thompson', 7);
INSERT INTO Receipt (receipt_id, store_id, receipt_date, receipt_time, cashier, status, payment_method, card_last4, entry_method, approval_code, subtotal, tax, total, saved_amount) VALUES ('AUTH-998877', 1, '2025-10-10', '18:30:55', 'Lisa M.', 'Approved', 'Debit Card', '4892', 'Chip Entry', '235646', 25.00, 2.00, 24.00, 3.50);
INSERT INTO Receipt_Item (receipt_id, item_name, quantity, amount) VALUES ('AUTH-998877', 'Organic Bananas', 1.20, 2.28), ('AUTH-998877', 'Whole Wheat Bread', 1.00, 3.49), ('AUTH-998877', '2% Milk (1 Gallon)', 1.00, 3.89), ('AUTH-998877', 'Fresh Ground Coffee (12 oz)', 1.00, 9.99), ('AUTH-998877', 'Loyalty Card Savings', 1.00, -3.50);
select * from store;
select * from Receipt;
\pset pager off
select * from Receipt;
select * from Receipt_Item;
\o assignment2.sql
\s assignment2.sql
