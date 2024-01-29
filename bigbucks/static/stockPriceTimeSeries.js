function drawStockPriceTimeSeries(ticker = "AAPL") {
    // get id errorMsg and clear the text content
    stockPriceTimeSeriesErrorMsg = document.getElementById("stockPriceTimeSeriesErrorMsg");
    stockPriceTimeSeriesErrorMsg.classList.remove("error")
    stockPriceTimeSeriesErrorMsg.textContent = "Drawing.....";
    // Set the style display of the canvas element with id "stockPriceTimeSeries" to "block"
    stockPriceTimeSeriesErrorMsg.style.display = "block";
    const chart = Chart.getChart("stockPriceTimeSeries");
    if (chart != undefined) {
        chart.destroy();
    }
    fetch('/getTimeSeriesDatabyStock', {
        method: 'POST',
        body: JSON.stringify({ "ticker": ticker }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(
        response => {
            if (response.ok) {
                return response.json();
            }
            else {
                response.json().then((data) => {
                    console.error(data.error);
                    dailySimpleReturnErrorMsg.textContent = data.error
                    dailySimpleReturnErrorMsg.classList.add("error");
                })
            }
        }).then(data => {
            data.data.sort((a, b) => {
                if (a.x < b.x) {
                    return -1;
                }
                if (a.x > b.x) {
                    return 1;
                }
                return 0;
            });
            const ctxStockPriceTimeSeries = document.getElementById("stockPriceTimeSeries");
            const dataStockPriceTimeSeries = {
                datasets: [{
                    label: 'Stock Price Time Series',
                    data: data.data,
                },],
            };
            const configStockPriceTimeSeries = {
                type: "line",
                data: dataStockPriceTimeSeries,
            };
            new Chart(ctxStockPriceTimeSeries, configStockPriceTimeSeries);
            console.log(data);
            stockPriceTimeSeriesErrorMsg.textContent = "";
            stockPriceTimeSeriesErrorMsg.style.display = "none";
            console.log("Sucess draw")

        }
        ).catch(error => {
            stockPriceTimeSeriesErrorMsg.textContent = error
            stockPriceTimeSeriesErrorMsg.classList.add("error");
            console.error(error)
        });
}
drawStockPriceTimeSeries();