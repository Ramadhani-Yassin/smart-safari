-- Check and fix booking table structure
USE smart_travel;

-- Check if booking table exists and its structure
DESCRIBE booking;

-- Check if there are any existing bookings
SELECT COUNT(*) as total_bookings FROM booking;

-- Check for any NULL values in required fields
SELECT 
    COUNT(*) as total_records,
    COUNT(customer_id) as customer_id_count,
    COUNT(route_id) as route_id_count,
    COUNT(scheduled_time) as scheduled_time_count,
    COUNT(status) as status_count
FROM booking;

-- Check if users table has the required customer
SELECT id, name, email, role FROM users WHERE role = 'USER' LIMIT 5;

-- Check if routes table has data
SELECT id, origin, destination, price FROM route LIMIT 5;

-- If booking table doesn't exist or has issues, create it properly
-- This is a backup in case the table is corrupted
CREATE TABLE IF NOT EXISTS booking_backup AS SELECT * FROM booking;

-- Show the current booking table structure
SHOW CREATE TABLE booking; 