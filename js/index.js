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

function addRoom(name,id){
    var Dom =   '<div class="row p-0 mx-0 my-lg-4 my-5 "> \
                    <a class="col-12 col-lg-2 Name text-break btn btn-outline-success rounded-0" data-bs-toggle="modal" data-bs-target="#roomName" onclick="setName(this.text,'+id+')"><span class="line-clamp-3" >'+name+'</span></a>\
                    <div class="col-12 col-lg-10 row p-0 m-0 mx-auto" id="room_'+id+'">\
                        <button type="button" class="btn btn-outline-secondary col-lg-1 col-sm-2 col-3 time rounded-0" id="room_'+id+'_9" value="9" onclick="createMeeting(this.id,this.value)">09:00</button>\
                        <button type="button" class="btn btn-outline-secondary col-lg-1 col-sm-2 col-3 time rounded-0" id="room_'+id+'_10" value="10" onclick="createMeeting(this.id,this.value)">10:00</button>\
                        <button type="button" class="btn btn-outline-secondary col-lg-1 col-sm-2 col-3 time rounded-0" id="room_'+id+'_11" value="11" onclick="createMeeting(this.id,this.value)">11:00</button>\
                        <button type="button" class="btn btn-outline-secondary col-lg-1 col-sm-2 col-3 time rounded-0" id="room_'+id+'_12" value="12" onclick="createMeeting(this.id,this.value)">12:00</button>\
                        <button type="button" class="btn btn-outline-secondary col-lg-1 col-sm-2 col-3 time rounded-0" id="room_'+id+'_13" value="13" onclick="createMeeting(this.id,this.value)">13:00</button>\
                        <button type="button" class="btn btn-outline-secondary col-lg-1 col-sm-2 col-3 time rounded-0" id="room_'+id+'_14" value="14" onclick="createMeeting(this.id,this.value)">14:00</button>\
                        <button type="button" class="btn btn-outline-secondary col-lg-1 col-sm-2 col-3 time rounded-0" id="room_'+id+'_15" value="15" onclick="createMeeting(this.id,this.value)">15:00</button>\
                        <button type="button" class="btn btn-outline-secondary col-lg-1 col-sm-2 col-3 time rounded-0" id="room_'+id+'_16" value="16" onclick="createMeeting(this.id,this.value)">16:00</button>\
                        <button type="button" class="btn btn-outline-secondary col-lg-1 col-sm-2 col-3 time rounded-0" id="room_'+id+'_17" value="17" onclick="createMeeting(this.id,this.value)">17:00</button>\
                        <button type="button" class="btn btn-outline-secondary col-lg-1 col-sm-2 col-3 time rounded-0" id="room_'+id+'_18" value="18" onclick="createMeeting(this.id,this.value)">18:00</button>\
                        <button type="button" class="btn btn-outline-secondary col-lg-1 col-sm-2 col-3 time rounded-0" id="room_'+id+'_19" value="19" onclick="createMeeting(this.id,this.value)">19:00</button>\
                        <button type="button" class="btn btn-outline-secondary col-lg-1 col-sm-2 col-3 time rounded-0" id="room_'+id+'_20" value="20" onclick="createMeeting(this.id,this.value)">20:00</button>\
                    </div>\
                </div>'
    $("#end").before(Dom);
}

function info(id, value){
    $('#room_id2').attr("src","img/room_"+(value%10)+".jpg");

    $.ajax({
        url: 'https://140.118.216.40/api/meeting/' + id,
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
                
                localStorage.setItem("meeting_id", id);
                $("#meeting_name").html(meeting.name);
                $("#room_name2").html(meeting.meeting_room.name);

                $("#date").html(meeting.meeting_dates[0].date);
                $("#start_time").html(start_time+":00");
                $("#end_time").html(end_time+":00");
                $("#leader").html(meeting.user.name);
                $("#memberBox").html('<div id ="memberBoxEnd"></div>')
                
                $("#function_box").html('<button type="button" class="btn btn-secondary"  data-bs-dismiss="modal" id="close_button">close</button>');
                
                if("HI~ "+meeting.user.name == $("#userName").html()){
                    $("#close_button").before('<button type="button" class="btn btn-warning"  onclick="editMeeting()">edit</button>');
                    $("#close_button").before('<button type="button" class="btn btn-danger"  data-bs-dismiss="modal" onclick="deleteMeeting()">delete</button>');
                }
                for(var i = 0;i<members.length;i++){
                    $("#memberBoxEnd").before("<div class='btn btn-outline-secondary'>"+members[i].user.name+"</div>");
                }
            },
        }
    })
}

$('#datePicker').on('input', function() {
    localStorage.setItem("datePicker", $(this).val());
    reset($(this).val());
});

function setName(text,id){
    $('#room_name').html(text);
    $('#room_img').attr("src","img/room_"+(id%10)+".jpg");
}
function createMeeting(id,value){
    localStorage.setItem("room_id", id[5]);
    localStorage.setItem("start_time", value);
    localStorage.setItem("datePicker", $('#datePicker').val());
    window.location.href="create.html";
}

function reset(day){
    var box = document.getElementsByClassName('box');
    while(box.length>0){box[0].remove();}

    $.ajax({
        url: 'https://140.118.216.40/api/meeting?date=' + day,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "Bearer " + localStorage.getItem("token"),
        },
        statusCode: {
            200: function(responseObject, textStatus, jqXHR) {
                console.log("200");
                console.log(responseObject.data.meetings);
                
                meetings = responseObject.data.meetings;
                for(var i =0;i<meetings.length;i++ ){
                    var color_id = myMap.get(meetings[i].meeting_dates[0].time);
                    for(var j = 0;j<meetings[i].meeting_dates.length;j++){
                        var item ='#room_'+meetings[i].meeting_room.id+'_'+ myMap.get(meetings[i].meeting_dates[j].time);
                        $(item).attr("onclick", "");
                        $(item).html( $(item).html()+'<div class="box box_' + color_id + '" onclick="info(this.id, '+meetings[i].meeting_room.id+')" data-bs-toggle="modal" data-bs-target="#TimeArea" id="'+meetings[i].id+'">'+meetings[i].name+'</div>');
                    }
                }
            },
        }
    })

}

$(document).ready(function (){
    flatpickr("#datePicker", {});
    
    $.ajax({
        url: 'https://140.118.216.40/api/meeting-room',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : "Bearer " + localStorage.getItem("token"),
    },
        success: function(result){
            console.log("success");
            var rooms = result.data.meeting_rooms;
            for(var i=0;i<rooms.length;i++){ addRoom(rooms[i].name,rooms[i].id); }
        },
        error: function(result){
            console.log("error");
        },  
    })
    datePicker =localStorage.getItem("datePicker");
    $("#datePicker").val(datePicker);
    reset(datePicker);
})

function deleteMeeting(){

    swal({
        title: "Are you sure?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((value) => {
        if(value){
            var id = localStorage.getItem("meeting_id");
            $.ajax({
                url: 'https://140.118.216.40/api/meeting/' + id,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : "Bearer " + localStorage.getItem("token"),
            },
                success: function(result){
                    console.log("success");
                    reset(localStorage.getItem("datePicker"))
                },
                error: function(result){
                    console.log("error");
                    console.log(result);
                },  
            })
        }
    });
    
}

function editMeeting(){
    console.log("edit");
    window.location.href="edit.html";
}