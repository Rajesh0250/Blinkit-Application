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

ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100) DEFAULT 'General';
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand VARCHAR(100) DEFAULT 'Generic';
ALTER TABLE products ADD COLUMN IF NOT EXISTS unit VARCHAR(50) DEFAULT 'pcs';
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url VARCHAR(255) DEFAULT '';

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  items JSONB NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'placed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carts (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, role)
VALUES ('demo', 'demo123', 'customer')
ON CONFLICT (username) DO NOTHING;

INSERT INTO products (name, price, category, subcategory, brand, unit, stock, description, image_url)
VALUES
  ('Fresh Apples', 3.50, 'Fruits', 'Fruit', 'Farm Fresh', 'kg', 120, 'Crisp and sweet apples', '🍎'),
  ('Bananas', 2.40, 'Fruits', 'Fruit', 'Farm Fresh', 'dozen', 90, 'Ripe bananas for smoothies and snacks', '🍌'),
  ('Sweet Mangoes', 4.80, 'Fruits', 'Fruit', 'Seasonal', 'kg', 75, 'Juicy mangoes full of flavor', '🥭'),
  ('Pineapple', 3.20, 'Fruits', 'Fruit', 'Tropical', 'pcs', 60, 'Fresh pineapple slices and chunks', '🍍'),
  ('Tomatoes', 2.10, 'Vegetables', 'Vegetable', 'Fresh', 'kg', 140, 'Juicy tomatoes for cooking', '🍅'),
  ('Onions', 1.90, 'Vegetables', 'Vegetable', 'Fresh', 'kg', 130, 'Cooking onions for everyday meals', '🧅'),
  ('Spinach', 2.60, 'Vegetables', 'Leafy', 'Fresh', 'bunch', 85, 'Clean and fresh spinach leaves', '🥬'),
  ('Potatoes', 1.70, 'Vegetables', 'Vegetable', 'Fresh', 'kg', 150, 'Perfect for curries and fries', '🥔'),
  ('Milk', 2.20, 'Dairy', 'Milk', 'Amul', 'litre', 80, 'Fresh toned milk', '🥛'),
  ('Paneer', 5.40, 'Dairy', 'Cheese', 'Milky Mist', '500g', 55, 'Soft and fresh paneer cubes', '🧀'),
  ('Butter', 3.10, 'Dairy', 'Butter', 'Amul', '200g', 70, 'Creamy salted butter', '🧈'),
  ('Bread', 1.80, 'Bakery', 'Bakery', 'Britannia', 'loaf', 60, 'Soft loaf for breakfast', '🍞'),
  ('Brown Bread', 2.10, 'Bakery', 'Bakery', 'Nature', 'loaf', 45, 'Healthy brown bread', '🥖'),
  ('Orange Juice', 4.10, 'Beverages', 'Juice', 'Real', '1L', 40, '100% fresh orange juice', '🧃'),
  ('Water Bottles', 2.50, 'Beverages', 'Water', 'Aquafina', 'pack', 100, 'Pack of 6 drinking bottles', '💧'),
  ('Digestive Biscuits', 3.20, 'Snacks', 'Snacks', 'Britannia', 'pack', 88, 'Crunchy digestive biscuits', '🍪'),
  ('Rice', 4.90, 'Groceries', 'Grains', 'India Gate', '1kg', 110, 'Basmati rice for daily meals', '🍚'),
  ('Dal', 3.80, 'Groceries', 'Pulses', 'Tata', '1kg', 95, 'Split lentils for curries', '🫘'),
  ('Cooking Oil', 6.20, 'Groceries', 'Oils', 'Fortune', '1L', 78, 'Refined cooking oil', '🫒'),
  ('Salt', 1.20, 'Groceries', 'Spices', 'Tata', '1kg', 140, 'Fine table salt', '🧂'),
  ('Pasta', 2.70, 'Groceries', 'Pasta', 'Barilla', '500g', 92, 'Quick pasta for busy days', '🍝'),
  ('Pressure Cooker', 24.90, 'Kitchen Essentials', 'Cookware', 'Prestige', 'pcs', 30, 'Fast cooking pressure cooker', '🍳'),
  ('Cutlery Set', 9.80, 'Kitchen Essentials', 'Cookware', 'Home', 'set', 42, 'Dinner set for everyday use', '🍴'),
  ('Dishwashing Liquid', 2.95, 'Household', 'Cleaning', 'Vim', '500ml', 65, 'Powerful dishwash liquid', '🧼'),
  ('Toilet Cleaner', 3.40, 'Household', 'Cleaning', 'Harpic', '500ml', 58, 'Fresh and effective toilet cleaner', '🧴'),
  ('Paracetamol', 12.50, 'Pharmacy', 'Pain Relief', 'Cipla', 'strip', 70, 'Fast relief from fever and mild pain', '💊'),
  ('Vitamin C', 8.90, 'Pharmacy', 'Supplements', 'Revital', 'bottle', 45, 'Daily vitamin supplement', '🧪'),
  ('Hand Sanitizer', 3.60, 'Pharmacy', 'Personal Care', 'Dettol', '250ml', 90, 'Alcohol-based sanitizer', '🧴')
ON CONFLICT DO NOTHING;
