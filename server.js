'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

  const io = socketIO(server, {
    cors: {
     // origin: "https://syncroom-app.herokuapp.com",
      origin: "localhost:8080",
      methods: ["GET", "POST"],
    }
  });

//-----------------------Gestion des variables locales
const sockets =[]
const rooms = []



//-----------------------Connexion 1 client
// io.on('connection', (socket) => {
//   console.log('Client connected');
//   socket.on('disconnect', () => console.log('Client disconnected'));
// });

io.on("connect", (socket) => {

    // sockets.push(socket.id)
    // socket.on('InitSocket', function (data) {
    //     socket.data = data
    //     socket.room = rooms.rand
    // });

    console.log('Client connected', socket.id);

    socket.on('SEND_MESSAGE', function (data) {
        sendToAll(data)
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

    socket.on('CHANGE_VIDEO', function (data) {
        io.emit("CHANGE-ALL",(data))
    });

    socket.on('disconnect', () => console.log('Client disconnected', socket.id));
})

//-----------------------Tous les clients
function sendToAll(message){
    io.emit("MESSAGE-ALL",(message))
    console.log('message : ', message)
}

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);


console.log('server started');