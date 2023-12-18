const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require('cors')
const path = require("path");
const app = express();



const corsOptions = {
  origin: 'http://localhost:5173',
}


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
const publicPath = path.join(__dirname, "frontend", "dist");


app.use(express.static(publicPath));

const port = 3000;

app.use(bodyParser.json());
app.use(cors(corsOptions))


const connection = mysql.createConnection({
  host: "mysql-1f6f73c3-jonnyzak32-0f32.a.aivencloud.com",
  user: "avnadmin",
  password: "AVNS_q5n7YDQ8kX83-Tw4mwO",
  database: "library",
  port: 25141
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
      "SELECT * FROM books WHERE available_copies = 0",
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
    connection.query("SELECT * FROM books", (error, results) => {
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
      "SELECT * FROM books WHERE book_id = ?",
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
      "INSERT INTO books values ?",
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
      "INSERT INTO authors values ?",
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
    connection.query("SELECT * FROM authors", (error, results) => {
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
    connection.query('SELECT available_copies FROM books WHERE book_id = ?', [bookId], (error, results) => {
      if (error) throw error;
  
      if (results.length === 0) {
        res.status(404).json({ error: 'Book not found' });
      } else {
        const availableCopies = results[0].available_copies;
  
        if (availableCopies > 0) {
          // Update available_copies in the books table
          connection.query('UPDATE books SET available_copies = ? WHERE book_id = ?', [availableCopies - 1, bookId], (error) => {
            if (error) throw error;
  
            // Record the transaction
            connection.query('INSERT INTO transactions (book_id, borrower_id, checkout_date) VALUES (?, ?, NOW())', [bookId, borrowerId], (error, results) => {
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

  app.get("/*", function (req, res) {
    console.log("Returning file index.html")
  res.sendFile(path.join(publicPath, "index.html"));
});
  

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
