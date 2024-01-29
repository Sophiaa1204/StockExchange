async function drawStockIndexCompLine(ticker = "AAPL") {
    // get id errorMsg and clear the text content
    stockIndexCompLineErrorMsg = document.getElementById("stockIndexCompLineErrorMsg");
    stockIndexCompLineErrorMsg.classList.remove("error")
    stockIndexCompLineErrorMsg.textContent = "Drawing.....";
    stockIndexCompLineErrorMsg.style.display = "block";
    const chart = Chart.getChart("stockIndexCompLine");
    if (chart != undefined) {
        chart.destroy();
    }
    fetch('/getReturnComparisonIndexByTicker', {
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
                    stockIndexCompLineErrorMsg.textContent = data.error
                    stockIndexCompLineErrorMsg.classList.add("error");
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
            data.labels = data.stock.map(element => element.x);
            const ctxStockIndexCompLine = document.getElementById("stockIndexCompLine");
            const dataStockIndexCompLine = {
                labels: data.labels,
                datasets: [{
                    label: ticker,
                    data: data.stock,
                    borderColor: 'rgba(45, 143, 230, 0.3)',
                    backgroundColor: 'rgba(45, 143, 230, 0)',
                    width: 0.3
                },
                {
                    label: "S&P500",
                    data: data.index,
                    borderColor: 'rgba(252, 72, 113, 0.3)',
                    backgroundColor: 'rgba(252, 72, 113, 0)',
                    width: 0.3
                }
                ],
            };
            const configStockIndexCompLine = {
                type: "line",
                data: dataStockIndexCompLine,
                options: {
                    scales: {
                        x: {
                            type: 'category',
                            labels: data.labels,
                        },
                    },
                },
            };
            new Chart(ctxStockIndexCompLine, configStockIndexCompLine);
            console.log(data);
            stockIndexCompLineErrorMsg.textContent = "";
            stockIndexCompLineErrorMsg.style.display = "none";

        }
        ).catch(error => {
            stockIndexCompLineErrorMsg.textContent = error
            stockIndexCompLineErrorMsg.classList.add("error");
            console.error(error)
        });
}
drawStockIndexCompLine();