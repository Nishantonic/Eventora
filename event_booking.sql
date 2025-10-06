-- Database
CREATE DATABASE IF NOT EXISTS eventora;
USE eventora;

-- Users Table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user','admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    date DATETIME NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    available_tickets INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending','confirmed','cancelled') DEFAULT 'confirmed',
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Tickets Table
CREATE TABLE tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    ticket_code VARCHAR(50) NOT NULL UNIQUE,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Admins can also create events
-- Insert a sample admin user (change password hash in production!)
INSERT INTO users (username, email, password_hash, role) 
VALUES ('Admin', 'admin@eventora.com', 'hashed_password_here', 'admin');

-- Sample Data
INSERT INTO events 
(title, description, location, date, price, available_seats, total_seat, category, img)
VALUES 
(
  'Tech Innovators Conference 2025',
  'A conference showcasing cutting-edge technology and innovation.',
  'Bangalore International Convention Centre',
  '2025-12-14 22:00:00',
  499.99,
  173,
  200,
  'Concert',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPdEOKHVsc7ec7YN5WZZ0vd0Vv7hA0VQPVsA&s, https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPdEOKHVsc7ec7YN5WZZ0vd0Vv7hA0VQPVsA&s'
),
(
  'Global AI & Tech Summit 2025',
  'A deep dive into the future of Artificial Intelligence, Machine Learning, and Cloud Computing with industry leaders.',
  'National Centre for the Performing Arts (NCPA), Mumbai',
  '2025-10-30 08:30:00',
  199.00,
  721,
  1000,
  'Workshop',
  'https://img.freepik.com/free-psd/gradient-technology-poster-template_23-2149000228.jpg?semt=ais_hybrid&w=740&q=80'
),
(
  'Future of Robotics Conference',
  'Exploring advancements in industrial and medical robotics, featuring keynote speeches and live demonstrations.',
  'Hyderabad Convention Centre',
  '2025-11-15 00:40:00',
  299.00,
  150,
  150,
  'Conference',
  'https://robotics.utoronto.ca/wp-content/uploads/sites/33/2025/05/Save-the-dates.jpg'
),
(
  'Photography Workshop: Street Life',
  'A hands-on workshop focused on street photography techniques in the historic areas of Old Delhi.',
  'Chandni Chowk, New Delhi',
  '2025-10-31 12:50:00',
  59.00,
  400,
  400,
  'Workshop',
  'https://img.freepik.com/free-psd/portrait-person-with-cinematic-effect_23-2151779795.jpg?semt=ais_hybrid&w=740&q=80'
),
(
  'Start-up Pitch Day: Chennai Chapter',
  'The best emerging entrepreneurs present their ideas to venture capitalists and angel investors.',
  'IIT Madras Research Park',
  '2025-12-15 06:30:00',
  80.00,
  1200,
  1200,
  'Seminar',
  'https://inc42.com/cdn-cgi/image/quality=75/https://asset.inc42.com/2025/04/Chennai-Listicles-ftr.jpg'
);
