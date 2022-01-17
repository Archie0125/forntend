function addMembersList(list){
    select = document.getElementById('membersList');
    for (var i = 0; i<list.length; i++){
        var opt = document.createElement('option');
        opt.value = list[i].id;
        opt.id = "member_" + list[i].id.toString();
        opt.innerHTML = list[i].name;
        select.appendChild(opt);
    }
}

function addTimeList(freeTime){
    select = document.getElementById("end_time");
    var start = +start_time +1;
    for (var i = 0; i<=freeTime.length; i++){
        if(freeTime[i]==start){
            var opt = document.createElement('option');
            opt.innerHTML = start+":00";
            opt.value = start++;
            select.appendChild(opt);
        }
    }
    var opt = document.createElement('option');
        opt.innerHTML = start+":00";
        opt.value = start++;
        select.appendChild(opt);
}

var mySet = new Set();
$('#addMan').on('click',function(){
    var id = $('#membersList').val();
    if(mySet.has(id)){
        swal ( "邀請人重複" , '' ,  "warning" );
    }else{
        mySet.add(id);
        var Dom = '<button type="button" class="btn btn-sm btn-outline-secondary"  onClick="removeMan(this.value)" value="'+id+'" id="Man_'+id+'" >'+ $('#member_' + id).text()+' <span class="text-red">X</span></button>';
        $('#memberBoxEnd').before(Dom);
    }
})

function removeMan(id){
    mySet.delete(id);
    $('#Man_'+id).remove();
}

function reset(){
    $("#start_time").html(localStorage.getItem("start_time")+":00");
    $("#date").html(datePicker);

    $.ajax({
        url: 'http://140.118.216.40/api/user/all',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "Bearer " + localStorage.getItem("token"),
    },
        success: function(result){
            addMembersList(result.data.users)
        },
    })

    $.ajax({
        url: 'http://140.118.216.40/api/meeting-room/free-time?date=' + datePicker,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "Bearer " + localStorage.getItem("token"),
    },
        success: function(result){
            var room = result.data.meeting_rooms[room_id-1];
            // console.log(room.free_times);
            addTimeList(room.free_times);
            $("#room_name").html(room.name);
        },
    })

}
var datePicker=localStorage.getItem("datePicker");
var start_time=localStorage.getItem("start_time");
var room_id=localStorage.getItem("room_id");

$(document).ready(function (){reset()})
                
function closeCreate(){window.location.href="index.html";}

function createrMeeging(){
    var times = [];
    var participants =[];
    var end_time = $("#end_time").val();
    
    mySet.forEach(((value) => { participants.push(value);} ));
    for(var i = +start_time;i<end_time;i++){times.push(i);}
    
    var data = {
        "name": $("#name").val(),
        "meeting_room_id": room_id,
        "date": datePicker,
        "times": times,
        "participants": participants,   
    }

    $.ajax({
        url: 'http://140.118.216.40/api/meeting',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "Bearer " + localStorage.getItem("token"),
        },
        data: JSON.stringify(data),
        success: function(result){
            swal({
                title: "成功",
                type: "success"
            }).then(function() {
                window.location = "index.html";
            });
        },
        error: function(result){
            var errors = result.responseJSON.data.errors;
            var message = "";
            if(errors){
                if(errors.name){
                    for(var i=0;i<errors.name.length;i++){message+=errors.name[i]+"\n";}
                }
                if(errors.participants){
                    for(var i=0;i<errors.participants.length;i++){message+=errors.participants[i]+"\n";}
                }
            }
            swal ( "會議創建:" + result.responseJSON.message ,  message ,  "error" );
        }           
    })
}