"use strict"

import billard_utils, {Ball} from './billard_utils.js';

let game_status = 'not started'

let canvas = document.querySelector("canvas");

if(typeof online_mode === 'undefined')
    canvas.style.visibility = "visible"

let ctx = canvas.getContext("2d");
let ball_moving = false;

let balls = billard_utils.initTable(ctx)
let white = balls[0]

function updateCanvas() {
    billard_utils.paintGameArea()
    billard_utils.drawHoles()
    balls.forEach(ball => {if(ball) billard_utils.drawBall(ball)})
    balls.forEach(ball => {if(ball) checkEdge(ball)})
    checkCollisions();
}

function letBallDrop(b){
    for( var i = 0; i < balls.length; i++){
        if ( balls[i].value == b.value) {
//            delete balls[i]
        }
    }
}

function checkEdge(b)
{

    let dist = Ball.R*2.5;
    if((b.x + dist) >= (billard_utils.width-billard_utils.TABLE_EDGE)) {
        if((b.y <= billard_utils.TABLE_EDGE*2) || (b.y >= billard_utils.height - billard_utils.TABLE_EDGE*2))
        {
            letBallDrop(b)
            return;
        }
        b.dx*=-1;        
    }else if((b.x - dist) <= (billard_utils.TABLE_EDGE)){
        if((b.y <= billard_utils.TABLE_EDGE*2) || (b.y >= billard_utils.height - billard_utils.TABLE_EDGE*2))
        {
            letBallDrop(b)
            return;
        }
        b.dx*=-1;        
    }else if((b.y + dist) >= (billard_utils.height-billard_utils.TABLE_EDGE)){
        b.dy*=-1;
    }else if((b.y - dist) <= (billard_utils.TABLE_EDGE))
    {
        b.dy*=-1;
    }else{}

    moveOneStep(b)
}

function moveOneStep(b)
{
    b.x+= b.dx;
    b.y+= b.dy;
}


function checkCollisions()
{
    let length = game_status == 'not_started' ? 1:balls.length-1;

    for(let i=0; i < length; i++)
    {
        for(let j=i+1; j < balls.length; j++)
        {
            if(balls[i] && balls[j])
                calcCollision(balls[i], balls[j]);
        }
    }
}

function calcCollision(b1, b2)
{
    let dx = b1.x - b2.x;
    let dy = b1.y - b2.y;
    let rsum = b1.r + b2.r;

    if((dx*dx + dy*dy) <= rsum*rsum){
        handleCollision(b1,b2)
    }
}

function handleCollision(b1, b2)
{
    let x1 = b1.x, y1 = b1.y;
    let x2 = b2.x, y2 = b2.y;

    y1 = b1.y > b2.y ? 1 : -1;
    y2 = b2.y > b1.y ? 1 : -1;

    x1= b1.x > b2.x ? 1 : -1;
    x2= b2.x > b1.x ? 1 : -1;

    b1.dx= x1;
    b1.dy= y1;
    b2.dx= x2;
    b2.dy= y2;

    game_status = 'started'
}

canvas.addEventListener('mousemove', function(evt) {
    if(!ball_moving){
        drawCUe(evt)
    }
});

function drawCUe(evt)
{
    updateCanvas()
    let white = balls[0]
    if((evt.clientX > white.x -200 && evt.clientX < white.x + 200 )
    && (event.clientY > white.y - 200 && evt.clientY < white.y + 200))
    {
        ctx.fillStyle = "white";
        ctx.moveTo(evt.clientX, evt.clientY);
        ctx.lineTo(white.x, white.y);
        ctx.moveTo(evt.clientX+5, evt.clientY+5);
        ctx.lineTo(white.x+2, white.y+2);
        ctx.stroke();
     }
}

function getKlickPosition(canvas, event) {

    let ACC_FACTOR = 0.05;

    if(ball_moving)
        return;

    let rect = canvas.getBoundingClientRect(); 
    let x = event.clientX - rect.left; 
    let y = event.clientY - rect.top; 

    white = balls[0]
    if((x > white.x -200 && x < white.x + 200 )
    && (y > white.y - 200 && y < white.y + 200))
    { 
        let dx = Math.abs(x - white.x)
        let dy = Math.abs(y - white.y)
        if(x < white.x)
        {
            white.dx = dx*ACC_FACTOR;
        }
        else{
            white.dx = -dx*ACC_FACTOR;
        }

        if(y < white.x)
        {
            white.dy = dy*ACC_FACTOR;
        }else{
            white.dy = -dy*ACC_FACTOR;
        }
        
        ball_moving = true;

        if(typeof online_mode != 'undefined')
            socket.emit("move", white);
        else
           setInterval(updateCanvas, 10);
     }

}

if(typeof socket !== 'undefined'){
    socket.on('move', response => {
    //    alert("move ");
        balls[0] = response;
        setInterval(updateCanvas, 10);    
    })
}

canvas.addEventListener("mousedown", function(e) 
{ 
    getKlickPosition(canvas, e); 
}); 

