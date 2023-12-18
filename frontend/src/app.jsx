// src/App.js
import BookList from './BookList';
import CheckoutBook from './CheckoutBook';
import ReturnBook from './ReturnBook';
import AuthorList from './AuthorList';

function App() {
  return (
    <div className="App">
      <h1>Library Management System</h1>

      <BookList />

      <div style={{ marginTop: '30px' }}>
        <CheckoutBook />
        <ReturnBook />
      </div>

      <div style={{ marginTop: '30px' }}>
        <AuthorList />
      </div>
    </div>
  );
}

export default App;
