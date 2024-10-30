-- DROP TABLE IF EXISTS Waitlist;

CREATE TABLE IF NOT EXISTS Waitlist (
    CustomerId INTEGER PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    verified BOOLEAN NOT NULL
);

INSERT INTO Waitlist (CustomerId, email, verified) VALUES 
(1, 'example@example.com', false),