-- Create the classification table
CREATE TABLE classification (
classification_id SERIAL PRIMARY KEY,
classification_name VARCHAR(50) NOT NULL
);

-- Create the inventory table
CREATE TABLE inventory (
inventory_id SERIAL PRIMARY KEY,
inv_make VARCHAR(50) NOT NULL,
inv_model VARCHAR(50) NOT NULL,
inv_description TEXT,
inv_image TEXT,
inv_thumbnail TEXT,
classification_id INT NOT NULL,
FOREIGN KEY (classification_id) REFERENCES classification(classification_id)
);

-- Create the account table
CREATE TABLE account (
account_id SERIAL PRIMARY KEY,
first_name VARCHAR(50) NOT NULL,
last_name VARCHAR(50) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(100) NOT NULL,
account_type VARCHAR(20) DEFAULT 'User'
);

-- Insert initial data into classification
INSERT INTO classification (classification_name) VALUES
('Sport'),
('SUV'),
('Sedan');

-- Insert initial data into inventory
INSERT INTO inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, classification_id) VALUES
('GM', 'Hummer', 'small interiors', '/images/gm-hummer.jpg', '/images/gm-hummer-thumb.jpg', 2),
('Toyota', 'Supra', 'high performance', '/images/toyota-supra.jpg', '/images/toyota-supra-thumb.jpg', 1),
('Ford', 'Mustang', 'classic muscle car', '/images/ford-mustang.jpg', '/images/ford-mustang-thumb.jpg', 1);

-- Insert initial data into account
INSERT INTO account (first_name, last_name, email, password, account_type) VALUES
('John', 'Doe', 'johndoe@byui.edu', '12345678', 'User');