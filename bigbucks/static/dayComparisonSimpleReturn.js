async function drawDayComparisonSimpleReturn(ticker = "AAPL") {
    // get id errorMsg and clear the text content
    dayComparisonSimpleReturnErrorMsg = document.getElementById("dayComparisonSimpleReturnErrorMsg");
    dayComparisonSimpleReturnErrorMsg.classList.remove("error")
    dayComparisonSimpleReturnErrorMsg.textContent = "Drawing.....";
    dayComparisonSimpleReturnErrorMsg.style.display = "block";
    const chart = Chart.getChart("dayComparisonSimpleReturn");
    if (chart != undefined) {
        chart.destroy();
    }
    fetch('/getReturnComparisonByTicker', {
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
                    dayComparisonSimpleReturnErrorMsg.textContent = data.error
                    dayComparisonSimpleReturnErrorMsg.classList.add("error");
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
            const ctxDayComparisonSimpleReturn = document.getElementById("dayComparisonSimpleReturn");
            const dataDayComparisonSimpleReturn = {
                datasets: [{
                    label: 'Daily Simple Return %',
                    data: data.data,
                },],
            };
            const configDayComparisonSimpleReturn = {
                type: "scatter",
                data: dataDayComparisonSimpleReturn,
            };
            new Chart(ctxDayComparisonSimpleReturn, configDayComparisonSimpleReturn);
            console.log(data.data);
            dayComparisonSimpleReturnErrorMsg.textContent = "";
            dayComparisonSimpleReturnErrorMsg.style.display = "none";

        }
        ).catch(error => {
            dayComparisonSimpleReturnErrorMsg.textContent = error
            dayComparisonSimpleReturnErrorMsg.classList.add("error");
            console.error(error)
        });
}
drawDayComparisonSimpleReturn();