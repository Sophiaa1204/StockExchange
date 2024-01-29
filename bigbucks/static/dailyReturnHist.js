async function drawDailyReturnHist(ticker = "AAPL") {
    // get id errorMsg and clear the text content
    dailyReturnHistErrorMsg = document.getElementById("dailyReturnHistErrorMsg");
    dailyReturnHistErrorMsg.classList.remove("error")
    dailyReturnHistErrorMsg.textContent = "Drawing.....";
    dailyReturnHistErrorMsg.style.display = "block";
    const chart = Chart.getChart("dailyReturnHist");
    if (chart != undefined) {
        chart.destroy();
    }
    fetch('/getReturnHistogramDataByTicker', {
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
                    dailyReturnHistErrorMsg.textContent = data.error
                    dailyReturnHistErrorMsg.classList.add("error");
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
            const ctxDailyReturnHist = document.getElementById("dailyReturnHist");
            const dataDailyReturnHist = {
                labels: data.labels,
                datasets: [{
                    label: 'Daily Simple Return %',
                    data: data.data,
                },],
            };
            const configDailyReturnHist = {
                type: "bar",
                data: dataDailyReturnHist,
            };
            new Chart(ctxDailyReturnHist, configDailyReturnHist);
            console.log(data.data);
            dailyReturnHistErrorMsg.textContent = "";
            dailyReturnHistErrorMsg.style.display = "none";

        }
        ).catch(error => {
            dailyReturnHistErrorMsg.textContent = error
            dailyReturnHistErrorMsg.classList.add("error");
            console.error(error)
        });
}
drawDailyReturnHist();