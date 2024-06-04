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
  
        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
        deleteButton.textContent = 'Hapus';
        deleteButton.addEventListener('click', function() {
          removeCoin(coin.symbol);
        });
        const deleteCell = document.createElement('td');
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);
  
        tableBody.appendChild(row);
      });
    }
  
    function renderAssetList(filteredCoins) {
      const assetList = $('#assetList');
      assetList.empty();
      const coinsToRender = filteredCoins || coins;
      coinsToRender.forEach(coin => {
        const checked = selectedCoins.some(selectedCoin => selectedCoin.symbol === coin.symbol) ? 'checked' : '';
        const logoUrl = coin.logo ? coin.logo : `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`;
        assetList.append(`
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span>
              <img src="${logoUrl}" alt="${coin.symbol}" width="20" height="20">
              <span class="ml-2">${coin.name} (${coin.symbol})</span>
            </span>
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="${coin.symbol}" id="${coin.symbol}" ${checked}>
            </div>
          </div>
        `);
      });
    }
  
    function filterCoins(query) {
      return coins.filter(coin => coin.name.toLowerCase().includes(query.toLowerCase()) || coin.symbol.toLowerCase().includes(query.toLowerCase()));
    }
  
    function removeCoin(symbol) {
      selectedCoins = selectedCoins.filter(coin => coin.symbol !== symbol);
      displayCoins(selectedCoins);
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
  