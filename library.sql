CREATE TABLE authors (
    author_id INT PRIMARY KEY,
    author_name VARCHAR(100) NOT NULL
);

CREATE TABLE books (
    book_id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_id INT,
    publication_year INT,
    available_copies INT,
    FOREIGN KEY (author_id) REFERENCES authors(author_id)
);

CREATE TABLE borrowers (
    borrower_id INT PRIMARY KEY,
    borrower_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(15)
);

CREATE TABLE transactions (
    transaction_id INT PRIMARY KEY,
    book_id INT,
    borrower_id INT,
    checkout_date DATE,
    return_date DATE,
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (borrower_id) REFERENCES borrowers(borrower_id)
);


-- Insert data into authors table
INSERT INTO authors (author_id, author_name) VALUES
(1, 'Jane Doe'),
(2, 'John Smith'),
(3, 'Alice Johnson');

-- Insert data into books table
INSERT INTO books (book_id, title, author_id, publication_year, available_copies) VALUES
(101, 'The Great Novel', 1, 2005, 5),
(102, 'Programming 101', 2, 2010, 3),
(103, 'Mystery of the Library', 1, 2018, 8),
(104, 'Introduction to SQL', 2, 2015, 2),
(105, 'The Coding Chronicles', 2, 2022, 6);

-- Insert data into borrowers table
INSERT INTO borrowers (borrower_id, borrower_name, contact_number) VALUES
(201, 'Bob Anderson', '555-1234'),
(202, 'Emily White', '555-5678'),
(203, 'Charlie Brown', '555-9876');

-- Insert data into transactions table
INSERT INTO transactions (transaction_id, book_id, borrower_id, checkout_date, return_date) VALUES
(301, 101, 201, '2023-01-05', '2023-01-15'),
(302, 102, 202, '2023-02-10', '2023-02-20'),
(303, 103, 203, '2023-03-15', '2023-03-25'),
(304, 104, 201, '2023-04-20', '2023-05-05'),
(305, 105, 202, '2023-06-01', '2023-06-15');
