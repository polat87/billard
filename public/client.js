'use strict';

let OFFLINE = 0, ONLINE = 1, PLAYING = 2;
let socket = io.connect();
let username = (Math.random().toFixed(6)*1000000);
let state = OFFLINE;
let loginButton = document.querySelector("#login")
let userList = [];

let online_mode = true;

let game_info;

const login = () => {
    let msg = new loginMessage("login", username);
    sendMessageToServer(msg);
}

loginButton.addEventListener("click", login)

const printSocketid = () => {console.log("SOCKET-id: " + socket.id)}
//setTimeout(printSocketid, 3000)

const userObj = (id) => {
    userList.find(obj => {
        console.log("OBJJJJ-> " + obj);
        if(obj.id == id){
            return obj;
        }
    })
}


const logout = () => {
    console.log("LOGOUT:...")
    let msg = new logoutMessage("logout", username);
    sendMessageToServer(msg);
    socket.disconnect(true)
//    location.reload();

}



function loginMessage(msgType, username)
{
    this.type = msgType,
    this.username = username
}

function logoutMessage(msgType, username)
{
    this.type = msgType,
    this.username = username
}


function matchRequest(type, from, to)
{
    this.type = type,
    this.from = from,
    this.to = to
}

function MatchResponse(type, username, opponent, accept)
{
    this.type = type,
    this.from = username,
    this.to = opponent,
    this.accept = accept
}

const sendMessageToServer = (msg) => {
//    console.log(JSON.stringify(msg)); 
    socket.emit(msg.type, JSON.stringify(msg));
}

socket.on('login', state => {
    let obj = JSON.parse(state);

    console.log("LOGIN...")

    let btn = document.querySelector("#login");
    btn.id = '#logout';
    btn.innerText = 'logout';
    btn.removeEventListener('click', login)
    btn.addEventListener('click', logout)

    if(obj.state == ONLINE)
    {
        console.log("STATE-> " + obj.state)
        if(obj.username == username)
        {
            state = ONLINE;
        }

        showUserList();
    }

})

socket.on('userlist', list => {
    userList = JSON.parse(list);
    console.log("USERLIST: " + list)

//    if(state == ONLINE)
        showUserList();

})

socket.on('match-request', request => {
    let req = JSON.parse(request);

    let answer = confirm(req.from + " wants to play with you. Do you accept?")

    if(answer == true)
    {
        let cvs = document.querySelector("canvas");
        cvs.style.visibility = "visible"
    }
    
    let resp = new MatchResponse("match-response", req.to, req.from, answer)

    socket.emit(resp.type, JSON.stringify(resp));

})

socket.on('match-response', response => {
    let res = JSON.parse(response);
    
    if(res.accept == true){
        let cvs = document.querySelector("canvas");
        cvs.style.visibility = "visible"
    }
    else
    alert("player said no to challenge")
    
/*     let resp = new MatchResponse("match-response", res.to, res.from, answer)

    socket.emit(resp.type, JSON.stringify(msg));
 */
})


const showUserList = () => {
    let list_node = document.querySelector("#list");
    let body = document.querySelector('tbody')

    if(body)
        body.parentNode.removeChild(body)

    let table = document.createElement("table");
    table.createTHead();
    let tbody = table.createTBody();

    let i =0;
    userList.forEach(function(user)
    {
        let row = document.createElement("tr");
        let name = document.createElement("td");  
        let state = document.createElement("td");        
        name.innerText = user.username;
        row.appendChild(name);

        if(user.state == ONLINE && user.username != username)
        {
            let button = document.createElement('button');
            button.innerText = 'play';
            button.id = user.username;
            button.addEventListener("click", challenge);
            row.appendChild(button);
        }
        i++;
        tbody.appendChild(row);
    });    
    table.appendChild(tbody);
    list_node.appendChild(table);
}

const challenge = (event) => {
    let opponent = event.currentTarget.getAttribute("id");
    let req = new matchRequest("match-request", username, opponent);
    console.log(req)    
    sendMessageToServer(req)
}

function move(username, x, y) {
    this.username = username;
    this.type = type;
    this.x = x;
    this.y = y;
}
