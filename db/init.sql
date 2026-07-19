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
  ('Fresh Apples', 3.50, 'Fruits', 120),
  ('Bananas', 2.40, 'Fruits', 90),
  ('Sweet Mangoes', 4.80, 'Fruits', 75),
  ('Pineapple', 3.20, 'Fruits', 60),
  ('Tomatoes', 2.10, 'Vegetables', 140),
  ('Onions', 1.90, 'Vegetables', 130),
  ('Spinach', 2.60, 'Vegetables', 85),
  ('Potatoes', 1.70, 'Vegetables', 150),
  ('Milk', 2.20, 'Dairy', 80),
  ('Paneer', 5.40, 'Dairy', 55),
  ('Butter', 3.10, 'Dairy', 70),
  ('Bread', 1.80, 'Bakery', 60),
  ('Brown Bread', 2.10, 'Bakery', 45),
  ('Orange Juice', 4.10, 'Beverages', 40),
  ('Water Bottles', 2.50, 'Beverages', 100),
  ('Digestive Biscuits', 3.20, 'Snacks', 88),
  ('Rice', 4.90, 'Groceries', 110),
  ('Dal', 3.80, 'Groceries', 95),
  ('Cooking Oil', 6.20, 'Groceries', 78),
  ('Salt', 1.20, 'Groceries', 140),
  ('Pasta', 2.70, 'Groceries', 92),
  ('Pressure Cooker', 24.90, 'Kitchen Essentials', 30),
  ('Cutlery Set', 9.80, 'Kitchen Essentials', 42),
  ('Dishwashing Liquid', 2.95, 'Household', 65),
  ('Toilet Cleaner', 3.40, 'Household', 58)
ON CONFLICT DO NOTHING;
