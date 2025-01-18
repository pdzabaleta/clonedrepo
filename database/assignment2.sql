-- Insert Tony Stark
INSERT INTO account (first_name, last_name, email, password)
VALUES ('Tony', 'Stark', 'tony.stark@byui.edu', 'Iam1ronM@n');

-- Change Tony Stark's account type to Admin
UPDATE account
SET account_type = 'Admin'
WHERE email = 'tony.stark@byui.edu';

-- Delete Tony Stark
DELETE FROM account
WHERE email = 'tony.stark@byui.edu';

-- Update GM Hummer description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Get Sport category inventory with classification
SELECT inv_make, inv_model, classification_name
FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification_name = 'Sport';

-- Update image paths
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
