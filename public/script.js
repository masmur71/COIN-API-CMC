document.addEventListener('DOMContentLoaded', async () => {
    // Array untuk menyimpan data koin
    let coins = [];
    // Mengambil elemen tbody dari tabel
    const tableBody = document.getElementById('coinTableBody');
    // Mengambil elemen input pencarian
    const searchInput = document.getElementById('searchInput');

    // Fungsi untuk mengambil data koin dari API
    async function fetchData() {
        try {
            // Mengambil data dari endpoint '/api/coins'
            const response = await fetch('/api/coins');
            // Menyimpan data koin yang diperoleh dalam variabel coins
            coins = await response.json();
            // Menampilkan data koin di tabel
            displayCoins(coins);
        } catch (error) {
            console.error('Error fetching coin data:', error);
        }
    }

    // Fungsi untuk mewarnai teks berdasarkan perubahan nilai persentase
    function colorTextBasedOnChange(value) {
        if (value > 0) {
            return `<span style="color: green;">${value.toFixed(2)}%</span>`;
        } else if (value < 0) {
            return `<span style="color: red;">${value.toFixed(2)}%</span>`;
        } else {
            return `<span>${value.toFixed(2)}%</span>`;
        }
    }

    // Fungsi untuk menampilkan data koin di tabel
    function displayCoins(coins) {
        tableBody.innerHTML = '';
        coins.forEach(coin => {
            const row = document.createElement('tr');
            const tvSymbol = `BINANCE:${coin.symbol}USDT`;
            const logoUrl = coin.logo ? coin.logo : `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`;
            row.innerHTML = `
                <td>${coin.cmc_rank}</td>
                <td><a href="detail.html?symbol=${tvSymbol}&name=${coin.name}">${coin.name}</a></td>
                <td><img src="${logoUrl}" alt="${coin.symbol}" width="20" height="20"> ${coin.symbol}</td>
                <td>Rp ${coin.quote.IDR.price.toLocaleString('id-ID')}</td>
                <td>Rp ${Math.round(coin.quote.IDR.volume_24h).toLocaleString('id-ID')}</td>
                <td>Rp ${Math.round(coin.quote.IDR.market_cap).toLocaleString('id-ID')}</td>
                <td>${colorTextBasedOnChange(coin.quote.IDR.percent_change_1h)}</td>
                <td>${colorTextBasedOnChange(coin.quote.IDR.percent_change_24h)}</td>
                <td>${colorTextBasedOnChange(coin.quote.IDR.percent_change_7d)}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Fungsi untuk mengurutkan data koin berdasarkan kolom tertentu
    function sortCoins(coins, column, order) {
        const sortedCoins = [...coins].sort((a, b) => {
            let aValue, bValue;
            switch (column) {
                case 'rank':
                    aValue = a.cmc_rank;
                    bValue = b.cmc_rank;
                    break;
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'price':
                    aValue = a.quote.IDR.price;
                    bValue = b.quote.IDR.price;
                    break;
                case 'volume':
                    aValue = a.quote.IDR.volume_24h;
                    bValue = b.quote.IDR.volume_24h;
                    break;
                case 'market_cap':
                    aValue = a.quote.IDR.market_cap;
                    bValue = b.quote.IDR.market_cap;
                    break;
                case 'percent_change_1h':
                    aValue = a.quote.IDR.percent_change_1h;
                    bValue = b.quote.IDR.percent_change_1h;
                    break;
                case 'percent_change_24h':
                    aValue = a.quote.IDR.percent_change_24h;
                    bValue = b.quote.IDR.percent_change_24h;
                    break;
                case 'percent_change_7d':
                    aValue = a.quote.IDR.percent_change_7d;
                    bValue = b.quote.IDR.percent_change_7d;
                    break;
                default:
                    return 0;
            }
            if (aValue < bValue) {
                return order === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
        displayCoins(sortedCoins);
    }

    // Event listener untuk input pencarian
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredCoins = coins.filter(coin => coin.name.toLowerCase().includes(query));
        displayCoins(filteredCoins);
    });

    // Event listener untuk pengurutan tabel
    document.querySelectorAll('th[data-column]').forEach(header => {
        header.addEventListener('click', () => {
            const column = header.getAttribute('data-column');
            const order = header.getAttribute('data-order') === 'asc' ? 'desc' : 'asc';
            header.setAttribute('data-order', order);
            sortCoins(coins, column, order);
        });
    });

    // Memanggil fungsi untuk mengambil data koin
    fetchData();
});
