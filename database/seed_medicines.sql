-- Medicine Catalog Seed Data
-- Run this script after creating the database schema
-- Usage: psql -h localhost -U pharmacy_user -d pharmacy_db -f database/seed_medicines.sql

-- Insert sample medicines
INSERT INTO medicines (id, name, generic_name, manufacturer, strength, form, prescription_required, schedule, description, image_url, status, created_at, updated_at) VALUES
-- Common tablets
('550e8400-e29b-41d4-a716-446655440001', 'Paracetamol 500mg', 'Paracetamol', 'Cipla Ltd', '500mg', 'TABLET', false, 'NONE', 'Paracetamol is used to treat mild to moderate pain and to reduce fever.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440002', 'Ibuprofen 400mg', 'Ibuprofen', 'Sun Pharma', '400mg', 'TABLET', false, 'NONE', 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to treat pain and inflammation.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440003', 'Amoxicillin 500mg', 'Amoxicillin', 'Dr. Reddy''s', '500mg', 'CAPSULE', true, 'H', 'Amoxicillin is an antibiotic used to treat various bacterial infections.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440004', 'Azithromycin 500mg', 'Azithromycin', 'Zydus Cadila', '500mg', 'TABLET', true, 'H', 'Azithromycin is an antibiotic used to treat various bacterial infections.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440005', 'Metformin 500mg', 'Metformin', 'Lupin Ltd', '500mg', 'TABLET', true, 'H', 'Metformin is used to treat type 2 diabetes by helping control blood sugar levels.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440006', 'Atorvastatin 10mg', 'Atorvastatin', 'Torrent Pharma', '10mg', 'TABLET', true, 'H', 'Atorvastatin is used to lower cholesterol and reduce the risk of heart disease.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440007', 'Omeprazole 20mg', 'Omeprazole', 'Alkem Laboratories', '20mg', 'CAPSULE', true, 'H', 'Omeprazole is used to treat acid reflux and stomach ulcers.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440008', 'Cetirizine 10mg', 'Cetirizine', 'Glenmark Pharma', '10mg', 'TABLET', false, 'NONE', 'Cetirizine is an antihistamine used to treat allergies and hay fever.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440009', 'Montelukast 10mg', 'Montelukast', 'Cipla Ltd', '10mg', 'TABLET', true, 'H', 'Montelukast is used to prevent asthma attacks and treat seasonal allergies.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440010', 'Losartan 50mg', 'Losartan', 'Sun Pharma', '50mg', 'TABLET', true, 'H', 'Losartan is used to treat high blood pressure and protect kidneys from diabetes.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Syrups
('550e8400-e29b-41d4-a716-446655440011', 'Cough Syrup', 'Dextromethorphan', 'Abbott India', '15mg/5ml', 'SYRUP', false, 'NONE', 'Cough suppressant syrup for dry cough relief.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440012', 'Paracetamol Syrup', 'Paracetamol', 'Cipla Ltd', '125mg/5ml', 'SYRUP', false, 'NONE', 'Fever and pain relief syrup for children.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440013', 'Amoxicillin Suspension', 'Amoxicillin', 'Dr. Reddy''s', '250mg/5ml', 'SYRUP', true, 'H', 'Antibiotic suspension for bacterial infections in children.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Creams and Ointments
('550e8400-e29b-41d4-a716-446655440014', 'Betamethasone Cream', 'Betamethasone', 'Cipla Ltd', '0.1%', 'CREAM', true, 'H', 'Topical corticosteroid cream for skin inflammation and itching.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440015', 'Mupirocin Ointment', 'Mupirocin', 'GlaxoSmithKline', '2%', 'CREAM', true, 'H', 'Antibacterial ointment for skin infections.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440016', 'Hydrocortisone Cream', 'Hydrocortisone', 'Cipla Ltd', '1%', 'CREAM', false, 'NONE', 'Mild corticosteroid cream for minor skin irritations.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Drops
('550e8400-e29b-41d4-a716-446655440017', 'Tobramycin Eye Drops', 'Tobramycin', 'Alcon', '0.3%', 'DROPS', true, 'H', 'Antibiotic eye drops for bacterial eye infections.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440018', 'Artificial Tears', 'Carboxymethylcellulose', 'Allergan', '0.5%', 'DROPS', false, 'NONE', 'Lubricating eye drops for dry eyes.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Schedule H1 medicines
('550e8400-e29b-41d4-a716-446655440019', 'Alprazolam 0.5mg', 'Alprazolam', 'Sun Pharma', '0.5mg', 'TABLET', true, 'H1', 'Benzodiazepine used to treat anxiety and panic disorders.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440020', 'Clonazepam 0.5mg', 'Clonazepam', 'Intas Pharma', '0.5mg', 'TABLET', true, 'H1', 'Anticonvulsant and anti-anxiety medication.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Schedule X medicines
('550e8400-e29b-41d4-a716-446655440021', 'Morphine 10mg', 'Morphine', 'Sun Pharma', '10mg', 'TABLET', true, 'X', 'Strong opioid painkiller for severe pain. Requires special prescription.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- More common medicines
('550e8400-e29b-41d4-a716-446655440022', 'Aspirin 75mg', 'Aspirin', 'Bayer', '75mg', 'TABLET', false, 'NONE', 'Low-dose aspirin for heart attack and stroke prevention.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440023', 'Vitamin D3 60k IU', 'Cholecalciferol', 'Cipla Ltd', '60000 IU', 'CAPSULE', false, 'NONE', 'Vitamin D supplement for bone health.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440024', 'Calcium + Vitamin D3', 'Calcium Carbonate + Cholecalciferol', 'Cipla Ltd', '500mg + 250IU', 'TABLET', false, 'NONE', 'Calcium and Vitamin D supplement for bone strength.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440025', 'Folic Acid 5mg', 'Folic Acid', 'Sun Pharma', '5mg', 'TABLET', false, 'NONE', 'Folic acid supplement, especially important during pregnancy.', NULL, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert medicine inventory (pricing and stock)
INSERT INTO medicine_inventory (id, medicine_id, batch_number, expiry_date, quantity_available, unit_price, mrp, discount_percentage, warehouse_location, created_at, updated_at) VALUES
-- Paracetamol 500mg
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'BATCH001', '2026-12-31', 1000, 2.50, 5.00, 50.00, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'BATCH002', '2027-06-30', 500, 2.30, 5.00, 54.00, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Ibuprofen 400mg
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'BATCH003', '2026-11-30', 800, 3.50, 7.00, 50.00, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'BATCH004', '2027-03-31', 600, 3.20, 7.00, 54.29, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Amoxicillin 500mg
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'BATCH005', '2026-10-31', 300, 45.00, 90.00, 50.00, 'WH-B', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 'BATCH006', '2027-02-28', 250, 42.00, 90.00, 53.33, 'WH-B', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Azithromycin 500mg
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', 'BATCH007', '2026-09-30', 200, 55.00, 110.00, 50.00, 'WH-B', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004', 'BATCH008', '2027-01-31', 150, 52.00, 110.00, 52.73, 'WH-B', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Metformin 500mg
('660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440005', 'BATCH009', '2026-12-31', 500, 8.50, 17.00, 50.00, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440005', 'BATCH010', '2027-05-31', 400, 8.00, 17.00, 52.94, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Atorvastatin 10mg
('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440006', 'BATCH011', '2026-11-30', 350, 12.00, 24.00, 50.00, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440006', 'BATCH012', '2027-04-30', 300, 11.50, 24.00, 52.08, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Omeprazole 20mg
('660e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440007', 'BATCH013', '2026-10-31', 400, 15.00, 30.00, 50.00, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440007', 'BATCH014', '2027-03-31', 350, 14.00, 30.00, 53.33, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Cetirizine 10mg
('660e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440008', 'BATCH015', '2026-12-31', 600, 1.50, 3.00, 50.00, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440008', 'BATCH016', '2027-06-30', 500, 1.40, 3.00, 53.33, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Montelukast 10mg
('660e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440009', 'BATCH017', '2026-11-30', 250, 18.00, 36.00, 50.00, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440009', 'BATCH018', '2027-04-30', 200, 17.00, 36.00, 52.78, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Losartan 50mg
('660e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440010', 'BATCH019', '2026-10-31', 300, 22.00, 44.00, 50.00, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', 'BATCH020', '2027-02-28', 250, 21.00, 44.00, 52.27, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Cough Syrup
('660e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440011', 'BATCH021', '2026-12-31', 150, 85.00, 170.00, 50.00, 'WH-C', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440011', 'BATCH022', '2027-05-31', 120, 80.00, 170.00, 52.94, 'WH-C', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Paracetamol Syrup
('660e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440012', 'BATCH023', '2026-11-30', 200, 45.00, 90.00, 50.00, 'WH-C', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440012', 'BATCH024', '2027-04-30', 180, 42.00, 90.00, 53.33, 'WH-C', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Amoxicillin Suspension
('660e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440013', 'BATCH025', '2026-10-31', 100, 120.00, 240.00, 50.00, 'WH-C', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440013', 'BATCH026', '2027-03-31', 80, 115.00, 240.00, 52.08, 'WH-C', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Betamethasone Cream
('660e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440014', 'BATCH027', '2026-12-31', 80, 65.00, 130.00, 50.00, 'WH-D', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440014', 'BATCH028', '2027-06-30', 60, 62.00, 130.00, 52.31, 'WH-D', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Mupirocin Ointment
('660e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440015', 'BATCH029', '2026-11-30', 70, 95.00, 190.00, 50.00, 'WH-D', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440015', 'BATCH030', '2027-04-30', 50, 90.00, 190.00, 52.63, 'WH-D', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Hydrocortisone Cream
('660e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440016', 'BATCH031', '2026-10-31', 100, 35.00, 70.00, 50.00, 'WH-D', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440016', 'BATCH032', '2027-02-28', 90, 33.00, 70.00, 52.86, 'WH-D', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Tobramycin Eye Drops
('660e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440017', 'BATCH033', '2026-12-31', 60, 75.00, 150.00, 50.00, 'WH-D', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440017', 'BATCH034', '2027-05-31', 50, 72.00, 150.00, 52.00, 'WH-D', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Artificial Tears
('660e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440018', 'BATCH035', '2026-11-30', 120, 120.00, 240.00, 50.00, 'WH-D', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440018', 'BATCH036', '2027-04-30', 100, 115.00, 240.00, 52.08, 'WH-D', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Alprazolam 0.5mg
('660e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440019', 'BATCH037', '2026-10-31', 50, 25.00, 50.00, 50.00, 'WH-E', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440019', 'BATCH038', '2027-03-31', 40, 24.00, 50.00, 52.00, 'WH-E', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Clonazepam 0.5mg
('660e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440020', 'BATCH039', '2026-12-31', 45, 28.00, 56.00, 50.00, 'WH-E', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440020', 'BATCH040', '2027-06-30', 35, 27.00, 56.00, 51.79, 'WH-E', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Morphine 10mg (Schedule X - controlled substance)
('660e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440021', 'BATCH041', '2026-11-30', 10, 150.00, 300.00, 50.00, 'WH-E', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Aspirin 75mg
('660e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440022', 'BATCH042', '2026-10-31', 400, 1.20, 2.40, 50.00, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440022', 'BATCH043', '2027-02-28', 350, 1.15, 2.40, 52.08, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Vitamin D3 60k IU
('660e8400-e29b-41d4-a716-446655440044', '550e8400-e29b-41d4-a716-446655440023', 'BATCH044', '2026-12-31', 200, 35.00, 70.00, 50.00, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440045', '550e8400-e29b-41d4-a716-446655440023', 'BATCH045', '2027-05-31', 180, 33.00, 70.00, 52.86, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Calcium + Vitamin D3
('660e8400-e29b-41d4-a716-446655440046', '550e8400-e29b-41d4-a716-446655440024', 'BATCH046', '2026-11-30', 250, 2.50, 5.00, 50.00, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440047', '550e8400-e29b-41d4-a716-446655440024', 'BATCH047', '2027-04-30', 220, 2.40, 5.00, 52.00, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Folic Acid 5mg
('660e8400-e29b-41d4-a716-446655440048', '550e8400-e29b-41d4-a716-446655440025', 'BATCH048', '2026-10-31', 300, 0.80, 1.60, 50.00, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('660e8400-e29b-41d4-a716-446655440049', '550e8400-e29b-41d4-a716-446655440025', 'BATCH049', '2027-03-31', 280, 0.75, 1.60, 53.13, 'WH-A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Verify the data
SELECT 
    m.name,
    m.form,
    m.prescription_required,
    m.schedule,
    SUM(mi.quantity_available) as total_stock,
    MIN(mi.unit_price) as min_price,
    MIN(mi.mrp) as min_mrp,
    MAX(mi.discount_percentage) as max_discount
FROM medicines m
LEFT JOIN medicine_inventory mi ON m.id = mi.medicine_id
WHERE m.status = 'ACTIVE'
GROUP BY m.id, m.name, m.form, m.prescription_required, m.schedule
ORDER BY m.name;


