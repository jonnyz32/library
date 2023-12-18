// src/components/CheckoutBook.js
import { useState } from 'react';

const CheckoutBook = () => {
  const [bookId, setBookId] = useState('');
  const [borrowerId, setBorrowerId] = useState('');

  const handleCheckout = async () => {
    try {
      const response = await fetch('/transactions/check-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookId, borrowerId }),
      });
      const data = await response.json();
      console.log('Checkout successful. Transaction ID:', data.transactionId);
    } catch (error) {
      console.error('Error checking out book:', error);
    }
  };

  return (
    <div>
      <h3>Checkout a Book</h3>
      <label>
        Book ID:
        <input type="text" value={bookId} onChange={(e) => setBookId(e.target.value)} />
      </label>
      <br />
      <label>
        Borrower ID:
        <input type="text" value={borrowerId} onChange={(e) => setBorrowerId(e.target.value)} />
      </label>
      <br />
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default CheckoutBook;
