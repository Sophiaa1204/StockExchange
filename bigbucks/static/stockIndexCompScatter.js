async function drawStockIndexCompScatter(ticker = "AAPL") {
    // get id errorMsg and clear the text content
    stockIndexCompScatterErrorMsg = document.getElementById("stockIndexCompScatterErrorMsg");
    stockIndexCompScatterErrorMsg.classList.remove("error")
    stockIndexCompScatterErrorMsg.textContent = "Drawing.....";
    stockIndexCompScatterErrorMsg.style.display = "block";
    const chart = Chart.getChart("stockIndexCompScatter");
    if (chart != undefined) {
        chart.destroy();
    }
    fetch('/getScatterStockIndexReturnComparison', {
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
                    stockIndexCompScatterErrorMsg.textContent = data.error
                    stockIndexCompScatterErrorMsg.classList.add("error");
                })

            }
        }).then(data => {
            // data.data.sort((a, b) => {
            //     if (a.x < b.x) {
            //         return -1;
            //     }
            //     if (a.x > b.x) {
            //         return 1;
            //     }
            //     return 0;
            // });
            const ctxStockIndexCompScatter = document.getElementById("stockIndexCompScatter");
            const dataStockIndexCompScatter = {
                datasets: [{
                    label: 'Stock vs Index Return',
                    data: data.data,
                },],
            };
            const configStockIndexCompScatter = {
                type: "scatter",
                data: dataStockIndexCompScatter,
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: ticker
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: "S&P500"
                            }
                        }
                    }
                }
            };
            new Chart(ctxStockIndexCompScatter, configStockIndexCompScatter);
            console.log(data.data);
            stockIndexCompScatterErrorMsg.textContent = "";
            stockIndexCompScatterErrorMsg.style.display = "none";

        }
        ).catch(error => {
            stockIndexCompScatterErrorMsg.textContent = error
            stockIndexCompScatterErrorMsg.classList.add("error");
            console.error(error)
        });
}
drawStockIndexCompScatter();