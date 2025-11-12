-- Seed data for development and testing
-- This file contains sample data for MVP testing

-- Insert sample medicines
INSERT INTO medicines (id, name, generic_name, manufacturer, strength, form, prescription_required, schedule, description, status) VALUES
(uuid_generate_v4(), 'Paracetamol 500mg', 'Paracetamol', 'Cipla Ltd', '500mg', 'TABLET', FALSE, 'NONE', 'Pain reliever and fever reducer', 'ACTIVE'),
(uuid_generate_v4(), 'Amoxicillin 250mg', 'Amoxicillin', 'Sun Pharma', '250mg', 'CAPSULE', TRUE, 'H', 'Antibiotic for bacterial infections', 'ACTIVE'),
(uuid_generate_v4(), 'Cetirizine 10mg', 'Cetirizine', 'Dr. Reddy''s', '10mg', 'TABLET', FALSE, 'NONE', 'Antihistamine for allergies', 'ACTIVE'),
(uuid_generate_v4(), 'Omeprazole 20mg', 'Omeprazole', 'Lupin Ltd', '20mg', 'CAPSULE', TRUE, 'H', 'Proton pump inhibitor for acid reflux', 'ACTIVE'),
(uuid_generate_v4(), 'Metformin 500mg', 'Metformin', 'Torrent Pharma', '500mg', 'TABLET', TRUE, 'H', 'Antidiabetic medication', 'ACTIVE'),
(uuid_generate_v4(), 'Atorvastatin 10mg', 'Atorvastatin', 'Cadila Healthcare', '10mg', 'TABLET', TRUE, 'H', 'Cholesterol lowering medication', 'ACTIVE'),
(uuid_generate_v4(), 'Amlodipine 5mg', 'Amlodipine', 'Mankind Pharma', '5mg', 'TABLET', TRUE, 'H', 'Blood pressure medication', 'ACTIVE'),
(uuid_generate_v4(), 'Azithromycin 500mg', 'Azithromycin', 'Zydus Cadila', '500mg', 'TABLET', TRUE, 'H', 'Antibiotic for respiratory infections', 'ACTIVE'),
(uuid_generate_v4(), 'Montelukast 10mg', 'Montelukast', 'Glenmark Pharma', '10mg', 'TABLET', TRUE, 'H', 'Asthma and allergy medication', 'ACTIVE'),
(uuid_generate_v4(), 'Pantoprazole 40mg', 'Pantoprazole', 'Alkem Laboratories', '40mg', 'TABLET', TRUE, 'H', 'Proton pump inhibitor', 'ACTIVE');

-- Insert sample inventory (linking to medicines)
-- Note: In production, you'd need to get the actual medicine IDs from the above inserts
-- For now, this is a template that would need to be adjusted based on actual IDs

-- Example inventory entries (adjust medicine_id based on actual inserts)
-- INSERT INTO medicine_inventory (medicine_id, batch_number, expiry_date, quantity_available, unit_price, mrp, discount_percentage, warehouse_location)
-- SELECT 
--     id,
--     'BATCH-' || substr(md5(random()::text), 1, 8),
--     CURRENT_DATE + INTERVAL '2 years',
--     1000,
--     5.00,
--     10.00,
--     0,
--     'WH-001'
-- FROM medicines
-- LIMIT 10;


