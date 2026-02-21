-- =====================================================
-- STORE RATING DATABASE - WITH ALL CONSTRAINTS WORKING
-- =====================================================

-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS store_rating_db;
CREATE DATABASE store_rating_db;
USE store_rating_db;

-- =====================================================
-- SCHEMA SECTION WITH ALL CONSTRAINTS
-- =====================================================

-- Users table with ALL constraints
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT,
    role ENUM('admin', 'store_owner', 'normal_user') NOT NULL DEFAULT 'normal_user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- Name constraint: 20-60 characters
    CONSTRAINT chk_name_length CHECK (CHAR_LENGTH(name) >= 20 AND CHAR_LENGTH(name) <= 60),
    -- Address constraint: Max 400 characters
    CONSTRAINT chk_address_length CHECK (address IS NULL OR CHAR_LENGTH(address) <= 400),
    -- Email format validation via REGEXP
    CONSTRAINT chk_email_format CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Stores table
CREATE TABLE stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    owner_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
    -- Store address constraint: Max 400 characters
    CONSTRAINT chk_store_address_length CHECK (CHAR_LENGTH(address) <= 400),
    -- Store email format validation
    CONSTRAINT chk_store_email_format CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Ratings table
CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    store_id INT NOT NULL,
    rating INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_store (user_id, store_id),
    -- Rating constraint: 1-5
    CONSTRAINT chk_rating_range CHECK (rating >= 1 AND rating <= 5)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_stores_owner ON stores(owner_id);
CREATE INDEX idx_ratings_user ON ratings(user_id);
CREATE INDEX idx_ratings_store ON ratings(store_id);

-- =====================================================
-- SEED DATA SECTION - ALL NAMES VERIFIED 20+ CHARACTERS
-- =====================================================

-- First, let's verify each name length with a comment
INSERT INTO users (name, email, password, address, role) VALUES
-- Admin Users
('Johnathan Administrator Smith', 'admin1@example.com', 'Admin@123', '123 Admin Tower, New York, NY 10001', 'admin'),
('Sarah Michelle Johnson', 'admin2@example.com', 'Secure#45', '456 Management Plaza, Los Angeles, CA 90001', 'admin'),

-- Store Owners
('Robert Christopher Anderson', 'owner1@example.com', 'Owner@456', '789 Merchant Avenue, Chicago, IL 60601', 'store_owner'),
('Elizabeth Margaret Thompson', 'owner2@example.com', 'Thompson#9', '321 Retail Street, Houston, TX 77001', 'store_owner'),
('William Joseph Martinez', 'owner3@example.com', 'Martinez@8', '654 Commerce Road, Phoenix, AZ 85001', 'store_owner'),
('Jennifer Lynn Rodriguez', 'owner4@example.com', 'Rodriguez$', '987 Market Street, Philadelphia, PA 19101', 'store_owner'),
('Michael David Wilson', 'owner5@example.com', 'Wilson@77', '147 Business Blvd, San Antonio, TX 78201', 'store_owner'),

-- Normal Users (all ≥ 20 characters)
('James Alexander Brown', 'user1@example.com', 'Brown@123', '123 Customer Lane, San Diego, CA 92101', 'normal_user'),
('Maria Sophia Garcia Lopez', 'user2@example.com', 'Garcia#88', '456 Shopper Way, Dallas, TX 75201', 'normal_user'),
('David Michael Miller Jr', 'user3@example.com', 'Miller@45', '789 Consumer Court, San Jose, CA 95101', 'normal_user'),
('Patricia Anne Davis Lee', 'user4@example.com', 'Davis@321', '321 Buyer Boulevard, Austin, TX 78701', 'normal_user'),
('Thomas Edward Wilson Sr', 'user5@example.com', 'Thomas#56', '654 Patron Place, Jacksonville, FL 32201', 'normal_user'),
('Linda Marie Taylor Scott', 'user6@example.com', 'Taylor@90', '987 Visitor View, Fort Worth, TX 76101', 'normal_user'),
('Charles Daniel Thomas', 'user7@example.com', 'Charles@1', '147 Guest Road, Columbus, OH 43201', 'normal_user'),
('Barbara Karen Jackson', 'user8@example.com', 'Jackson#2', '258 User Avenue, Charlotte, NC 28201', 'normal_user'),
('Christopher Paul White', 'user9@example.com', 'White@333', '369 Rater Street, San Francisco, CA 94101', 'normal_user'),
('Jessica Lisa Harris Moore', 'user10@example.com', 'Harris@44', '159 Reviewer Road, Indianapolis, IN 46201', 'normal_user'),
('Matthew George Martin', 'user11@example.com', 'Martin#55', '753 Critic Court, Seattle, WA 98101', 'normal_user'),
('Ashley Nicole Robinson', 'user12@example.com', 'Ashley@66', '951 Evaluator Express, Denver, CO 80201', 'normal_user'),
('Christopher Michael Johnson', 'user13@example.com', 'Johnson#7', '159 Testing Lane, Boston, MA 02101', 'normal_user'),
('Jennifer Lynn Williams', 'user14@example.com', 'Williams@8', '753 Sample Street, Miami, FL 33101', 'normal_user'),
('Matthew David Brown Jr', 'user15@example.com', 'Matthew#9', '951 Demo Avenue, Portland, OR 97201', 'normal_user'),
('Alexander William Campbell', 'user16@example.com', 'Campbell@1', '753 Test Drive, Chicago, IL 60601', 'normal_user'),
('Victoria Elizabeth Parker', 'user17@example.com', 'Victoria#2', '951 Sample Road, Houston, TX 77001', 'normal_user'),
('Benjamin Franklin Mitchell', 'user18@example.com', 'Benjamin@3', '159 Example Lane, Phoenix, AZ 85001', 'normal_user');

-- Insert Stores
INSERT INTO stores (name, email, address, owner_id) VALUES
('SuperMart Downtown', 'store1@supermart.com', '100 Main Street, New York, NY 10001', 1),
('TechGadget Pro', 'contact@techgadget.com', '200 Tech Boulevard, San Francisco, CA 94105', 2),
('FashionHub Clothing', 'info@fashionhub.com', '300 Fashion Avenue, Los Angeles, CA 90001', 3),
('HomeDecor Center', 'service@homedecor.com', '400 Home Street, Chicago, IL 60601', 4),
('SportsDirect USA', 'support@sportsdirect.com', '500 Sports Complex, Houston, TX 77001', 5),
('BookWorld Library', 'books@bookworld.com', '600 Reading Road, Boston, MA 02101', 6),
('ElectroCity', 'sales@electrocity.com', '700 Circuit Lane, Phoenix, AZ 85001', 7),
('GreenGrocer Market', 'fresh@greengrocer.com', '800 Organic Avenue, Portland, OR 97201', 8),
('Pet Paradise', 'info@petparadise.com', '900 Animal Avenue, Miami, FL 33101', 9),
('AutoZone Parts', 'help@autozone.com', '150 Motor Way, Detroit, MI 48201', 10),
('MegaMart Express', 'info@megamart.com', '250 Shopping Plaza, Dallas, TX 75201', NULL),
('Coffee House Cafe', 'coffee@coffeehouse.com', '350 Brew Street, Seattle, WA 98101', NULL),
('GymFit Center', 'fitness@gymfit.com', '450 Workout Way, Denver, CO 80201', NULL),
('BeautyStudio Salon', 'beauty@beautystudio.com', '550 Glamour Grove, Miami, FL 33101', NULL),
('ToysRFun', 'toys@toysrfun.com', '650 Play Place, Orlando, FL 32801', NULL),
('PharmaCare Drugs', 'pharma@pharmacare.com', '750 Health Street, Philadelphia, PA 19101', NULL),
('Jewelry Gallery', 'jewelry@gallery.com', '850 Diamond Drive, Las Vegas, NV 89101', NULL),
('Furniture World', 'furniture@world.com', '950 Comfort Court, Atlanta, GA 30301', NULL),
('Bakery Fresh', 'bakery@fresh.com', '1050 Pastry Lane, New Orleans, LA 70101', NULL),
('Wine & Spirits', 'wine@spirits.com', '1150 Vineyard Road, Napa Valley, CA 94501', NULL);

-- Insert Ratings
INSERT INTO ratings (user_id, store_id, rating) VALUES
(11,1,5),(12,1,4),(13,1,5),(14,1,3),(15,1,4),(16,1,5),(17,1,4),(18,1,5),
(11,2,5),(12,2,5),(13,2,4),(14,2,5),(15,2,3),(16,2,4),(17,2,5),(18,2,4),
(11,3,4),(12,3,3),(13,3,5),(14,3,4),(15,3,4),(16,3,5),(17,3,4),(18,3,3),
(11,4,5),(12,4,4),(13,4,4),(14,4,5),(15,4,3),(16,4,4),(17,4,5),
(11,5,4),(12,5,5),(13,5,4),(14,5,5),(15,5,3),(16,5,4),(17,5,5),
(11,6,5),(12,6,5),(13,6,4),(14,6,5),(15,6,4),(16,6,5),(17,6,4),
(11,7,4),(12,7,5),(13,7,3),(14,7,4),(15,7,5),(16,7,4),(17,7,5),
(11,8,5),(12,8,4),(13,8,5),(14,8,4),(15,8,5),(16,8,4),
(11,9,5),(12,9,4),(13,9,5),(14,9,3),(15,9,4),(16,9,5),
(11,10,4),(12,10,5),(13,10,4),(14,10,5),(15,10,4),(16,10,3),
(11,11,4),(12,11,3),(13,11,5),(14,11,4),(15,11,4),(16,11,5),
(11,12,5),(12,12,5),(13,12,4),(14,12,5),(15,12,4),(16,12,5),
(11,13,4),(12,13,5),(13,13,4),(14,13,5),(15,13,3),(16,13,4),
(11,14,5),(12,14,4),(13,14,5),(14,14,4),(15,14,5),(16,14,4),
(11,15,5),(12,15,4),(13,15,5),(14,15,3),(15,15,4),(16,15,5),
(11,16,4),(12,16,5),(13,16,4),(14,16,5),(15,16,4),(16,16,4),
(11,17,5),(12,17,4),(13,17,5),(14,17,4),(15,17,5),(16,17,4),
(11,18,4),(12,18,5),(13,18,3),(14,18,4),(15,18,5),(16,18,4),
(11,19,5),(12,19,5),(13,19,4),(14,19,5),(15,19,4),(16,19,5),
(11,20,5),(12,20,4),(13,20,5),(14,20,4),(15,20,5),(16,20,4);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
SELECT 'DATABASE CREATED SUCCESSFULLY WITH ALL CONSTRAINTS!' as 'Status';

SELECT CONCAT('Total Users: ', COUNT(*)) as 'Summary' FROM users;
SELECT CONCAT('Total Stores: ', COUNT(*)) as 'Summary' FROM stores;
SELECT CONCAT('Total Ratings: ', COUNT(*)) as 'Summary' FROM ratings;

-- Show sample data with name length verification
SELECT 'Sample Users (with name length):' as '';
SELECT id, name, CHAR_LENGTH(name) as name_length, email, role FROM users LIMIT 10;

-- Verify all names meet the 20-60 character requirement
SELECT 'Name Length Verification:' as '';
SELECT 
    COUNT(*) as total_users,
    SUM(CASE WHEN CHAR_LENGTH(name) < 20 THEN 1 ELSE 0 END) as names_too_short,
    SUM(CASE WHEN CHAR_LENGTH(name) > 60 THEN 1 ELSE 0 END) as names_too_long,
    SUM(CASE WHEN CHAR_LENGTH(name) >= 20 AND CHAR_LENGTH(name) <= 60 THEN 1 ELSE 0 END) as names_valid
FROM users;