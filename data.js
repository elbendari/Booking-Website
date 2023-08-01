var signupBtn = document.getElementById("signupBtn")
var loginBtn = document.getElementById("loginBtn")



signupBtn.addEventListener("click", function () {
    var userName = document.getElementById("username").value
    var email = document.getElementById("email").value
    var password = document.getElementById("password").value
    var smallUser = document.getElementById("small_for_userName")
    var smallEmail = document.getElementById("small_for_email")
    var smallPassword = document.getElementById("small_for_password")

    console.log(password);
    var flag_username = true;
    if ((/^[a-zA-Z0-9]+$/).test(userName)) {
        smallUser.style.display = "none"
        flag_username = true;
    } else {
        smallUser.style.display = "block";
        flag_username = false;
    }

    var flag_email = true;
    if ((/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(email)) {
        smallEmail.style.display = "none"
        flag_email = true;
    }
    else {
        smallEmail.style.display = "block";
        flag_email = false;
    }

    var flag_password = true;
    if ((/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/).test(password)) {
        smallPassword.style.display = "none"
        flag_password = true;
    } else {
        smallPassword.style.display = "block";
        flag_password = false;
    }

    if (flag_username && flag_email && flag_password) {
        var data = {
            "username": userName,
            "email": email,
            "password": password
        }
        var users = JSON.parse(localStorage.getItem("users"));
        if (users == null) {
            users = [];
        }
        users.push(data)
        localStorage.setItem("users", JSON.stringify(users));
        alert("user added")
        // jsonText.innerHTML = JSON.stringify(data)
    }
})


loginBtn.addEventListener("click", function () {
    var email = document.getElementById("loginEmail").value
    var password = document.getElementById("loginPassword").value
    var flag = false;
    var users = JSON.parse(localStorage.getItem("users"))
    for (var i = 0; i < users.length; i++) {
        if (email == users[i].email && password == users[i].password) {
            flag = true
            localStorage.setItem("login", JSON.stringify(email));
        }
    }

    if (flag) {
        window.location.href = "index.html";
    }
})