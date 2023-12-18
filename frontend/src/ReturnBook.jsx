// src/components/ReturnBook.js
import { useState } from 'react';

const ReturnBook = () => {
  const [transactionId, setTransactionId] = useState('');

  const handleReturn = async () => {
    try {
      const response = await fetch('http://localhost:3000/transactions/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId }),
      });
      const data = await response.json();
      console.log('Book returned successfully:', data.success);
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  return (
    <div>
      <h3>Return a Book</h3>
      <label>
        Transaction ID:
        <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
      </label>
      <br />
      <button onClick={handleReturn}>Return</button>
    </div>
  );
};

export default ReturnBook;
