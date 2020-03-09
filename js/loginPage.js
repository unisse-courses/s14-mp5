$(window).on('load', function() {

    $("#login").click(function() {
        var valid = true;

        valid = checkValidLogin();

        if(!valid) {
            alert("Invalid username or incorrect password.");
        }

        return valid;
    })

    $("#register").click(function(){
        var valid = true;

        valid = checkField($("#remail"));
        if(valid) {
            valid = checkField($("#rusername"));
        } if(valid) {
            valid = checkField($("#rpwd"));
        } if(valid) {
            valid = checkField($("#rcpwd"));
        } if(valid) {
            valid = checkEmail($("#remail"));
        } if(valid) {
            valid = checkEqual($("#rpwd"), $("#rcpwd"));
        } if(valid) {
            let account = {
                username: $("#rusername").val(),
                password: $("#rpwd").val()
            }

            accounts.push(account);

            alert("Registered successfully!");
            $("#registerForm").modal('toggle');
            $("#remail").val("");
            $("#rusername").val("");
            $("#rpwd").val("");
            $("#rcpwd").val("");
        }
    });

    // Validates login credentials of the user, if username matches corresponding password
    function checkValidLogin() {
        var user = $("#username").val();
        var pass = $("#password").val();

        for(let i = 0; i < accounts.length; i++) {
            if(user == accounts[i]['username']) {
                if(pass == accounts[i]['password']) {
                    return true;
                }
                return false;
            }
        };

        return false;
    }

    function checkField(field) {
        if(field.val() == '') {
            alert("Please input all information");
            return false;
        }

        return true;
    }

    function checkEqual(field1, field2) {
        if(field1.val() != field2.val() || field1.val() == '') {
            alert("Password does not match");
            return false;
        }

        return true;
    }

    function checkEmail(field) {
        var atIndex = field.val().indexOf('@');
        var dotIndex = field.val().lastIndexOf('.');

        if(atIndex == -1 || dotIndex == -1 || atIndex > dotIndex) {
            alert("Invalid email format");
            return false;
        }

        return true;
    }

    var accounts = [];
    let account = {
        username: "guest1",
        password: "guest1"
    };
    accounts.push(account);
    account = {
        username: "guest2",
        password: "guest2"
    };
    accounts.push(account);
    account = {
        username: "guest3",
        password: "guest3"
    };
    accounts.push(account);
    account = {
        username: "guest4",
        password: "guest4"
    };
    accounts.push(account);
    account = {
        username: "guest5",
        password: "guest5"
    };
    accounts.push(account);
});
