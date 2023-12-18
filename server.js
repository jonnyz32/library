const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "library",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

// Get all books in stock
app.get("/books/in-stock", (req, res) => {
  try {
    connection.query(
      "SELECT * FROM books WHERE available_copies > 0",
      (error, results) => {
        if (error) throw error;
        res.json(results);
      }
    );
  } catch (e) {
    res.json({ error: e });
  }
});

// Get all books on hold
app.get("/books/on-hold", (req, res) => {
  try {
    connection.query(
      '',
      (error, results) => {
        if (error) throw error;
        res.json(results);
      }
    );
  } catch (e) {
    res.json({ error: e });
  }
});

app.get("/books", (req, res) => {
  try {
    connection.query('', (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  } catch (e) {
    res.json({ error: e });
  }
});

app.get("/books/:id", (req, res) => {
  try {
    const bookId = req.params.id;
    connection.query(
      '',
      [bookId],
      (error, results) => {
        if (error) throw error;
        res.json(results[0]);
      }
    );
  } catch (e) {
    res.json({ error: e });
  }
});

app.post("/books", (req, res) => {
  try {
    const newBook = req.body;
    connection.query(
      '',
      [newBook],
      (error, results) => {
        if (error) throw error;
        res.json({ id: results.insertId });
      }
    );
  } catch (e) {
    res.json({ error: e });
  }
});

app.post("/author", (req, res) => {
  try {
    const author = req.body;
    connection.query(
      '',
      [author],
      (error, results) => {
        if (error) throw error;
        res.json({ id: results.insertId });
      }
    );
  } catch (e) {
    res.json({ error: e });
  }
});

app.get("/authors", (req, res) => {
  try {
    connection.query('', (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  } catch (e) {
    res.json({ error: e });
  }
});

// Check out a book
app.post('/transactions/check-out', (req, res) => {
    const { bookId, borrowerId } = req.body;
  
    // Check if the book is in stock
    connection.query('', [bookId], (error, results) => {
      if (error) throw error;
  
      if (results.length === 0) {
        res.status(404).json({ error: 'Book not found' });
      } else {
        const availableCopies = results[0].available_copies;
  
        if (availableCopies > 0) {
        //   Update available_copies in the books table
          connection.query('', [availableCopies - 1, bookId], (error) => {
            if (error) throw error;
  
            // Record the transaction
            connection.query('', [bookId, borrowerId], (error, results) => {
              if (error) throw error;
              res.json({ transactionId: results.insertId });
            });
          });
        } else {
          res.status(400).json({ error: 'Book not available for checkout' });
        }
      }
    });
  });
  
  // Return a book
  app.post('/transactions/return', (req, res) => {
    const { transactionId } = req.body;
  
    // Retrieve book information and borrower ID from the transaction
    connection.query('SELECT book_id, borrower_id FROM transactions WHERE transaction_id = ?', [transactionId], (error, results) => {
      if (error) throw error;
  
      if (results.length === 0) {
        res.status(404).json({ error: 'Transaction not found' });
      } else {
        const bookId = results[0].book_id;
        const borrowerId = results[0].borrower_id;
  
        // Update available_copies in the books table
        connection.query('UPDATE books SET available_copies = available_copies + 1 WHERE book_id = ?', [bookId], (error) => {
          if (error) throw error;
  
          // Update return_date in the transactions table
          connection.query('UPDATE transactions SET return_date = NOW() WHERE transaction_id = ?', [transactionId], (error) => {
            if (error) throw error;
            res.json({ success: true });
          });
        });
      }
    });
  });
  

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
