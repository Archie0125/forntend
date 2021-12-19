const myMap = new Map([
    ["08:00:00", 8],
    ["09:00:00", 9],
    ["10:00:00",10],
    ["11:00:00",11],
    ["12:00:00",12],
    ["13:00:00",13],
    ["14:00:00",14],
    ["15:00:00",15],
    ["16:00:00",16],
    ["17:00:00",17],
    ["18:00:00",18],
    ["19:00:00",19],
    ["20:00:00",20],
    ["21:00:00",21],
]);

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
    console.log(freeTime);
    select = document.getElementById("end_time");
    var start = ++start_time;
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
        swal ( "The members have the same.:" , '' ,  "warning" );
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
    $.ajax({
        url: 'https://140.118.216.40/api/user/all',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "Bearer " + localStorage.getItem("token"),
    },
        success: function(result){
            addMembersList(result.data.users)
        },
    })
}
var day;
var room_id;
var times = [];
var meeting_id=localStorage.getItem("meeting_id");


$(document).ready(function (){

    $.ajax({
        url: 'https://140.118.216.40/api/meeting/' + meeting_id,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "Bearer " + localStorage.getItem("token"),
        },
        statusCode: {
            200: function(responseObject, textStatus, jqXHR) {
                var meeting =responseObject.data.meeting;
                var start_time =myMap.get(meeting.meeting_dates[0].time);
                var end_time =myMap.get(meeting.meeting_dates[meeting.meeting_dates.length-1].time)+1;
                var members =meeting.participants;
                
                console.log( meeting);
                localStorage.setItem("meeting_id", id);
                $("#meeting_name").val(meeting.name);
                room_id = meeting.meeting_room.id;
                $("#room_name").html(meeting.meeting_room.name);
                day = meeting.meeting_dates[0].date;
                $("#date").html(day);
                $("#start_time").html(start_time+":00");
                $("#end_time").html(end_time+":00");
                $("#leader").html(meeting.user.name);
                $("#memberBox").html('<div id ="memberBoxEnd"></div>')
                for(var i = 0;i<meeting.meeting_dates.length;i++){
                    times.push(myMap.get(meeting.meeting_dates[i].time));
                }
                for(var i = 0;i<members.length;i++){
                    var id = members[i].user.id;
                    console.log(members[i])
                    var Dom = '<button type="button" class="btn btn-sm btn-outline-secondary"  onClick="removeMan(this.value)" value="'+id+'" id="Man_'+id+'" >'+ members[i].user.name+' <span class="text-red">X</span></button>';
                    $("#memberBoxEnd").before(Dom);
                    mySet.add(id.toString());
                }
                reset()
            },
        }
    })
})



                
function closeCreate(){window.location.href="index.html";}

function editMeeging(){
    var participants =[];
    mySet.forEach(((value) => { participants.push(value);} ));
    
    var data = {
        "name": $("#meeting_name").val(),
        "meeting_room_id": room_id,
        "date": day,
        "times": times,
        "participants": participants,   
    }

    $.ajax({
        
        url: 'https://140.118.216.40/api/meeting/' + meeting_id,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "Bearer " + localStorage.getItem("token"),
        },
        data: JSON.stringify(data),
        success: function(result){
            swal({
                title: "success!",
                type: "success"
            }).then(function() {
                window.location = "index.html";
            });
        },
        error: function(result){

            var errors = result.responseJSON.data.errors;
            var message = "";
            if(errors && errors.name){
                for(var i=0;i<errors.name.length;i++){message+=errors.name[i]+"\n";}
            }
            swal ( "Meeting Edit:" + result.responseJSON.message ,  message ,  "error" );

        }           
    })
}