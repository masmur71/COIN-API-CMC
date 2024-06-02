document.addEventListener('DOMContentLoaded', async () => {
    let coins = [];
    let selectedCoins = [];
    const tableBody = document.getElementById('watchlistTableBody');
    const searchInput = document.getElementById('searchInput');

    async function fetchData() {
        try {
            const response = await fetch('/api/coins');
            coins = await response.json();
            displayCoins(selectedCoins);
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

    function renderAssetList() {
        const assetList = $('#assetList');
        assetList.empty();
        coins.forEach(coin => {
            const checked = selectedCoins.includes(coin) ? 'checked' : '';
            assetList.append(`
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${coin.symbol}" id="${coin.symbol}" ${checked}>
                    <label class="form-check-label" for="${coin.symbol}">
                        ${coin.name} (${coin.symbol})
                    </label>
                </div>
            `);
        });
    }

    function filterCoins(query) {
        return coins.filter(coin => coin.name.toLowerCase().includes(query.toLowerCase()) || coin.symbol.toLowerCase().includes(query.toLowerCase()));
    }

    $('#addWatchlistBtn').on('click', function() {
        renderAssetList();
        $('#addAssetModal').modal('show');
    });

    $('#saveAssetBtn').on('click', function() {
        const selectedSymbols = $('#assetList input:checked').map(function() {
            return $(this).val();
        }).get();

        selectedCoins = coins.filter(coin => selectedSymbols.includes(coin.symbol));
        displayCoins(selectedCoins);

        $('#addAssetModal').modal('hide');
    });

    searchInput.addEventListener('input', function() {
        const query = this.value;
        const filteredCoins = filterCoins(query);
        renderAssetList(filteredCoins);
    });

    fetchData();
});
