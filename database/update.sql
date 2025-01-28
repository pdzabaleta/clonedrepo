-- Insertar todos los registros con los detalles del vehículo actualizados
INSERT INTO inventory (inv_make, inv_model, inv_description, inv_image, inv_thumbnail, classification_id, inv_year, inv_price, inv_mileage) VALUES
('Lamborghini', 'Adventador', 'High-performance sports car', '/images/vehicles/adventador.jpg', '/images/vehicles/adventador-tn.jpg', 1, 2021, 400000, 5000),
('Aerocar', 'Aerocar', 'Flying car', '/images/vehicles/aerocar.jpg', '/images/vehicles/aerocar-tn.jpg', 2, 2020, 300000, 10000),
('Batmobile', 'Batmobile', 'Fictional superhero car', '/images/vehicles/batmobile.jpg', '/images/vehicles/batmobile-tn.jpg', 3, 2022, 1000000, 0),
('Chevrolet', 'Camaro', 'Classic muscle car', '/images/vehicles/camaro.jpg', '/images/vehicles/camaro-tn.jpg', 1, 2019, 35000, 30000),
('Ford', 'Crown Victoria', 'Police interceptor', '/images/vehicles/crwn-vic.jpg', '/images/vehicles/crwn-vic-tn.jpg', 2, 2018, 20000, 50000),
('DeLorean', 'DMC-12', 'Famous time-travel car', '/images/vehicles/delorean.jpg', '/images/vehicles/delorean-tn.jpg', 3, 1985, 50000, 150000),
('Dog Car', 'Dog Car', 'Novelty vehicle', '/images/vehicles/dog-car.jpg', '/images/vehicles/dog-car-tn.jpg', 2, 2021, 15000, 1000),
('Cadillac', 'Escalade', 'Luxury SUV', '/images/vehicles/escalade.jpg', '/images/vehicles/escalade-tn.jpg', 2, 2020, 75000, 20000),
('Fire Truck', 'Fire Truck', 'Emergency vehicle', '/images/vehicles/fire-truck.jpg', '/images/vehicles/fire-truck-tn.jpg', 2, 2019, 100000, 10000),
('GM', 'Hummer', 'Small interiors', '/images/vehicles/hummer.jpg', '/images/vehicles/hummer-tn.jpg', 2, 2021, 55000, 25000),
('Mechanic', 'Mechanic', 'Service vehicle', '/images/vehicles/mechanic.jpg', '/images/vehicles/mechanic-tn.jpg', 3, 2022, 30000, 5000),
('Ford', 'Model T', 'Vintage car', '/images/vehicles/model-t.jpg', '/images/vehicles/model-t-tn.jpg', 1, 1927, 20000, 100000),
('Monster Truck', 'Monster Truck', 'Large wheels', '/images/vehicles/monster-truck.jpg', '/images/vehicles/monster-truck-tn.jpg', 2, 2021, 80000, 5000),
('Mystery Van', 'Mystery Van', 'Fictional van', '/images/vehicles/mystery-van.jpg', '/images/vehicles/mystery-van-tn.jpg', 3, 2020, 30000, 20000),
('Survan', 'Survan', 'Utility vehicle', '/images/vehicles/survan.jpg', '/images/vehicles/survan-tn.jpg', 2, 2021, 25000, 15000),
('Jeep', 'Wrangler', 'Off-road vehicle', '/images/vehicles/wrangler.jpg', '/images/vehicles/wrangler-tn.jpg', 2, 2022, 40000, 10000);
-- add news columns

ALTER TABLE inventory
ADD COLUMN inv_year INT,
ADD COLUMN inv_price DECIMAL(10, 2),
ADD COLUMN inv_mileage INT;
