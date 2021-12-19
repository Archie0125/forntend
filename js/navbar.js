$(document).ready(function (){
    if (localStorage.getItem("token") === null) {window.location.href="login.html";}
    $.ajax({
        url: 'https://140.118.216.40/api/user',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "Bearer " + localStorage.getItem("token"),
    },
        success: function(result){$("#userName").html("HI~ "+result.data.user.name);},
    })

})
    
function userLogout(){
    console.log("logout");
    
    $.ajax({
        url: 'https://140.118.216.40/api/auth/logout',
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "Bearer " + localStorage.getItem("token"),
    },
        success: function(){
            localStorage.clear();
            window.location.href="login.html";
        },
    })
}