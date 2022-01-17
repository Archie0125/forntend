function removeMan(id){
    swal({
        title: "確定刪除嗎?",
        icon: "warning",
        buttons: {
            Btn: false,
            cancel: {
            text: "取消",
            visible: true
            },
            danger: {
            text: "確定",
            visible: true
            }
        },
        dangerMode: true,
    }).then((value) => {
        if(value){
            $.ajax({
                url: 'http://140.118.216.40/api/user/' + id,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : "Bearer " + localStorage.getItem("token"),
                },
                success: function(result){
                    swal ( "刪除會員成功",  "success" );
                    reset()
                },
                error: function(result){
                    swal ( "刪除會員:" + result.responseJSON.message ,  "error" );
                }, 
            })
        }
    });
}

function addMan(name,id){
    var Dom = '<button type="button" class="btn btn-sm btn-outline-secondary m-2"  onClick="removeMan(this.id)" id="'+id+'" >'+name+' <span class="text-red">X</span></button>';
    $("#memberBoxEnd").before(Dom);
}
function addRoom(name,id){
    var Dom = '<button type="button" class="btn btn-sm btn-outline-secondary m-2"  onClick="removeRoom(this.id)" id="'+id+'" >'+name+' <span class="text-red">X</span></button>';
    $("#roomBoxEnd").before(Dom);
}

$('#addRoom').on('click',function(){
    var data ={"name": $("#roomName").val(),};
    $.ajax({
        url: 'http://140.118.216.40/api/meeting-room',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "Bearer " + localStorage.getItem("token"),
        },
        data: JSON.stringify(data),

        success: function(result){
            swal ( "新增會議室成功",  "success" );
            reset()
        },
        error: function(result){
            console.log(result);
            var errors = result.responseJSON.data.errors;
            var message = "";
            if(errors && errors.name){
                for(var i=0;i<errors.name.length;i++){message+=errors.name[i]+"\n";}
            }
            swal ( "新增會議室" + result.responseJSON.message ,  message ,  "error" );
        },  
    })
})

$('#editRoom').on('click',function(){
    var data ={"name": $("#newRoomName").val(),};
    $.ajax({
        url: 'http://140.118.216.40/api/meeting-room/' + $("#RoomList").val(),
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "Bearer " + localStorage.getItem("token"),
        },
        data: JSON.stringify(data),

        success: function(result){
            swal ( "編輯會議室成功",  "success" );
            reset()
        },
        error: function(result){
            console.log(result);
            var errors = result.responseJSON.data.errors;
            var message = "";
            if(errors && errors.name){
                for(var i=0;i<errors.name.length;i++){message+=errors.name[i]+"\n";}
            }
            swal ( "編輯會議室:" + result.responseJSON.message ,  message ,  "error" );
        },  
    })
})

function removeRoom(id){
    swal({
        title: "確定刪除嗎?",
        icon: "warning",

        buttons: {
                Btn: false,
                cancel: {
                text: "取消",
                visible: true
                },
                danger: {
                text: "確定",
                visible: true
                }
            },
        dangerMode: true,
    }).then((value) => {
        if(value){
            $.ajax({
                url: 'http://140.118.216.40/api/meeting-room/' + id,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : "Bearer " + localStorage.getItem("token"),
            },
                success: function(result){
                    swal ( "刪除會議室成功",  "success" );
                    reset()
                },
                error: function(result){
                    swal ( "刪除會議室:" + result.responseJSON.message ,  "error" );
                }, 
            })
        }
    });
    
}

function reset(){
    $("#roomBox").html('<div id ="roomBoxEnd"></div>');
    $("#memberBox").html('<div id ="memberBoxEnd"></div>');
    $("#RoomList").html('');

    $.ajax({
        url: 'http://140.118.216.40/api/meeting-room',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "Bearer " + localStorage.getItem("token"),
    },

        success: function(result){
            console.log("success");
            var rooms = result.data.meeting_rooms;
            addRoomList(rooms)
            for(var i=0;i<rooms.length;i++){ addRoom(rooms[i].name,rooms[i].id); }
        },
        error: function(result){
            console.log("error");
        },  
    })

    $.ajax({
        url: 'http://140.118.216.40/api/user/all',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "Bearer " + localStorage.getItem("token"),
    },
        success: function(result){
            var users = result.data.users;
            for(var i=0;i<users.length;i++){ addMan(users[i].name,users[i].id); }
        },
    })
}

function addRoomList(list){
    select = document.getElementById('RoomList');
    for (var i = 0; i<list.length; i++){
        var opt = document.createElement('option');
        opt.value = list[i].id;
        opt.id = "roomList_" + list[i].id.toString();
        opt.innerHTML = list[i].name;
        select.appendChild(opt);
    }
}

$(document).ready(function (){
    reset();
})