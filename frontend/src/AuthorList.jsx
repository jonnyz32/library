// src/components/AuthorList.js
import { useEffect, useState } from 'react';

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch('http://localhost:3000/authors');
        const data = await response.json();
        setAuthors(data);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    fetchAuthors();
  }, []);

  return (
    <div>
      <h2>Author List</h2>
      <ul>
        {authors.map((author) => (
          <li key={author.author_id}>{author.author_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AuthorList;
