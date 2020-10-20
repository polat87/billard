"Use strict"

const OFFLINE = 0, ONLINE = 1, PLAYING = 2;
const express = require("express")
let expressServer = express();
expressServer.use(express.static('public'));

let userList = [];

function userState(username, socket_id, state){
    this.username = username,
    this.socket_id = socket_id,
    this.state = state
}

function loginState(username, state, userList){
    this.username = username,
    this.state = state
}

function matchRequest(type, username, opponent)
{
    this.type = type,
    this.from = username,
    this.to = opponent
}

function matchRespone(type, username, opponent)
{
    this.type = type,
    this.from = username,
    this.to = opponent
}

function getSocketOfUser(id)
{
    for(let i=0; i < userList.length; i++)
    {
        if(userList[i].username == id)
        return userList[i].socket_id;        
    }
}


// HTTP
const http = require('http');
let httpServer = http.Server(expressServer);

// WEBSOCKETS
const socketIo = require('socket.io');
let io = socketIo(httpServer);

 // Wird bei Verbindungsversuch gefeuert
io.on('connect', socket => {
    console.log("SERVER-SOCKET: " + socket.id);

    socket.on('login', data => {
        let username = JSON.parse(data).username;

        if(!JSON.stringify(userList).includes(username))
        {
            let us = new userState(username, socket.id, ONLINE);
            userList.push(us);
            console.log("USERLIST added -> " + JSON.stringify(us))
            console.log(userList);
            io.to(socket.id).emit('login', JSON.stringify(new loginState(username, ONLINE)))
            io.emit('userlist', JSON.stringify(userList))  
        }
    })

      socket.on('match-request', data => {
        let msg = JSON.parse(data);

        const socket_to = getSocketOfUser(msg.to)

        io.to(socket_to).emit('match-request', data);

    }) 

    socket.on('match-response', data => {

        let msg = JSON.parse(data);

        io.to(getSocketOfUser(msg.to)).emit('match-response', data);        

    }) 

    socket.on('move', data => {
        io.emit('move', data);
    })


})


httpServer.listen(80, err => console.log(err || 'Billard-Server is running'));
