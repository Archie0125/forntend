$('#register').on('click',function(){
    var data ={
        "name": $("#register_name").val(),
        "email": $("#register_email").val(),
        "password": $("#register_password").val(),
        "password_confirmation": $("#register_confirmation").val()
        };
    $.ajax({
        url: 'https://140.118.216.40/api/auth/register',
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        data: JSON.stringify(data),
        success: function(result){
            console.log("success");
        },
        error: function(result){
        var errors = result.responseJSON.data.errors;
        var message = "";
        if(errors){
            if(errors.email){
                for(var i=0;i<errors.email.length;i++){message+=errors.email[i]+"\n";}
            }
            if(errors.name){
                for(var i=0;i<errors.name.length;i++){message+=errors.name[i]+"\n";}
            }
            if(errors.password){
                for(var i=0;i<errors.password.length;i++){message+=errors.password[i]+"\n";}
            }
        }
        swal ( "Register:" + result.responseJSON.message ,  message ,  "error" );
        }, 
    })
})

$('#login').on('click',function(){
    var data ={"email":  $("#login_email").val(),"password":  $("#login_password").val()};
    $.ajax({
        url: 'https://140.118.216.40/api/auth/login',
        method: 'POST',
        headers: {'Content-Type': 'application/json',},
        data: JSON.stringify(data),
        success: function(result){
            localStorage.setItem("token", result.data.token)
            localStorage.setItem("datePicker", new Date().toISOString().slice(0, 10));
            window.location.href="index.html";
        },
        error: function(result){
        var errors = result.responseJSON.data.errors;
        var message = "";
        if(errors){
            if(errors.email){
                for(var i=0;i<errors.email.length;i++){message+=errors.email[i]+"\n";}
            }
            if(errors.password){
                for(var i=0;i<errors.password.length;i++){message+=errors.password[i]+"\n";}
            }
        }
        swal ( "Login:" + result.responseJSON.message ,  message ,  "error" );
        }
    })
})