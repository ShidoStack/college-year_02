create database assignment8;
\c assignment8
\pset pager off
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,
    customer_name VARCHAR(50),
    city VARCHAR(50),
    country VARCHAR(50)
);

CREATE TABLE products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(50),
    category VARCHAR(50),
    price DECIMAL(10,2)
);

CREATE TABLE orders (
    order_id INT PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    product_id INT REFERENCES products(product_id),
    order_date DATE,
    quantity INT
);
\dt
INSERT INTO customers VALUES
(1, 'Aarav', 'Mumbai', 'India'),
(2, 'Diya', 'Pune', 'India'),
(3, 'Kabir', 'Delhi', 'India'),
(4, 'Meera', 'Nashik', 'India'),
(5, 'Rohan', 'Bangalore', 'India'),
(6, 'Isha', 'Jaipur', 'India'),
(7, 'Arjun', 'Surat', 'India'),
(8, 'Neha', 'Chennai', 'India');
INSERT INTO products VALUES
(101, 'Laptop', 'Electronics', 70000),
(102, 'Headphones', 'Electronics', 5000),
(103, 'Mouse', 'Electronics', 1200),
(104, 'Keyboard', 'Electronics', 3000),
(105, 'Chair', 'Furniture', 8000),
(106, 'Desk', 'Furniture', 12000),
(107, 'Notebook', 'Stationery', 500),
(108, 'Pen', 'Stationery', 100),
(109, 'Backpack', 'Stationery', 1500),
(110, 'Bottle', 'Accessories', 800),
(111, 'Tablet', 'Electronics', 5000);
INSERT INTO orders VALUES
(1001, 1, 101, '2026-09-01', 1),
(1002, 1, 103, '2026-09-03', 2),
(1003, 2, 102, '2026-09-02', 1),
(1004, 2, 105, '2026-09-05', 3),
(1005, 3, 106, '2026-09-01', 1),
(1006, 3, 107, '2026-09-06', 5),
(1007, 4, 108, '2026-09-02', 10),
(1008, 4, 109, '2026-09-04', 2),
(1009, 5, 104, '2026-09-03', 1),
(1010, 5, 110, '2026-09-07', 4),
(1011, 1, 105, '2026-09-08', 2),
(1012, 6, 102, '2026-09-09', 2),
(1013, 7, 103, '2026-09-10', 1),
(1014, 3, 102, '2026-09-11', 1);
SELECT * FROM customers;
SELECT * FROM products;
SELECT * FROM orders;
-- Name: Lokendra, Roll No: 150096725062
SELECT customer_name, city
FROM customers
WHERE customer_id IN (
    SELECT customer_id
    FROM orders
);
-- Name: Lokendra, Roll No: 150096725062
SELECT product_name, price
FROM products
WHERE price > (
    SELECT AVG(price)
    FROM products
);
-- Name: Lokendra, Roll No: 150096725062
SELECT customer_name
FROM customers
WHERE customer_id NOT IN (
    SELECT customer_id
    FROM orders
);
-- Name: Lokendra, Roll No: 150096725062
SELECT c.customer_name,
       (
           SELECT COUNT(*)
           FROM orders o
           WHERE o.customer_id = c.customer_id
       ) AS order_count
FROM customers c;
-- Name: Lokendra, Roll No: 150096725062
SELECT p.product_name
FROM products p
WHERE NOT EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.product_id = p.product_id
);
-- Name: Lokendra, Roll No: 150096725062
SELECT order_id, order_date, quantity,
       SUM(quantity) OVER (
           ORDER BY order_date, order_id
       ) AS running_total
FROM orders;
-- Name: Lokendra, Roll No: 150096725062
SELECT order_id, quantity,
       AVG(quantity) OVER () AS average_quantity
FROM orders;
-- Name: Lokendra, Roll No: 150096725062
SELECT customer_id, order_id, order_date, quantity,
       SUM(quantity) OVER (
           PARTITION BY customer_id
           ORDER BY order_date, order_id
       ) AS running_total
FROM orders;
-- Name: Lokendra, Roll No: 150096725062
SELECT category, product_name, price,
       AVG(price) OVER (
           PARTITION BY category
       ) AS category_average
FROM products;
-- Name: Lokendra, Roll No: 150096725062
SELECT category, product_name, price,
       price - AVG(price) OVER (
           PARTITION BY category
       ) AS difference
FROM products;
-- Name: Lokendra, Roll No: 150096725062
SELECT customer_id, order_id, order_date,
       ROW_NUMBER() OVER (
           PARTITION BY customer_id
           ORDER BY order_date
       ) AS row_number
FROM orders;
-- Name: Lokendra, Roll No: 150096725062
SELECT category, product_name, price
FROM (
    SELECT category, product_name, price,
           ROW_NUMBER() OVER (
               PARTITION BY category
               ORDER BY price DESC
           ) AS rn
    FROM products
) p
WHERE rn = 1;
-- Name: Lokendra, Roll No: 150096725062
SELECT category, product_name, price,
       RANK() OVER (
           PARTITION BY category
           ORDER BY price DESC
       ) AS price_rank
FROM products;
-- Name: Lokendra, Roll No: 150096725062
SELECT customer_name, total_quantity, customer_rank
FROM (
    SELECT c.customer_name,
           SUM(o.quantity) AS total_quantity,
           RANK() OVER (
               ORDER BY SUM(o.quantity) DESC
           ) AS customer_rank
    FROM customers c
    JOIN orders o
      ON c.customer_id = o.customer_id
    GROUP BY c.customer_id, c.customer_name
) x
WHERE customer_rank <= 3;
-- Name: Lokendra, Roll No: 150096725062
SELECT product_name, price, price_rank
FROM (
    SELECT product_name, price,
           DENSE_RANK() OVER (
               ORDER BY price DESC
           ) AS price_rank
    FROM products
) p
WHERE price_rank <= 5;
\q
\l
clear
\q
\l
\q
-- Name: Lokendra, Roll No: 150096725062
CREATE DATABASE car_rental_system;
\pset pager on
-- Name: Lokendra, Roll No: 150096725062
CREATE TABLE branches (
    branch_id SERIAL PRIMARY KEY,
    branch_name VARCHAR(100) UNIQUE,
    city VARCHAR(50)
);
-- Name: Lokendra, Roll No: 150096725062
CREATE TABLE cars (
    car_id SERIAL PRIMARY KEY,
    branch_id INT REFERENCES branches(branch_id),
    registration_number VARCHAR(20) UNIQUE,
    model VARCHAR(50),
    daily_rate NUMERIC(8,2)
);
-- Name: Lokendra, Roll No: 150096725062
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    license_number VARCHAR(20) UNIQUE,
    customer_details JSONB
);
drop table branches;
drop table customers
;
drop table cars;
drop table branches;
drop database car_rental_system;
\l
clear
\q
\q
-- Name: Lokendra, Roll No: 150096725062
CREATE DATABASE car_rental_system;
\c car_rental_system
-- Name: Lokendra, Roll No: 150096725062
CREATE TABLE branches (
    branch_id SERIAL PRIMARY KEY,
    branch_name VARCHAR(100) UNIQUE,
    city VARCHAR(50)
);

CREATE TABLE cars (
    car_id SERIAL PRIMARY KEY,
    branch_id INT REFERENCES branches(branch_id),
    registration_number VARCHAR(20) UNIQUE,
    model VARCHAR(50),
    daily_rate NUMERIC(8,2)
);

CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    license_number VARCHAR(20) UNIQUE,
    customer_details JSONB
);

CREATE TABLE rentals (
    rental_id SERIAL PRIMARY KEY,
    car_id INT REFERENCES cars(car_id),
    customer_id INT REFERENCES customers(customer_id),
    pickup_date DATE,
    return_date DATE,
    status VARCHAR(20),
    UNIQUE (car_id, pickup_date)
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    rental_id INT REFERENCES rentals(rental_id),
    amount NUMERIC(10,2),
    payment_date DATE
);
-- Name: Lokendra, Roll No: 150096725062
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
-- Name: Lokendra, Roll No: 150096725062
INSERT INTO branches (branch_name, city)
VALUES
('Andheri Branch', 'Mumbai'),
('Koramangala Branch', 'Bengaluru'),
('Vashi Branch', 'Navi Mumbai'),
('Pune Central Branch', 'Pune'),
('Thane West Branch', 'Thane'),
('Powai Branch', 'Mumbai'),
('Gurgaon Branch', 'Gurugram'),
('Noida Sector 18 Branch', 'Noida');
-- Name: Lokendra, Roll No: 150096725062
SELECT * FROM branches
ORDER BY branch_id;
-- Name: Lokendra, Roll No: 150096725062
INSERT INTO cars
(branch_id, registration_number, model, daily_rate)
VALUES
(1, 'MH01AB1234', 'Swift', 1800),
(1, 'MH01CD5678', 'Innova', 3200),
(2, 'KA05EF9012', 'Creta', 2800),
(3, 'MH43GH3456', 'Baleno', 1900),
(4, 'MH12IJ7890', 'City', 2500),
(5, 'MH04KL2468', 'Nexon', 2200),
(6, 'MH03MN1357', 'XUV700', 3500),
(7, 'HR26PQ8642', 'Venue', 2100);
-- Name: Lokendra, Roll No: 150096725062
SELECT * FROM cars
ORDER BY car_id;
-- Name: Lokendra, Roll No: 150096725062
INSERT INTO customers
(license_number, customer_details)
VALUES
(
    'DL1420110012345',
    '{"license_expiry":"2027-05-01","preferred_car_type":"SUV","age":24}'
),
(
    'MH1220220067890',
    '{"license_expiry":"2028-02-15","preferred_car_type":"Hatchback","age":29}'
),
(
    'KA0520190034567',
    '{"license_expiry":"2027-11-20","preferred_car_type":"Sedan","age":32}'
),
(
    'MH1420210089123',
    '{"license_expiry":"2029-01-10","preferred_car_type":"SUV","age":27}'
),
(
    'GJ0120200045678',
    '{"license_expiry":"2027-08-30","preferred_car_type":"Hatchback","age":35}'
),
(
    'MH2020230076543',
    '{"license_expiry":"2028-06-12","preferred_car_type":"Sedan","age":22}'
),
(
    'HR2620180023456',
    '{"license_expiry":"2027-03-25","preferred_car_type":"SUV","age":41}'
),
(
    'UP1620240098765',
    '{"license_expiry":"2029-09-05","preferred_car_type":"Hatchback","age":26}'
);
-- Name: Lokendra, Roll No: 150096725062
SELECT * FROM customers
ORDER BY customer_id;
-- Name: Lokendra, Roll No: 150096725062
INSERT INTO rentals
(car_id, customer_id, pickup_date, return_date, status)
VALUES
(1, 1, '2026-08-01', '2026-08-04', 'completed'),
(2, 1, '2026-08-10', '2026-08-12', 'completed'),
(3, 1, '2026-09-01', '2026-09-04', 'completed'),
(4, 2, '2026-08-15', '2026-08-18', 'completed'),
(5, 3, '2026-09-05', '2026-09-08', 'completed'),
(6, 4, '2026-09-10', '2026-09-13', 'completed'),
(7, 5, '2026-09-14', '2026-09-17', 'completed'),
(8, 6, '2026-08-01', '2026-08-05', 'active');
-- Name: Lokendra, Roll No: 150096725062
SELECT * FROM rentals
ORDER BY rental_id;
-- Name: Lokendra, Roll No: 150096725062
INSERT INTO payments
(rental_id, amount, payment_date)
VALUES
(1, 5400, '2026-08-04'),
(2, 6400, '2026-08-12'),
(3, 8400, '2026-09-04'),
(4, 5700, '2026-08-18'),
(5, 7500, '2026-09-08'),
(6, 6600, '2026-09-13'),
(7, 10500, '2026-09-17'),
(8, 8400, '2026-08-05');
-- Name: Lokendra, Roll No: 150096725062
SELECT * FROM payments
ORDER BY payment_id;
-- Name: Lokendra, Roll No: 150096725062
SELECT
    r.rental_id,
    cst.customer_id,
    cst.license_number,
    c.car_id,
    c.model,
    b.branch_name,
    b.city,
    r.pickup_date,
    r.return_date,
    r.status,
    p.amount AS payment_amount
FROM rentals r
JOIN customers cst
    ON r.customer_id = cst.customer_id
JOIN cars c
    ON r.car_id = c.car_id
JOIN branches b
    ON c.branch_id = b.branch_id
LEFT JOIN payments p
    ON r.rental_id = p.rental_id
ORDER BY r.rental_id;
-- Name: Lokendra, Roll No: 150096725062
SELECT
    customer_id,
    COUNT(*) AS rental_count
FROM rentals
GROUP BY customer_id
ORDER BY customer_id;
-- Name: Lokendra, Roll No: 150096725062
SELECT AVG(rental_count) AS average_rentals
FROM
(
    SELECT
        customer_id,
        COUNT(*) AS rental_count
    FROM rentals
    GROUP BY customer_id
) AS rental_counts;
-- Name: Lokendra, Roll No: 150096725062
SELECT
    customer_id,
    COUNT(*) AS rental_count
FROM rentals
GROUP BY customer_id
HAVING COUNT(*) >
(
    SELECT AVG(rental_count)
    FROM
    (
        SELECT
            customer_id,
            COUNT(*) AS rental_count
        FROM rentals
        GROUP BY customer_id
    ) AS rental_counts
);
-- Name: Lokendra, Roll No: 150096725062
SELECT
    customer_id,
    customer_details
FROM customers
ORDER BY customer_id;
-- Name: Lokendra, Roll No: 150096725062
SELECT
    customer_id,
    customer_details ->> 'preferred_car_type' AS preferred_car_type
FROM customers
ORDER BY customer_id;
-- Name: Lokendra, Roll No: 150096725062
SELECT
    customer_id,
    license_number,
    customer_details
FROM customers
WHERE customer_details ->> 'preferred_car_type' = 'SUV'
ORDER BY customer_id;
-- Name: Lokendra, Roll No: 150096725062
SELECT *
FROM rentals
WHERE car_id = 1
AND pickup_date < DATE '2026-09-23'
AND return_date > DATE '2026-09-21';
-- Name: Lokendra, Roll No: 150096725062
BEGIN;
-- Name: Lokendra, Roll No: 150096725062
INSERT INTO rentals
(car_id, customer_id, pickup_date, return_date, status)
VALUES
(1, 8, '2026-09-21', '2026-09-23', 'active')
RETURNING rental_id;
-- Name: Lokendra, Roll No: 150096725062
SAVEPOINT payment_savepoint;
-- Name: Lokendra, Roll No: 150096725062
SELECT
    r.rental_id,
    c.model,
    c.daily_rate,
    (r.return_date - r.pickup_date) AS rental_days,
    c.daily_rate * (r.return_date - r.pickup_date) AS required_amount
FROM rentals r
JOIN cars c
    ON r.car_id = c.car_id
WHERE r.rental_id = 9;
-- Name: Lokendra, Roll No: 150096725062
INSERT INTO payments
(rental_id, amount, payment_date)
VALUES
(9, 3600, CURRENT_DATE);
-- Name: Lokendra, Roll No: 150096725062
SELECT
    r.rental_id,
    r.customer_id,
    r.car_id,
    r.pickup_date,
    r.return_date,
    r.status,
    p.amount AS payment_amount
FROM rentals r
JOIN payments p
    ON r.rental_id = p.rental_id
WHERE r.rental_id = 9;
-- Name: Lokendra, Roll No: 150096725062
COMMIT;
-- Name: Lokendra, Roll No: 150096725062
SELECT
    r.rental_id,
    r.customer_id,
    c.model,
    r.pickup_date,
    r.return_date,
    r.status,
    p.amount
FROM rentals r
JOIN cars c
    ON r.car_id = c.car_id
JOIN payments p
    ON r.rental_id = p.rental_id
WHERE r.rental_id = 9;
-- Name: Lokendra, Roll No: 150096725062
BEGIN;
-- Name: Lokendra, Roll No: 150096725062
INSERT INTO rentals
(car_id, customer_id, pickup_date, return_date, status)
VALUES
(2, 7, '2026-09-21', '2026-09-23', 'active')
RETURNING rental_id;
-- Name: Lokendra, Roll No: 150096725062
SAVEPOINT payment_savepoint;
-- Name: Lokendra, Roll No: 150096725062
SELECT
    c.daily_rate * (r.return_date - r.pickup_date) AS required_amount
FROM rentals r
JOIN cars c
    ON r.car_id = c.car_id
WHERE r.rental_id = 10;
-- Name: Lokendra, Roll No: 150096725062
INSERT INTO payments
(rental_id, amount, payment_date)
VALUES
(10, 5000, CURRENT_DATE);
SELECT * FROM payments 
WHERE payment_date >= CURRENT_DATE;
-- Name: Lokendra, Roll No: 150096725062
ROLLBACK TO SAVEPOINT payment_savepoint;
-- Name: Lokendra, Roll No: 150096725062
SELECT
    r.rental_id,
    r.status,
    p.payment_id,
    p.amount
FROM rentals r
LEFT JOIN payments p
    ON r.rental_id = p.rental_id
WHERE r.rental_id = 10;
-- Name: Lokendra, Roll No: 150096725062
COMMIT;
-- Name: Lokendra, Roll No: 150096725062
SELECT
    r.rental_id,
    r.customer_id,
    c.model,
    r.pickup_date,
    r.return_date,
    r.status,
    p.amount
FROM rentals r
JOIN cars c
    ON r.car_id = c.car_id
JOIN payments p
    ON r.rental_id = p.rental_id
WHERE r.rental_id = 10;
-- Name: Lokendra, Roll No: 150096725062
SELECT
    rental_id,
    customer_id,
    car_id,
    pickup_date,
    return_date,
    return_date - pickup_date AS rental_duration_days,
    status
FROM rentals
ORDER BY rental_id;
-- Name: Lokendra, Roll No: 150096725062
SELECT
    rental_id,
    customer_id,
    car_id,
    pickup_date,
    return_date,
    status,
    CURRENT_DATE - return_date AS overdue_days
FROM rentals
WHERE return_date < CURRENT_DATE
AND status = 'active'
ORDER BY rental_id;
\s Car_Rental_System_Complete_Work.sql
