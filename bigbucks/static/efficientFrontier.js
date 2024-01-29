efficientFrontierErrorMsg = document.getElementById("efficientFrontierErrorMsg");
efficientFrontierErrorMsg.classList.remove("error")
efficientFrontierErrorMsg.textContent = "Drawing.....";
efficientFrontierErrorMsg.style.display = "block";
fetch('/getEfficientFrontierData').then(
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
        const ctxEfficientFrontier = document.getElementById("efficientFrontier");
        const dataEfficientFrontier = {
            datasets: [{
                label: 'Efficient Frontier',
                data: data.data,
            }],
        };
        const configEfficientFrontier = {
            type: "scatter",
            data: dataEfficientFrontier,

        };
        new Chart(ctxEfficientFrontier, configEfficientFrontier);
        console.log(data);
        efficientFrontierErrorMsg.textContent = "";
        efficientFrontierErrorMsg.style.display = "none";

    }
    ).catch(error => {
        console.error(error)
        efficientFrontierErrorMsg.textContent = error
        efficientFrontierErrorMsg.classList.add("error");
    });