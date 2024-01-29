refresh = true
// update price on exchange chart title to latest price
async function updateChartPrice() {
    // get the ticker
    ticker = document.querySelector('#chart-ticker-input').value;
    try {
        response = await fetch("/getRealtimePrice/" + ticker);
        if (response.ok) {
            response = await response.json();
            console.log("update price")
            console.log(response)
        }
    }
    catch (err) {
        console.log(err)
    }
    if (response[ticker]) {
        randomTwoDigitNumber = response[ticker]
        // randomTwoDigitNumber = parseFloat((Math.random() * 10000 + 1)).toFixed(2);
        document.querySelector('.ExchangeChart-main-price').textContent = parseFloat(randomTwoDigitNumber).toLocaleString('en-US', { maximumFractionDigits: 2 });
        document.querySelector('.ExchangeChart-info-label').textContent = "$" + parseFloat(randomTwoDigitNumber).toLocaleString('en-US', { maximumFractionDigits: 2 });
    }

}
// Update symbol b amount based on the input of symbol a
function updateSymbolBAmountBySymbolA() {
    console.log("get symbol a amout update, caculate symbol b amount.....")
    // Get the value of symbol-a-amount and the text content of .ExchangeChart-main-price
    const symbolAAmount = parseFloat(document.querySelector('#symbol-a-amount').value);
    const symbolA = document.querySelector('#symbol-a').textContent
    const exchangeChartMainPrice = parseFloat(document.querySelector('.ExchangeChart-main-price').textContent.replace(',', ''));
    if (symbolA.toLowerCase() !== 'usd') {
        document.querySelector('#symbol-b-amount').value = exchangeChartMainPrice * symbolAAmount;
    } else {
        document.querySelector('#symbol-b-amount').value = symbolAAmount / exchangeChartMainPrice;
    }
}

function updateHistorySymbolBAmountBySymbolA() {
    console.log("get history symbol a amout update, caculate symbol b amount.....")
    document.querySelector('#history-symbol-b-amount').value = '?';
}

// Update symbol b amount based on the input of symbol a
function updateSymbolAAmountBySymbolB() {
    console.log("get symbol a amout update, caculate symbol b amount.....")
    // Get the value of symbol-a-amount and the text content of .ExchangeChart-main-price
    const symbolBAmount = parseFloat(document.querySelector('#symbol-b-amount').value);
    const symbolB = document.querySelector('#symbol-b').textContent
    const exchangeChartMainPrice = parseFloat(document.querySelector('.ExchangeChart-main-price').textContent.replace(',', ''));
    if (symbolB.toLowerCase() !== 'usd') {
        document.querySelector('#symbol-a-amount').value = exchangeChartMainPrice * symbolBAmount;
    } else {
        document.querySelector('#symbol-a-amount').value = exchangeChartMainPrice / symbolBAmount;
    }
}

function updateHistorySymbolAAmountBySymbolB() {
    console.log("get symbol a amout update, caculate symbol b amount.....")
    document.querySelector('#history-symbol-a-amount').value = '?';
}
// Create a function updateTradeHistoryTable
async function updateTradeHistoryTable() {
    tradeHistory = await fetch("/getTransactionHistory").then(response => {
        if (response.ok) {
            return response.json()
        }
        else {
            console.log(response)
        }
    }).catch(error => console.log(error));
    tradeHistory = tradeHistory["transactions"]
    console.log(tradeHistory)

    // tradeHistory = [{
    //     transaction_date: "2023-04-01",
    //     stock_symbol: "AAPL",
    //     num_shares: 100,
    //     stock_price_realtime: 164.8,
    //     condition: "buy"
    // }, {
    //     transaction_date: "2023-04-02",
    //     stock_symbol: "IBM",
    //     num_shares: 100,
    //     stock_price_realtime: 16.8,
    //     condition: "sell"
    // }]
    if (tradeHistory.length != 0) {
        // Delete the tr with id nullOrder
        const nullOrder = document.getElementById('nullOrder');
        if (nullOrder) {
            nullOrder.remove();
        }
        // remove all tr with in the table with class exchange-list large App-box
        const table = document.querySelector('.Exchange-list.large.App-box');
        var trElements = table.querySelectorAll('tr');
        // Loop through each <tr> element and remove it from the DOM
        for (var i = 0; i < trElements.length; i++) {
            if (!trElements[i].className.includes('Exchange-list-header')) {
                trElements[i].parentNode.removeChild(trElements[i]);
            }
        }



        // Create entries and append to the table with class exchange-list large App-box

        // Iterate through tradeHistory using a for loop
        for (let i = 0; i < tradeHistory.length; i++) {
            // Access each trade object in tradeHistory
            const trade = tradeHistory[i];
            const newRow = document.createElement('tr');

            // Add your desired table cells (td) and content here
            // Example:
            dateCell = document.createElement('td');
            dateCell.textContent = trade["transaction_date"];
            newRow.appendChild(dateCell);


            assetCell = document.createElement('td');
            assetCell.textContent = trade["stock_symbol"];
            newRow.appendChild(assetCell);

            directionCell = document.createElement('td');
            directionCell.textContent = trade["condition"].toUpperCase();
            newRow.appendChild(directionCell);

            fillPriceCell = document.createElement('td');
            fillPriceCell.textContent = '$' + trade["stock_price_realtime"];
            newRow.appendChild(fillPriceCell);

            fillAmountCell = document.createElement('td');
            fillAmountCell.textContent = trade["num_shares"];
            newRow.appendChild(fillAmountCell);

            totalCell = document.createElement('td');
            totalCell.textContent = '$' + (parseFloat(trade["num_shares"]) * parseFloat(trade["stock_price_realtime"])).toLocaleString('en-US', { maximumFractionDigits: 2 })

            newRow.appendChild(totalCell);

            // Append the new row to thetrade["num_shares"] table
            table.appendChild(newRow);
        }

    }



}

// Call updateChartPrice every 10 seconds
setInterval(() => { updateChartPrice(); updateSymbolBAmountBySymbolA(); }, 10000);




// Update swap and graph when user changing the ticker
document.querySelector('#chart-ticker-selector').addEventListener('click', async function (event) {
    event.preventDefault();
    // get ticker
    ticker = document.querySelector('#chart-ticker-input').value;

    // If ticker is empty, set it to AAPL
    if (!ticker) {
        ticker = "AAPL";
    }

    // Get symbol in the swap value
    const symbolA = document.querySelector('#symbol-a').textContent;
    const symbolB = document.querySelector('#symbol-b').textContent;
    historySymbolA = document.querySelector('#history-symbol-a').textContent;
    historySymbolA = historySymbolA.replace(/\s/g, '');
    // Remove the existing widget instance (if any)
    if (window.tradingViewWidget) {
        window.tradingViewWidget.remove();
    }
    // Create a new widget instance with updated configuration options
    window.tradingViewWidget = new TradingView.widget({
        autosize: true,
        symbol: ticker,
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        save_image: false,
        container_id: "tradingview_ebd97",
    });
    // Update symbol a and symbol b value. Replace one that is not usd to ticker
    if (symbolA.toLowerCase() !== 'usd') {
        document.querySelector('#symbol-a').textContent = ticker;
    } else {
        document.querySelector('#symbol-b').textContent = ticker;
    }
    if (historySymbolA.toLowerCase() !== 'usd') {
        document.querySelector('#history-symbol-a').textContent = ticker;
    } else {
        document.querySelector('#history-symbol-b').textContent = ticker;
    }
    await updateChartPrice();
    // Add a new iframe with source example.com after the iframe with id phind


    // Add the following elements after the div with id finance
    const financeDiv = document.createElement('div');
    financeDiv.className = 'Exchange-swap-market-box App-box App-box-border';
    financeDiv.id = 'finance';

    const financeIframe = document.createElement('iframe');
    financeIframe.src = 'https://s.tradingview.com/embed-widget/financials/?locale=en#%7B%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Atrue%2C%22largeChartUrl%22%3A%22%22%2C%22displayMode%22%3A%22regular%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22symbol%22%3A%22NASDAQ%3A' + ticker + '%22%2C%22utm_source%22%3A%22%22%2C%22utm_medium%22%3A%22widget_new%22%2C%22utm_campaign%22%3A%22financials%22%2C%22page-uri%22%3A%22__NHTTP__%22%7D';
    financeIframe.id = 'finance';
    financeIframe.style.width = '100%';
    financeIframe.style.height = '60rem';

    financeDiv.appendChild(financeIframe);
    document.getElementById('finance').insertAdjacentElement('afterend', financeDiv);

    // Remove the iframe with id phind
    document.getElementById('finance').remove();



    // Create the tradingview-widget-container div and its child elements
    const tradingViewWidgetContainer = document.createElement('div');
    tradingViewWidgetContainer.className = 'tradingview-widget-container';

    const tradingViewWidget = document.createElement('div');
    tradingViewWidget.className = 'tradingview-widget-container__widget';
    tradingViewWidgetContainer.appendChild(tradingViewWidget);

    const tradingViewWidgetCopyright = document.createElement('div');
    tradingViewWidgetCopyright.className = 'tradingview-widget-copyright';

    const tradingViewWidgetLink = document.createElement('a');
    tradingViewWidgetLink.href = 'https://www.tradingview.com/symbols/NASDAQ-' + ticker + '/financials-overview/';
    tradingViewWidgetLink.rel = 'noopener';
    tradingViewWidgetLink.target = '_blank';

    const tradingViewWidgetSpan = document.createElement('span');
    tradingViewWidgetSpan.className = 'blue-text';
    tradingViewWidgetSpan.textContent = ticker + ' fundamentals';
    tradingViewWidgetLink.appendChild(tradingViewWidgetSpan);

    tradingViewWidgetCopyright.appendChild(tradingViewWidgetLink);
    tradingViewWidgetContainer.appendChild(tradingViewWidgetCopyright);

    const tradingViewWidgetScript = document.createElement('script');
    tradingViewWidgetScript.type = 'text/javascript';
    tradingViewWidgetScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-financials.js';
    tradingViewWidgetScript.async = true;
    tradingViewWidgetScript.textContent = `{
  "colorTheme": "dark",
  "isTransparent": true,
  "largeChartUrl": "",
  "displayMode": "regular",
  "width": "100%",
  "height": "100%",
  "symbol": "NASDAQ:TSLA",
  "locale": "en"
}`;

    tradingViewWidgetContainer.appendChild(tradingViewWidgetScript);

    // Insert the tradingview-widget-container div after the iframe with id phind
    document.getElementById('phind').insertAdjacentElement('afterend', tradingViewWidgetContainer);
});


// Add event click listener to realtime-exchange-swap-ball
document.querySelector('#realtime-exchange-swap-ball').addEventListener('click', (event) => {
    event.preventDefault();
    // Get the text content of #symbol-a and #symbol-b
    const symbolA = document.querySelector('#symbol-a').textContent;
    const symbolB = document.querySelector('#symbol-b').textContent;
    const symbolAAmount = document.querySelector('#symbol-a-amount').value;
    const symbolBAmount = document.querySelector('#symbol-b-amount').value;
    // Exchange symbol-a-amount value and symbol-b-amount value
    document.querySelector('#symbol-a-amount').value = symbolBAmount;
    document.querySelector('#symbol-b-amount').value = symbolAAmount;
    // Swap the text content of #symbol-a and #symbol-b
    document.querySelector('#symbol-a').textContent = symbolB;
    document.querySelector('#symbol-b').textContent = symbolA;

    // Get the step, pattern, and placeholder attributes of symbol-a-amount and symbol-b-amount
    const symbolAStep = document.querySelector('#symbol-a-amount').getAttribute('step');
    const symbolAPattern = document.querySelector('#symbol-a-amount').getAttribute('pattern');
    const symbolAPlaceholder = document.querySelector('#symbol-a-amount').getAttribute('placeholder');
    const symbolBStep = document.querySelector('#symbol-b-amount').getAttribute('step');
    const symbolBPattern = document.querySelector('#symbol-b-amount').getAttribute('pattern');
    const symbolBPlaceholder = document.querySelector('#symbol-b-amount').getAttribute('placeholder');

    // Swap the step, pattern, and placeholder attributes of symbol-a-amount and symbol-b-amount
    document.querySelector('#symbol-a-amount').setAttribute('step', symbolBStep);
    document.querySelector('#symbol-a-amount').setAttribute('pattern', symbolBPattern);
    document.querySelector('#symbol-a-amount').setAttribute('placeholder', symbolBPlaceholder);
    document.querySelector('#symbol-b-amount').setAttribute('step', symbolAStep);
    document.querySelector('#symbol-b-amount').setAttribute('pattern', symbolAPattern);
    document.querySelector('#symbol-b-amount').setAttribute('placeholder', symbolAPlaceholder);
});

document.querySelector('#history-exchange-swap-ball').addEventListener('click', (event) => {
    event.preventDefault();
    // Get the text content of #symbol-a and #symbol-b
    const symbolA = document.querySelector('#history-symbol-a').textContent;
    const symbolB = document.querySelector('#history-symbol-b').textContent;
    const symbolAAmount = document.querySelector('#history-symbol-a-amount').value;
    const symbolBAmount = document.querySelector('#history-symbol-b-amount').value;
    // Exchange symbol-a-amount value and symbol-b-amount value
    document.querySelector('#history-symbol-a-amount').value = symbolBAmount;
    document.querySelector('#history-symbol-b-amount').value = symbolAAmount;
    // Swap the text content of #symbol-a and #symbol-b
    document.querySelector('#history-symbol-a').textContent = symbolB;
    document.querySelector('#history-symbol-b').textContent = symbolA;

    // Get the step, pattern, and placeholder attributes of symbol-a-amount and symbol-b-amount
    const symbolAStep = document.querySelector('#symbol-a-amount').getAttribute('step');
    const symbolAPattern = document.querySelector('#symbol-a-amount').getAttribute('pattern');
    const symbolAPlaceholder = document.querySelector('#symbol-a-amount').getAttribute('placeholder');
    const symbolBStep = document.querySelector('#symbol-b-amount').getAttribute('step');
    const symbolBPattern = document.querySelector('#symbol-b-amount').getAttribute('pattern');
    const symbolBPlaceholder = document.querySelector('#symbol-b-amount').getAttribute('placeholder');

    // Swap the step, pattern, and placeholder attributes of symbol-a-amount and symbol-b-amount
    document.querySelector('#history-symbol-a-amount').setAttribute('step', symbolBStep);
    document.querySelector('#history-symbol-a-amount').setAttribute('pattern', symbolBPattern);
    document.querySelector('#history-symbol-a-amount').setAttribute('placeholder', symbolBPlaceholder);
    document.querySelector('#history-symbol-b-amount').setAttribute('step', symbolAStep);
    document.querySelector('#history-symbol-b-amount').setAttribute('pattern', symbolAPattern);
    document.querySelector('#history-symbol-b-amount').setAttribute('placeholder', symbolAPlaceholder);
});

// Add event listener to symbol-a-amount for value change
document.querySelector('#symbol-a-amount').addEventListener('input', (event) => {
    updateSymbolBAmountBySymbolA();
});

document.querySelector('#history-symbol-a-amount').addEventListener('input', (event) => {
    updateHistorySymbolBAmountBySymbolA();
});

// Add event listener to symbol-b-amount for value change
document.querySelector('#symbol-b-amount').addEventListener('input', (event) => {
    updateSymbolAAmountBySymbolB();
});

document.querySelector('#history-symbol-b-amount').addEventListener('input', (event) => {
    updateHistorySymbolAAmountBySymbolB();
});

// Add event listener to trade-button
document.querySelector('#trade-button').addEventListener('click', (event) => {
    event.preventDefault();
    // whether #realtime-panel-button get the active class or not
    if (document.querySelector('#realtime-panel-button').classList.contains('active')) {
        // Your desired functionality here
        // Determine if it is a buy or sell action
        const symbolA = document.querySelector('#symbol-a').textContent;
        const symbolB = document.querySelector('#symbol-b').textContent;
        const action = symbolA.toLowerCase() === 'usd' ? 'buy' : 'sell';

        // Get the number of shares and stock symbol
        shares = action === 'buy' ? document.querySelector('#symbol-b-amount').value : document.querySelector('#symbol-a-amount').value;
        // round share to integer
        shares = Math.round(shares);
        const stockSymbol = action === 'buy' ? symbolB : symbolA;
        document.getElementById("tradeErrorMsg").innerText =
            "Submmiting transaction.....";
        document.getElementById("tradeErrorMsg").classList.remove("success");
        document.getElementById("tradeErrorMsg").classList.remove("error");
        // Make a GET request to /makeTransaction
        fetch(`/makeTransaction/${stockSymbol}/${action}/${shares}`)
            .then(response => {
                if (response.ok) {
                    console.log("Submit Transaction")
                    console.log(response)
                    document.getElementById("tradeErrorMsg").innerText =
                        "Successfully submit transaction";
                    // add error class to element by id errormsg
                    document.getElementById("tradeErrorMsg").classList.add("success");
                } else {
                    console.log(response);
                    document.getElementById("tradeErrorMsg").innerText =
                        "An error occured";
                    // add error class to element by id errormsg
                    document.getElementById("tradeErrorMsg").classList.add("error");
                }
            })
            .catch(error => {
                console.log(error);
                document.getElementById("errorMsg").innerText =
                    error;
                // add error class to element by id errormsg
                document.getElementById("errorMsg").classList.add("error");
            });
    }
    else {
        symbolA = document.querySelector('#history-symbol-a').textContent;
        // delte space and \n in symbol a
        symbolA = symbolA.replace(/\s/g, '');
        symbolB = document.querySelector('#history-symbol-b').textContent;
        symbolB = symbolB.replace(/\s/g, '');
        const action = symbolA.toLowerCase() === 'usd' ? 'buy' : 'sell';

        // Get the number of shares and stock symbol
        shares = action === 'buy' ? document.querySelector('#history-symbol-b-amount').value : document.querySelector('#history-symbol-a-amount').value;
        // round share to integer
        shares = Math.round(shares);
        const stockSymbol = action === 'buy' ? symbolB : symbolA;
        document.getElementById("tradeErrorMsg").innerText =
            "Submmiting transaction.....";
        document.getElementById("tradeErrorMsg").classList.remove("success");
        document.getElementById("tradeErrorMsg").classList.remove("error");
        // get date from date picker
        const date = document.querySelector('#history-date-input').value;
        // Make a GET request to /makeTransaction
        fetch(`/makeTransaction/${stockSymbol}/${action}/${shares}/${date}`)
            .then(response => {
                if (response.ok) {
                    console.log("Submit Transaction")
                    console.log(response)
                    document.getElementById("tradeErrorMsg").innerText =
                        "Successfully submit transaction";
                    // add error class to element by id errormsg
                    document.getElementById("tradeErrorMsg").classList.add("success");
                } else {
                    console.log(response);
                    document.getElementById("tradeErrorMsg").innerText =
                        "An error occured";
                    // add error class to element by id errormsg
                    document.getElementById("tradeErrorMsg").classList.add("error");
                }
            })
            .catch(error => {
                console.log(error);
                document.getElementById("errorMsg").innerText =
                    error;
                // add error class to element by id errormsg
                document.getElementById("errorMsg").classList.add("error");
            });
    }
    setTimeout(() => {
        updateTradeHistoryTable()
    }, 10000);
});

// add listner to history-panel-button. Change the style of div with id history-date-section to display: block
document.querySelector('#history-panel-button').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('history-section').style.display = 'block';
    document.getElementById('realtime-section').style.display = 'none';
    // remove class active from history-date-section-title
    document.getElementById('history-panel-button').classList.remove('muted');
    // add class active to history-panel-button
    document.getElementById('history-panel-button').classList.add('active');
    // remove class active to realtime-panel-button and add muted class to it
    document.getElementById('realtime-panel-button').classList.remove('active');
    document.getElementById('realtime-panel-button').classList.add('muted');
});

document.querySelector('#realtime-panel-button').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('history-section').style.display = 'none';
    document.getElementById('realtime-section').style.display = 'block';
    // remove class active from history-date-section-title
    document.getElementById('realtime-panel-button').classList.remove('muted');
    // add class active to history-panel-button
    document.getElementById('realtime-panel-button').classList.add('active');
    // remove class active to realtime-panel-button and add muted class to it
    document.getElementById('history-panel-button').classList.remove('active');
    document.getElementById('history-panel-button').classList.add('muted');
});