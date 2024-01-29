async function drawDailySimpleReturn(ticker = "AAPL") {
    // get id errorMsg and clear the text content
    dailySimpleReturnErrorMsg = document.getElementById("dailySimpleReturnErrorMsg");
    dailySimpleReturnErrorMsg.classList.remove("error")
    dailySimpleReturnErrorMsg.textContent = "Drawing.....";
    dailySimpleReturnErrorMsg.style.display = "block";
    const chart = Chart.getChart("dailySimpleReturn");
    if (chart != undefined) {
        chart.destroy();
    }
    fetch('/getDailySimpleReturnByTicker', {
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
            const ctxDailySimpleReturn = document.getElementById("dailySimpleReturn");
            const dataDailySimpleReturn = {
                labels: data.labels,
                datasets: [{
                    label: 'Daily Simple Return %',
                    data: data.data,
                },],
            };
            const configDailySimpleReturn = {
                type: "scatter",
                data: dataDailySimpleReturn,
                options: {
                    scales: {
                        x: {
                            type: 'category',
                            labels: data.labels,
                        },
                    },
                },
            };
            new Chart(ctxDailySimpleReturn, configDailySimpleReturn);
            console.log(data.data);
            dailySimpleReturnErrorMsg.textContent = "";
            dailySimpleReturnErrorMsg.style.display = "none";

        }
        ).catch(error => {
            dailySimpleReturnErrorMsg.textContent = error
            dailySimpleReturnErrorMsg.classList.add("error");
            console.error(error)
        });
}
drawDailySimpleReturn();