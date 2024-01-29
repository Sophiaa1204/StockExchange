// show signin modal
document.querySelector('#sign_in_button').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('sign_in_modal').style.display = 'block';
});

document
    .querySelector("#signin-button")
    .addEventListener("click", async (event) => {
        event.preventDefault();
        const username =
            document.getElementById("username_signin").value;
        const password =
            document.getElementById("password_signin").value;

        // send to server
        try {
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            // if success, redirect to index.html
            if (response.ok || response.status === "Success") {
                window.location.href = "/";
            } else {
                response.json().then((data) => {
                    // else, show error
                    document.getElementById("errorMsg").innerText =
                        data.error;
                    console.log(response)
                    // add error class to element by id errormsg
                    document.getElementById("errorMsg").classList.add("error");
                });
            }
        } catch (err) {
            document.getElementById("errorMsg").innerText =
                "An error occurred. Please try again.";
            // add error class to element by id errormsg
            document.getElementById("errorMsg").classList.add("error");
        }
    });
