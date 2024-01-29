// show signup modal
document.querySelector('#sign_up_button').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('sign_up_modal').style.display = 'block';
});

document
    .querySelector("#signup-button")
    .addEventListener("click", async (event) => {
        event.preventDefault();
        const username =
            document.getElementById("username_signup").value;
        const password =
            document.getElementById("password_signup").value;
        const email = document.getElementById("email_signup").value;
        const phone_number = document.getElementById(
            "phone_number_signup"
        ).value;
        const first_name =
            document.getElementById("first_name_signup").value;
        const last_name =
            document.getElementById("last_name_signup").value;
        // send to server
        try {
            const response = await fetch("/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                    phone_number,
                    first_name,
                    last_name,
                }),
            });

            // if success, redirect to index.html
            if (response.ok || response.status === "Success") {
                window.location.href = "/";
            } else {
                response.json().then((data) => {
                    // else, show error
                    document.getElementById("signUpErrorMsg").innerText =
                        data.error;
                    console.log(data.error)
                    // add error class to element by id errormsg
                    document.getElementById("signUpErrorMsg").classList.add("error");
                });
            }
        } catch (err) {
            document.getElementById("signUpErrorMsg").innerText =
                "An error occurred. Please try again.";
            // add error class to element by id errormsg
            document.getElementById("signUpErrorMsg").classList.add("error");
        }
    });
