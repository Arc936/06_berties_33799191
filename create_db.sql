# Create database script for Berties books

# Create the database
CREATE DATABASE IF NOT EXISTS berties_books;
USE berties_books;

# Create the tables
CREATE TABLE IF NOT EXISTS books (
    id     INT AUTO_INCREMENT,
    name   VARCHAR(50),
    price  DECIMAL(5, 2),
    PRIMARY KEY(id));

CREATE TABLE users (
    userId INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL UNIQUE,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    hashedPassword CHAR(60) NOT NULL,
    PRIMARY KEY (userId)
);

CREATE TABLE login_attempts (
    attemptId INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    attemptTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN NOT NULL,
    PRIMARY KEY (attemptId)
);
# Create the application user
CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON berties_books.* TO ' berties_books_app'@'localhost';


