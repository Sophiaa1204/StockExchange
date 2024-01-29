async function drawStockIndexCompLinePrice(ticker = "AAPL") {
    // get id errorMsg and clear the text content
    stockIndexCompLinePriceErrorMsg = document.getElementById("stockIndexCompLinePriceErrorMsg");
    stockIndexCompLinePriceErrorMsg.classList.remove("error")
    stockIndexCompLinePriceErrorMsg.textContent = "Drawing.....";
    stockIndexCompLinePriceErrorMsg.style.display = "block";
    const chart = Chart.getChart("stockIndexCompLinePrice");
    if (chart != undefined) {
        chart.destroy();
    }
    fetch('/getStockIndexComparison', {
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
                    stockIndexCompLinePriceErrorMsg.textContent = data.error
                    stockIndexCompLinePriceErrorMsg.classList.add("error");
                })

            }
        }).then(data => {
            data.stock.sort((a, b) => {
                if (a.x < b.x) {
                    return -1;
                }
                if (a.x > b.x) {
                    return 1;
                }
                return 0;
            });
            data.index.sort((a, b) => {
                if (a.x < b.x) {
                    return -1;
                }
                if (a.x > b.x) {
                    return 1;
                }
                return 0;
            });
            const ctxStockIndexCompLinePrice = document.getElementById("stockIndexCompLinePrice");
            const dataStockIndexCompLinePrice = {
                labels: data.labels,
                datasets: [{
                    label: ticker,
                    data: data.stock,
                    yAxisID: 'y-axis-1',
                    borderColor: 'rgba(45, 143, 230, 0.3)',
                    backgroundColor: 'rgba(45, 143, 230, 0)',
                    width: 0.3
                },
                {
                    label: "S&P500",
                    data: data.index,
                    yAxisID: 'y-axis-2',
                    borderColor: 'rgba(252, 72, 113, 0.3)',
                    backgroundColor: 'rgba(252, 72, 113, 0)',
                    width: 0.3
                }
                ],
            };
            const configStockIndexCompLinePrice = {
                type: "line",
                data: dataStockIndexCompLinePrice,
                options: {
                    scales: {
                        x: {
                            type: 'category',
                            labels: data.labels,
                        },
                        'y-axis-1':
                        {
                            position: 'left',
                            scaleLabel: {
                                display: true,
                                labelString: ticker
                            }
                        },
                        'y-axis-2': {
                            position: 'right',
                            scaleLabel: {
                                display: true,
                                labelString: 'S&P500'
                            }
                        }

                    },
                },
            };
            new Chart(ctxStockIndexCompLinePrice, configStockIndexCompLinePrice);
            console.log(data);
            stockIndexCompLinePriceErrorMsg.textContent = "";
            stockIndexCompLinePriceErrorMsg.style.display = "none";

        }
        ).catch(error => {
            stockIndexCompLinePriceErrorMsg.textContent = error
            stockIndexCompLinePriceErrorMsg.classList.add("error");
            console.error(error)
        });
}
drawStockIndexCompLinePrice();