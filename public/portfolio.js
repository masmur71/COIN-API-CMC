document.addEventListener('DOMContentLoaded', async () => {
    let coins = [];
    let portfolio = [];
    let selectedCoin = null;

    const portfolioTableBody = document.getElementById('portfolioTableBody');
    const addCoinButton = document.getElementById('addCoinButton');
    const saveCoinButton = document.getElementById('saveCoinButton');
    const coinSearchInput = document.getElementById('coinSearchInput');
    const coinAmountInput = document.getElementById('coinAmountInput');
    const portfolioTotalAmount = document.getElementById('portfolioTotalAmount');
    const coinList = document.getElementById('coinList');
    const monitorButton = document.getElementById('monitorButton');

    google.charts.load('current', {'packages':['corechart']});
    
    async function fetchData() {
        try {
            const response = await fetch('/api/coins');
            coins = await response.json();
            displayCoinList(coins); // Display the full list of coins initially
        } catch (error) {
            console.error('Error fetching coin data:', error);
        }
    }

    function colorTextBasedOnChange(value) {
        if (value > 0) {
            return `<span style="color: green;">${value.toFixed(2)}%</span>`;
        } else if (value < 0) {
            return `<span style="color: red;">${value.toFixed(2)}%</span>`;
        } else {
            return `<span>${value.toFixed(2)}%</span>`;
        }
    }

    let editingIndex = -1; // Menyimpan indeks baris yang sedang diedit

    function displayCoinList(coinArray) {
        coinList.innerHTML = '';
        coinArray.forEach(coin => {
            const coinItem = document.createElement('a');
            coinItem.className = 'list-group-item list-group-item-action';
            const logoUrl = coin.logo || `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`;
            coinItem.innerHTML = `
                <img src="${logoUrl}" alt="${coin.name}" width="20" height="20" class="mr-2">
                ${coin.name} (${coin.symbol})
            `;
            coinItem.addEventListener('click', () => {
                selectedCoin = coin;
                $('#selectCoinModal').modal('hide');
                $('#addCoinModal').modal('show');
            });
            coinList.appendChild(coinItem);
        });
    }

    function drawChart() {
        const data = new google.visualization.DataTable();
        data.addColumn('string', 'Coin');
        data.addColumn('number', 'Value');

        portfolio.forEach(item => {
            const coin = coins.find(c => c.id === item.coin.id);
            if (coin) {
                const coinValue = item.amount * coin.quote.IDR.price;
                data.addRow([coin.name, coinValue]);
            }
        });

        const options = {
            title: 'Distribusi Portofilio',
            pieHole: 0.4,
        };

        const chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);
    }

    function displayPortfolio() {
        portfolioTableBody.innerHTML = '';

        let totalPortfolioValue = 0;
        portfolio.forEach((item, index) => {
            const coin = coins.find(c => c.id === item.coin.id);
            if (coin) {
                const row = document.createElement('tr');
                const coinValue = item.amount * coin.quote.IDR.price;
                totalPortfolioValue += coinValue;

                const logoUrl = coin.logo || `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`;

                const tvSymbol = `BINANCE:${coin.symbol}USDT`;

                row.innerHTML = `
                    <td>${coin.cmc_rank}</td>
                    <td><a href="detail.html?symbol=${tvSymbol}&name=${coin.name}">${coin.name}</a></td>
                    <td><img src="${logoUrl}" alt="${coin.symbol}" width="20" height="20"> ${coin.symbol}</td>
                    <td>Rp ${coin.quote.IDR.price.toLocaleString('id-ID')}</td>
                    <td>${item.amount.toLocaleString('id-ID')}</td>
                    <td>Rp ${coinValue.toLocaleString('id-ID')}</td>
                    <td>Rp ${coin.quote.IDR.market_cap.toLocaleString('id-ID')}</td>
                    <td>${colorTextBasedOnChange(coin.quote.IDR.percent_change_1h)}</td>
                    <td>${colorTextBasedOnChange(coin.quote.IDR.percent_change_24h)}</td>
                    <td>${colorTextBasedOnChange(coin.quote.IDR.percent_change_7d)}</td>
                    <td>
                        <button class="btn btn-dark btn-sm edit-button">Edit</button>
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-button">Hapus</button>
                    </td>
                `;
                portfolioTableBody.appendChild(row);

                // Event listener untuk tombol Edit
                row.querySelector('.edit-button').addEventListener('click', () => {
                    editingIndex = index; // Set indeks baris yang sedang diedit
                    $('#coinAmountInput').val(portfolio[index].amount); // Set nilai input ke jumlah koin yang ada
                    selectedCoin = coin;
                    $('#addCoinModal').modal('show'); // Tampilkan modal edit koin
                });

                // Event listener untuk tombol Hapus
                row.querySelector('.delete-button').addEventListener('click', () => {
                    portfolio.splice(index, 1); // Hapus item dari portofolio
                    displayPortfolio(); // Perbarui tampilan portofolio
                    drawChart(); // Perbarui pie chart
                });
            }
        });

        portfolioTotalAmount.textContent = `Rp ${totalPortfolioValue.toLocaleString('id-ID')}`;

        // Store portfolio in localStorage
        localStorage.setItem('portfolio', JSON.stringify(portfolio));

        // Draw the pie chart
        google.charts.setOnLoadCallback(drawChart);
    }

    coinSearchInput.addEventListener('input', () => {
        const searchTerm = coinSearchInput.value.toLowerCase();
        const filteredCoins = coins.filter(coin =>
            coin.name.toLowerCase().includes(searchTerm) ||
            coin.symbol.toLowerCase().includes(searchTerm)
        );
        displayCoinList(filteredCoins);
    });

    addCoinButton.addEventListener('click', () => {
        $('#selectCoinModal').modal('show');
    });

    saveCoinButton.addEventListener('click', () => {
        const coinAmount = parseFloat(coinAmountInput.value.trim());

        if (selectedCoin && !isNaN(coinAmount)) {
            if (editingIndex !== -1) {
                // Jika sedang dalam mode edit, perbarui jumlah koin dalam portofolio pada indeks yang sesuai
                portfolio[editingIndex].amount = coinAmount;
            } else {
                // Jika tidak, tambahkan item baru ke portofolio
                portfolio.push({ coin: selectedCoin, amount: coinAmount });
            }
            displayPortfolio(); // Perbarui tampilan portofolio
            $('#addCoinModal').modal('hide');
            editingIndex = -1; // Reset indeks baris yang sedang diedit
            drawChart(); // Perbarui pie chart
        }
    });

    monitorButton.addEventListener('click', () => {
        if (portfolio.length === 0) {
            alert('Tidak ada koin di portofolio untuk dimonitor.');
        } else {
            window.location.href = 'monitor.html';
        }
    });

    await fetchData();
});
