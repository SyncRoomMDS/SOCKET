
const express = require("express")
const app = express()
const http = require("http");
const server = http.Server(app)
const io = require("socket.io")(server, {
    cors: {
      origin: "http://172.24.232.150:8080",
      methods: ["GET", "POST"],
    }
  });

//-----------------------Gestion des variables locales
const sockets =[]
const rooms = []
//-----------------------Connexion 1 client
io.on("connect", (socket) => {

    // sockets.push(socket.id)
    // socket.on('InitSocket', function (data) {
    //     socket.data = data
    //     socket.room = rooms.rand
    // });

    console.log('a user connected');
    console.log(socket.id);

    socket.on('SEND_MESSAGE', function (data) {
        sendToAll(data.message)
        /* socket.emit('MESSAGE', {date:"22/03/2022"}) */
    });

    socket.on('START_VIDEO', function (data) {
        io.emit("PLAY-ALL",(data))
    });

    socket.on('PAUSE_VIDEO', function (data) {
        io.emit("PAUSE-ALL",(data))
    });

    socket.on('UPDATE_VIDEO', function (data) {
        socket.broadcast.emit("UPDATE-ALL",(data))
    });

})

//-----------------------Tous les clients
function sendToAll(message){
    io.emit("MESSAGE-ALL",(message))
}

console.log('server started');

//----Port d'ecoute
server.listen(8847)