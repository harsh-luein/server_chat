var express = require('express');
var app = express();
var server = require('http').createServer(app);

var io = require('socket.io').listen(server);
uniqueId = {};
username = [];
connections = [];

server.listen(process.env.PORT || 3000);

console.log("server running");

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){

     socket.on('new user', function(data,user, callback){
        callback(true);
        console.log("room ",data);
        console.log("user ",user);
        socket.join(data);
        socket.uniqueid = data;
        socket.username = user;
        username.push(socket.username);
        uniqueId[socket.uniqueid] = socket;
//        updateUniqueIds();
    });
//    console.log(uniqueId);
    connections.push(socket);
    console.log("Connected %s", connections.length);

    // Disconnect
    socket.on('disconnect', function(data){
//    if(!socket.uniqueid) return ;
    delete uniqueId[socket.uniqueid];
//    updateUniqueIds();
    username.splice(username.indexOf(socket.username),1);
    connections.splice(connections.indexOf(socket),1);
    console.log("Disconnected %s", connections.length);
    });

    //Send Message

    socket.on('send message', function(data){
        if(socket.uniqueid in uniqueId){
               console.log("true");
               console.log("uid",socket.uniqueid);
//            uniqueId[socket.uniqueid].emit('new message', {msg: data , user: socket.uniqueid});
              socket.to(socket.uniqueid).emit('new message', {msg: data , uniqueid: socket.uniqueid , user : socket.username});
        }
        else{
        console.log(data);
        io.sockets.emit('new message', {msg: data , user: socket.uniqueid});}
    });

        socket.on('send message all', function(data){
        if(socket.uniqueid in uniqueId){
               console.log("true");
               console.log("uid",socket.uniqueid);
//            uniqueId[socket.uniqueid].emit('new message', {msg: data , user: socket.uniqueid});
              io.in(socket.uniqueid).emit('new message all', {msg: data , uniqueid: socket.uniqueid , user : socket.username});
        }
        else{
        console.log(data);
        io.sockets.emit('new message', {msg: data , user: socket.uniqueid});}
    });

    // New user



//    function updateUniqueIds(){
//        io.sockets.emit('unique id', Object.key(uniqueId));
//    }
});