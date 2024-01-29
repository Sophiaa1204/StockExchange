function tradeStock(action) {
    var shares = document.getElementById("shares").value;
    var tickers = document.getElementById("tickers").value;
    if (action == "buy") {
        url = "/buyStocks";
    }
    if (action == "sell") {
        url = "/sellStocks";
    }
    console.log({
        "url": url,
        "shares": shares,
        "tickers": tickers
    })
    fetch(url, {
        method: "POST",
        body: {
            "shares": shares,
            "tickers": tickers
        }
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
    }).catch(function (error) {
        console.error(error);
    });
}
