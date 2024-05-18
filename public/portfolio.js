// Event listener untuk menunggu sampai seluruh konten halaman dimuat
document.addEventListener('DOMContentLoaded', async () => {
    let coins = []; // Array untuk menyimpan data koin dari API
    let portfolio = []; // Array untuk menyimpan data portofolio pengguna
    const portfolioTableBody = document.getElementById('portfolioTableBody'); // Referensi ke elemen tbody dari tabel portofolio
    const coinNameInput = document.getElementById('coinNameInput'); // Referensi ke input untuk nama koin
    const coinAmountInput = document.getElementById('coinAmountInput'); // Referensi ke input untuk jumlah koin
    const addCoinButton = document.getElementById('addCoinButton'); // Referensi ke tombol untuk menambah koin ke portofolio
    const totalAmountIDR = document.getElementById('totalAmountIDR'); // Referensi ke elemen untuk menampilkan total nilai portofolio

    // Fungsi untuk mengambil data koin dari API
    async function fetchData() {
        try {
            const response = await fetch('/api/coins'); // Mengambil data dari endpoint API
            coins = await response.json(); // Mengonversi data JSON dari respons ke dalam array coins
        } catch (error) {
            console.error('Error fetching coin data:', error); // Menangkap dan menampilkan error jika terjadi kesalahan
        }
    }

    // Fungsi untuk menampilkan portofolio di tabel
    function displayPortfolio() {
        portfolioTableBody.innerHTML = ''; // Mengosongkan isi tabel portofolio

        let totalPortfolioValue = 0; // Variabel untuk menyimpan total nilai portofolio
        portfolio.forEach(item => {
            // Mencari koin yang sesuai dengan nama atau simbol dari portofolio
            const coin = coins.find(c => c.name.toLowerCase() === item.name.toLowerCase() || c.symbol.toUpperCase() === item.name.toUpperCase());
            if (coin) {
                const row = document.createElement('tr'); // Membuat elemen baris baru untuk tabel
                const tvSymbol = `BINANCE:${coin.symbol}USDT`; // Membuat simbol untuk TradingView
                const logoUrl = coin.logo ? coin.logo : `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`; // Menentukan URL logo koin
                const coinValue = item.amount * coin.quote.IDR.price; // Menghitung nilai portofolio untuk koin tertentu
                totalPortfolioValue += coinValue; // Menambahkan nilai portofolio koin ke total nilai portofolio
                
                // Menambahkan HTML ke dalam baris tabel dengan data koin
                row.innerHTML = `
                    <td>${coin.cmc_rank}</td>
                    <td><a href="detail.html?symbol=${tvSymbol}&name=${coin.name}">${coin.name}</a></td>
                    <td><img src="${logoUrl}" alt="${coin.symbol}" width="20" height="20"> ${coin.symbol}</td>
                    <td>Rp ${coin.quote.IDR.price.toLocaleString('id-ID')}</td>
                    <td>Rp ${coinValue.toLocaleString('id-ID')}</td> 
                    <td>Rp ${coin.quote.IDR.market_cap.toLocaleString('id-ID')}</td>
                    <td>${coin.quote.IDR.percent_change_1h.toFixed(2)}%</td>
                    <td>${coin.quote.IDR.percent_change_24h.toFixed(2)}%</td>
                    <td>${coin.quote.IDR.percent_change_7d.toFixed(2)}%</td>
                `;
                portfolioTableBody.appendChild(row); // Menambahkan baris ke dalam tabel portofolio
            }
        });
        // Menampilkan total nilai portofolio
        totalAmountIDR.textContent = `Rp ${totalPortfolioValue.toLocaleString('id-ID')}`;
    }

    // Event listener untuk menambahkan koin ke portofolio saat tombol ditekan
    addCoinButton.addEventListener('click', () => {
        const coinName = coinNameInput.value.trim(); // Mengambil dan menghapus spasi dari input nama koin
        const coinAmount = parseFloat(coinAmountInput.value.trim()); // Mengambil dan mengonversi input jumlah koin ke angka
        if (coinName && !isNaN(coinAmount)) { // Memastikan bahwa nama koin dan jumlah koin valid
            portfolio.push({ name: coinName, amount: coinAmount }); // Menambahkan koin ke array portofolio
            displayPortfolio(); // Memperbarui tampilan portofolio
        }
    });

    await fetchData(); // Memanggil fungsi untuk mengambil data koin dari API setelah halaman dimuat
});
