var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ejs = require("ejs")
var session = require("cookie-session")
var bodyParser = require("body-parser")
var urlEncodedParser = bodyParser.urlencoded({extended: false})
app.use(express.static('assets'))
app.use(session({secret:"monsecret"}))

var rooms = {}
var players = []

app.use(function(req, res, next){
    if (typeof(req.session.pseudo)=="undefined"){
        req.session.pseudo = ""
    }
    next()
})

app.get('/', function(req, res) {
    res.render("../index.ejs", {rooms: rooms, pseudo: req.session.pseudo});
});

app.post("/add-player/:pseudo", function(req, res){
    var already_exist = false
    players.forEach(function(player){
        if (player==req.params.pseudo){
            already_exist = true
        }
    })
    if (already_exist){
        res.send("already_exist")
    }else {
        players.push(req.params.pseudo)
        req.session.pseudo = req.params.pseudo
        res.send("success")
    }
})

app.get("/get_rooms", function(req, res){
    
    res.json(Object.keys(rooms))
})

app.post("/create-room/:room_name", function(req, res) {
    if (req.params.room_name!=""){
        if (typeof rooms[req.params.room_name] == "undefined"){
            rooms[req.params.room_name] = {}
            res.send("success")
        }else {
            res.send("already_exist")
        }
        
    }else {
        res.send("empty_string")
    }
    
})
app.get('/quit-room', function(req, res){
    res.redirect("/")
})

io.sockets.on('connection', function(socket) {
    //join room
    var room = {
        name: socket.handshake.query.room_name,
        pseudo: ""
    }
    socket.join(room.name)
    socket.on("add_player", function(data){
        if (typeof rooms[room.name]["players"] =="undefined")
            rooms[room.name]["players"] = [[data.pseudo, socket.id]]
        else {
            rooms[room.name]["players"].push([data.pseudo, socket.id])
        }
        //send to the new player
        socket.emit("add_players_new_connected", rooms[room.name]["players"])
        //send to all other players
        socket.to(room.name).emit("add_player", data.pseudo)
        console.log(rooms)
    })

    socket.on("delete_player_from_room", function(pseudo){
        if (rooms[room.name]){
            rooms[room.name]["players"].forEach(function(player, index){
                if (player[0]==pseudo.toString()){
                     rooms[room.name]["players"].splice(index,1)
                }
            })
            socket.to(room.name).emit("remove_player", pseudo)
            console.log(rooms)
            socket.disconnect()
        }
       
    })
    

    socket.on("player_pos", function(data){
        socket.to(room.name).emit("player_pos", data)
    })
    socket.on("shoot", function(data){
        socket.to(room.name).emit("shoot", data)
    })
    socket.on("circle_shot", function(data){
        socket.to(room.name).emit("circle_shot", data)
    })

    socket.on("end_round", function(data){
        var tmp = [rooms[room.name]["players"][0][0], rooms[room.name]["players"][1][0]]
        
        tmp.forEach(function(player, index){
            if (player==data.looser){
                rooms[room.name]["players"][index].splice(index,1)
                rooms[room.name]["players"].push([player, socket])
            }
        })
        
    })
    socket.on("disconnect", function(data){
        if (rooms[room.name]){
            rooms[room.name]["players"].forEach(function(player, index){
                if (player[1]==socket.id){
                    rooms[room.name]["players"].splice(index, 1)
                    socket.to(room.name).emit("player_disconnect", player[0])
                }
            })
            if (rooms[room.name]["players"].length==0){
                delete rooms[room.name]
            }
        }
        
    })
});

//server.listen(process.env.PORT)
server.listen(8050)