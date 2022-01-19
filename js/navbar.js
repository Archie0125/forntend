$(document).ready(function (){
    if (localStorage.getItem("token") === null) {window.location.href="login.html";}
    $.ajax({
        url: 'http://140.118.216.40/api/user',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "Bearer " + localStorage.getItem("token"),
    },
        success: function(result){
            if(result.data.user.id!=1){
                $("#adminItem").html("");
            }
            $("#userName").html("HI~ "+result.data.user.name);
            localStorage.setItem("name", result.data.user.name);
        },
    })

})
    
function userLogout(){
    console.log("logout");
    
    $.ajax({
        url: 'http://140.118.216.40/api/auth/logout',
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


function cal(){
    var req = new XMLHttpRequest();
    req.open("GET", 'http://140.118.216.40/api/user/calendar', true);
    req.responseType = "blob";
    req.setRequestHeader("authorization", "Bearer " + localStorage.getItem("token"));

    req.onload = function (event) {
        var blob = req.response;
        console.log(blob.size);
        var link=document.createElement('a');
        link.href=window.URL.createObjectURL(blob);
        link.download= localStorage.getItem("name") +" "+ new Date() + ".ics";
        link.click();
        };
    
    req.send();
}