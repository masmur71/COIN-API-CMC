// Mengimpor modul yang diperlukan
const express = require('express'); // Mengimpor framework Express untuk membuat server web
const axios = require('axios'); // Mengimpor modul Axios untuk melakukan permintaan HTTP
const path = require('path'); // Mengimpor modul Path untuk bekerja dengan jalur file dan direktori
const app = express(); // Membuat instance aplikasi Express
const port = 3000; // Menentukan port tempat server akan berjalan

// Ganti dengan API key Anda
const apiKey = 'c4f690c5-16b0-4aad-8a3d-2dd6b9fa5796'; // Menyimpan API key untuk CoinMarketCap

// Middleware untuk melayani file statis
app.use(express.static(path.join(__dirname, 'public'))); // Mengatur middleware untuk melayani file statis dari direktori 'public'

// API endpoint untuk mendapatkan data koin
app.get('/api/coins', async (req, res) => { // Membuat endpoint API untuk mendapatkan data koin
    try {
        // Melakukan permintaan GET ke CoinMarketCap API
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': apiKey, // Menambahkan API key ke header permintaan
            },
            params: {
                convert: 'IDR', // Mengatur parameter untuk mengonversi harga ke Rupiah Indonesia (IDR)
                limit: 100 // Jumlah koin yang ingin ditampilkan
            }
        });

        res.json(response.data.data); // Mengirim data koin dalam format JSON sebagai respons
    } catch (error) {
        console.error(error); // Mencetak error ke konsol jika terjadi masalah
        res.status(500).send('An error occurred'); // Mengirim respons status 500 jika terjadi kesalahan
    }
});

// Memulai server dan mendengarkan pada port yang ditentukan
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`); // Mencetak pesan ke konsol saat server berjalan
});
