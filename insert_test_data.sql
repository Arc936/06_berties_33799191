# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;
INSERT INTO users (username, firstName, lastName, email, hashedPassword) VALUES ('gold','gold','smiths','placeholder@gmail.com','$2b$10$5tu9sR.m0O4HwwiU0p64yueb7IRgfc7gHMkixy0dm7PWWsFUbSa5C')
