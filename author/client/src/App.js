  import React, { useState } from 'react';
  import './styles.css';

  function App() {
    const [author, setAuthor] = useState('');
    const [publications, setPublications] = useState([]);
    const [error, setError] = useState(null);

    const fetchPublications = async () => {
      if (!author.trim()) {
        setError('Please enter an author name.');
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/publications?author=${encodeURIComponent(author)}`);
        if (!res.ok) {
          throw new Error('Failed to fetch publications');
        }
        const data = await res.json();
        setPublications(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    };


    const handlePrint = () => {
      window.print();
    };

    return (
      <div className="container">
        <h1>Author Publication Finder</h1>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter author name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.shiftKey) {
                handlePrint();
              }  else if (e.key === 'Enter') {
                fetchPublications();
              }
            }}
          />
          <button onClick={fetchPublications}>Search</button>
          <button onClick={handlePrint}>🖨️ Print List</button>
        </div>

        {error && <p className="error">{error}</p>}

        <div className="results">
          {publications.length > 0 ? (
            publications.map((pub, index) => (
              <div key={index} className="card">
                <h3>
                  <a
                    href={pub.infoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="book-link"
                  >
                    {pub.title}
                  </a>
                </h3>
                <p>{pub.authors?.join(', ')}</p>
                <p>{pub.publisher} ({pub.publishedDate})</p>
                <p>{pub.description}</p>
                {pub.imageLinks?.thumbnail && (
                  <img src={pub.imageLinks.thumbnail} alt={pub.title} />
                )}
              </div>
            ))
          ) : (
            <p>No publications found.</p>
          )}
        </div>
      </div>
    );
  }

  export default App;