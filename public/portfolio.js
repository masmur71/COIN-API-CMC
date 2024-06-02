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

    async function fetchData() {
        try {
            const response = await fetch('/api/coins');
            coins = await response.json();
            displayCoinList(coins); // Display the full list of coins initially
        } catch (error) {
            console.error('Error fetching coin data:', error);
        }
    }

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

                row.innerHTML = `
                    <td>${coin.cmc_rank}</td>
                    <td><a href="detail.html?symbol=${coin.symbol}&name=${coin.name}">${coin.name}</a></td>
                    <td><img src="${logoUrl}" alt="${coin.symbol}" width="20" height="20"> ${coin.symbol}</td>
                    <td>Rp ${coin.quote.IDR.price.toLocaleString('id-ID')}</td>
                    <td>${item.amount.toLocaleString('id-ID')}</td>
                    <td>Rp ${coinValue.toLocaleString('id-ID')}</td> 
                    <td>Rp ${coin.quote.IDR.market_cap.toLocaleString('id-ID')}</td>
                    <td>${coin.quote.IDR.percent_change_1h.toFixed(2)}%</td>
                    <td>${coin.quote.IDR.percent_change_24h.toFixed(2)}%</td>
                    <td>${coin.quote.IDR.percent_change_7d.toFixed(2)}%</td>
                `;
                portfolioTableBody.appendChild(row);
            }
        });
        
        portfolioTotalAmount.textContent = `Rp ${totalPortfolioValue.toLocaleString('id-ID')}`;

        // Store portfolio in localStorage
        localStorage.setItem('portfolio', JSON.stringify(portfolio));
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
            portfolio.push({ coin: selectedCoin, amount: coinAmount });
            displayPortfolio();
            $('#addCoinModal').modal('hide');
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
