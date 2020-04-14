//choose pseudo
$(".choose_pseudo_submit").click(function(e){
    $.post(
        "/add-player/"+$("#_pseudo").val(),
        JSON.stringify({pseudo: $("#_pseudo").val()}),
        function(data){
            if (data=="success"){
                $("#choose_pseudo").hide();
                $("#rooms_list").show()
                pseudo = $("#_pseudo").val()
            }else if (data="already_exist"){
                $("#choose_pseudo").append("<p>Ce pseudo existe déja</p>")
            }
        }, 
        "text"
    )
})
//create room
$("#submit_new_room").click(function(){
    $.post(
        "/create-room/"+$("#room_name_input").val().replace(" ", "_"),
        {room_name: $("#room_name_input").val().replace(" ", "_")},
        function(data){
            if (data=="success"){
                room_name = $("#room_name_input").val()
                initialize()
                
            }else if (data=="already_exist"){
                $("#submit_new_room").after("<p>La room existe déja !</p>")
            }else if (data=="empty_string"){
                $("#submit_new_room").after("<p>Rentre une valeur, voyons !</p>")
            }
        },
        "text"
    )
})
//refresh and join room
$("#refresh").click(function(e){
    $.get(
        "/get_rooms",
        JSON.stringify({}),
        function(data){
            $(".list_room").html("")
            data.forEach(function(_room){
                $(".list_room").append("<div class='room'><div><h2>"+_room.replace("_", " ")+"</h2></div><div><button class='cta join_room' id='join_room_"+_room.replace("_", " ")+"' data-name='"+_room.replace("_", " ")+"'>Rejoindre</button></div></div>")
                $("#join_room_"+_room).click(function(){
                    room_name = $(this).attr("data-name")
                    initialize()
                })
            })
            
        },
        "json"
    )
});
$(".join_room").click(function(){
    room_name = $(this).attr("data-name")
    initialize()
})