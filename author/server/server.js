const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());

app.get('/api/publications', async (req, res) => {
  const author = req.query.author;

  if (!author) {
    return res.status(400).json({ error: 'Author query is required.' });
  }

  try {
    const apiKey = 'Edit with your api key';

    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: `inauthor:${author}`,
        key: apiKey,
      },
    });

    const publications = response.data.items.map(item => ({
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors,
      publisher: item.volumeInfo.publisher,
      publishedDate: item.volumeInfo.publishedDate,
      description: item.volumeInfo.description,
      imageLinks: item.volumeInfo.imageLinks,
      infoLink: item.volumeInfo.infoLink,
    }));

    res.json(publications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch publications.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
