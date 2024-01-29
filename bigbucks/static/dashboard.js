document.querySelector('#dashboardStockInputSelector').addEventListener('click', async function (event) {
    event.preventDefault();
    // get ticker
    ticker = document.querySelector('#dashboardStockInput').value;
    // change ticker to uppercase
    ticker = ticker.toUpperCase();

    // If ticker is empty, set it to AAPL
    if (!ticker) {
        ticker = "AAPL";
    }
    drawStockPriceTimeSeries(ticker);
    drawDailySimpleReturn(ticker)
    drawDayComparisonSimpleReturn(ticker);
    drawStockIndexCompScatter(ticker);
    drawStockIndexCompLinePrice(ticker);
    drawStockIndexCompLine(ticker)
    drawDailyReturnHist(ticker);
});

// auto fetch /getSharpeRatio and update span element with id sharpRatio. The API returns data in json format with key data. 
fetch('/getSharpeRatio')
    .then(response => {
        if (response.ok) {
            return response.json()
        } else {
            response.json().then((data) => {
                console.error(data.error);
                document.querySelector('#sharpeRatio').textContent = data.error
                dailySimpleReturnErrorMsg.classList.add("error");
            })
        }
    })
    .then(data => {
        stockPriceTimeSeriesErrorMsg.classList.remove("error")
        document.querySelector('#sharpeRatio').textContent = data.data;
    })
    .catch(error => {
        console.error('Error:', error);
        document.querySelector('#sharpeRatio').textContent = error;
        stockPriceTimeSeriesErrorMsg.classList.add("error");
    });


fetch('/getAccountBalance')
    .then(response => {
        if (response.ok) {
            return response.json()
        } else {
            response.json().then((data) => {
                console.error(data.error);
                document.querySelector('#accountBalance').textContent = data.error
                dailySimpleReturnErrorMsg.classList.add("error");
            })
        }
    })
    .then(data => {
        stockPriceTimeSeriesErrorMsg.classList.remove("error")
        document.querySelector('#accountBalance').textContent = "$" + parseFloat(data.current_balance).toLocaleString('en-US', { maximumFractionDigits: 2 });
    })
    .catch(error => {
        console.error('Error:', error);
        document.querySelector('#accountBalance').textContent = error;
        stockPriceTimeSeriesErrorMsg.classList.add("error");
    });

fetch('/getAssetBalance')
    .then(response => {
        if (response.ok) {
            return response.json()
        } else {
            response.json().then((data) => {
                console.error(data.error);
                document.querySelector('#accountAssets').textContent = data.error
                dailySimpleReturnErrorMsg.classList.add("error");
            })
        }
    })
    .then(data => {
        stockPriceTimeSeriesErrorMsg.classList.remove("error")
        // get they key of all elements and put into an array
        jsonData = JSON.parse(data);
        const keys = Object.keys(jsonData);
        if (keys) {
            // join keys to a string seprated by ,
            document.querySelector('#accountAssets').textContent = keys.join(', ');
            // append <tr><td>key</td><td>jsonData[key]</td></tr > to #stock-portfolio-table-body for each key in keys
            keys.forEach(key => {
                document.querySelector('#stock-portfolio-table-body').innerHTML += `<tr><td>${key}</td><td>$${parseFloat(jsonData[key]["price_per_share"]).toLocaleString('en-US', { maximumFractionDigits: 2 })}</td><td>${jsonData[key]['num_shares']}</td></tr>`;
            });
        }
        else {
            document.querySelector('#accountAssets').textContent = "User does not hold any assets";
        }

    })
    .catch(error => {
        console.error('Error:', error);
        document.querySelector('#accountAssets').textContent = error;
        stockPriceTimeSeriesErrorMsg.classList.add("error");
    });