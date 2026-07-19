CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer'
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INT NOT NULL DEFAULT 100
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, role)
VALUES ('demo', 'demo123', 'customer')
ON CONFLICT (username) DO NOTHING;

INSERT INTO products (name, price, category, stock)
VALUES
  ('Fresh Apples', 3.50, 'Groceries', 120),
  ('Milk', 2.20, 'Daily Essentials', 80),
  ('Bread', 1.80, 'Bakery', 60),
  ('Orange Juice', 4.10, 'Beverages', 40),
  ('Bananas', 2.40, 'Groceries', 90)
ON CONFLICT DO NOTHING;
