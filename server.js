const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

// Ganti dengan API key Anda
const apiKey = 'c4f690c5-16b0-4aad-8a3d-2dd6b9fa5796';
const apiKeyNews = 'e48e49627ece43608b37e739df2e2048'; // API key untuk News API

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/coins', async (req, res) => {
    try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey,
            },
            params: {
                convert: 'IDR',
                limit: 100
            }
        });

        res.json(response.data.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

// API endpoint untuk mendapatkan berita terkait koin
app.get('/api/news', async (req, res) => {
    const query = req.query.query;
    try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKeyNews}`);

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
