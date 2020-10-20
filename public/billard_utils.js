"use strict"

const billard_utils = {
    AREA_WIDTH: 2240/2,
    AREA_HEIGHT: 1120/2,
    TABLE_EDGE: 75,
    get width(){return this.AREA_WIDTH + this.TABLE_EDGE*2},
    get height(){return this.AREA_HEIGHT + this.TABLE_EDGE*2},
    ball_colors: ['white','yellow', 'blue', 'red', 'purple','orange', 'green','#800020', 'black',
                 'yellow', 'blue', 'red', 'purple','orange', 'green','#800020'],
    ctx: null,

    Ball:class{
        static R = 57.2 / 3;
        constructor(color, value,stripe, x, y){
            this.color= color,
            this.stripe = stripe,
            this.value = value,
            this.x = x,
            this.y = y,
            this.dx = 0,
            this.dy = 0,
            this.r= Ball.R,
            this.acc= 0,
            this.v= 0
        }
        
        static createBalls(){
            let balls = [], temp= []
            let sequence = [0,1,12,5,13,3,9,8,7,14,4,15,6,10,11,2]
            for(let i=0; i < billard_utils.ball_colors.length; i++){
                let ball; 
                if(i==0)
                    ball = new Ball(billard_utils.ball_colors[i], '', false, billard_utils.TABLE_EDGE + billard_utils.AREA_WIDTH/4, table.height/2);
                else
                    ball = new Ball(billard_utils.ball_colors[i], i, false, billard_utils.TABLE_EDGE + billard_utils.AREA_WIDTH/4*3, table.height/2);
                    
                if(i>8)
                    ball.stripe = true;

                balls[sequence.indexOf(i)] = ball
            }
            return balls;        
        }
    },
    
    initTable(ctx){
        this.ctx = ctx;
        this.ctx.canvas.width = this.width;
        this.ctx.canvas.height = this.height;

        this.ctx.fillStyle = "brown";
        this.ctx.fillRect(0, 0, this.width, this.TABLE_EDGE) // top
        
        this.ctx.fillRect(0, this.height - this.TABLE_EDGE, this.width, this.height - this.TABLE_EDGE) // bottom
        this.ctx.fillRect(0, 0, this.TABLE_EDGE, this.height) // left
        this.ctx.fillRect(this.width-this.TABLE_EDGE, 0, this.width, this.height) // right   

        this.ctx.fillStyle = "darkgreen";
        this.ctx.fillRect(this.TABLE_EDGE, this.TABLE_EDGE, this.AREA_WIDTH, this.TABLE_EDGE / 3) // top
        this.ctx.fillRect(this.TABLE_EDGE, this.TABLE_EDGE + this.AREA_HEIGHT, this.AREA_WIDTH, -this.TABLE_EDGE/3) // bottom
        this.ctx.fillRect(this.TABLE_EDGE, this.TABLE_EDGE, this.TABLE_EDGE/3, this.AREA_HEIGHT) // left
        this.ctx.fillRect(this.width-(this.TABLE_EDGE + this.TABLE_EDGE/3), this.TABLE_EDGE, this.TABLE_EDGE/3, this.AREA_HEIGHT) // right   

        this.printPoints()
        this.paintGameArea()    
        this.drawHoleEdges()
        this.drawHoles()
        return this.ballsSetup();
    },

    printPoints()
    {
        this.ctx.fillStyle = "#D3D3D3";
        this.ctx.beginPath();
        this.ctx.arc(this.TABLE_EDGE + this.AREA_WIDTH/4, this.TABLE_EDGE/3*2, 5,0,Math.PI*2); 

        this.ctx.moveTo(this.TABLE_EDGE + this.AREA_WIDTH/4*3,this.TABLE_EDGE/3*2);
        this.ctx.arc(this.TABLE_EDGE + this.AREA_WIDTH/4*3, this.TABLE_EDGE/3*2, 5,0,Math.PI*2); 
        
        this.ctx.moveTo(this.TABLE_EDGE + this.AREA_WIDTH/4, this.height - this.TABLE_EDGE/3*2);
        this.ctx.arc(this.TABLE_EDGE + this.AREA_WIDTH/4, this.height - this.TABLE_EDGE/3*2, 5,0,Math.PI*2);    
        
        this.ctx.moveTo(this.TABLE_EDGE + this.AREA_WIDTH/4*3, this.height - this.TABLE_EDGE/3*2);
        this.ctx.arc(this.TABLE_EDGE + this.AREA_WIDTH/4*3, this.height - this.TABLE_EDGE/3*2, 5,0,Math.PI*2); 
        
        this.ctx.moveTo(this.TABLE_EDGE/3*2, this.height/2);
        this.ctx.arc(this.TABLE_EDGE/3*2, this.height/2, 5,0,Math.PI*2); 
        
        this.ctx.moveTo(this.width - this.TABLE_EDGE/3*2, this.height/2);
        this.ctx.arc(this.width - this.TABLE_EDGE/3*2, this.height/2, 5,0,Math.PI*2); 

        this.ctx.fill();
    },

    drawHoleEdges(){
        // corner-length
        let c = this.TABLE_EDGE/3*4;
        this.ctx.fillStyle = "#D3D3D3";
        // top left
        this.ctx.fillRect(0, 0, c, c)
        // top middle
        this.ctx.fillRect(this.width / 2 - c/2, 0, c,c)
        // top right        
        this.ctx.fillRect(this.width - c, 0, c, c)

        // down left
        this.ctx.fillRect(0, this.height - c, c, c) // down left
        // down middle
        this.ctx.fillRect(this.width / 2 - c/2, this.height - c, c, c)
        // down right
        this.ctx.fillRect(this.width - c, this.height-c, c, c)

   },

   drawHoles(){
       this.hole(this.TABLE_EDGE/4*5, this.TABLE_EDGE/4*5, Math.PI/2,Math.PI*2);
       this.hole(this.width/2, this.TABLE_EDGE,2.6,Math.PI*2.17);        
       this.hole(this.width - this.TABLE_EDGE/4*5, this.TABLE_EDGE/4*5,Math.PI, Math.PI/2);
       this.hole(this.TABLE_EDGE/4*5, this.height - this.TABLE_EDGE/4*5, 0,Math.PI*1.5);     
       this.hole(this.width/2, this.height - this.TABLE_EDGE, 5.75,3.67);          
       this.hole(this.width - this.TABLE_EDGE/4*5, this.height - this.TABLE_EDGE/4*5,Math.PI*1.5,Math.PI);        
   },
   
   hole(x, y, b, e)
   {
       let r = this.TABLE_EDGE/3*4/2;
       this.ctx.fillStyle = "#2A363B"
       this.ctx.beginPath();   
       this.ctx.arc(x, y, r, b, e);
       this.ctx.fill();
       this.ctx.lineWidth=4;
       this.ctx.fillStyle = "#393433";
       this.ctx.stroke();    
   },

    paintGameArea(){
        this.ctx.fillStyle = "#3ab503";
        this.ctx.fillRect(this.TABLE_EDGE/3*4, this.TABLE_EDGE/3*4, this.AREA_WIDTH-this.TABLE_EDGE/3*2, this.AREA_HEIGHT-this.TABLE_EDGE/3*2);
 },

    ballsSetup()
    {
        let balls = Ball.createBalls();
        let i=1;
        let start;
        this.drawBall(balls[0])
        
        for(let r=5; r >= 1; r--)
        {
            for(let b=1; b <= r; b++)
            {                    
                billard_utils.drawBall(balls[i])                
                i++;

                if(i > balls.length-1)
                    break;

                balls[i].x = balls[i-1].x + 2*Ball.R + 1;
                balls[i].y = balls[i-1].y - Ball.R;
                
                if(b==2)
                    start = balls[i-1]
            }

            if(i > balls.length-1)
            break;

            balls[i].x = start.x;
            balls[i].y = start.y + 2*Ball.R + 1;
        }

        return balls
    },

    drawBall(b) {
        this.ctx.beginPath();
        this.ctx.arc(b.x, b.y, b.r,0,Math.PI*2);        
        this.ctx.fillStyle = b.color;
        this.ctx.fill();
 
        if(b.stripe == true){
            this.ctx.beginPath();
            this.ctx.arc(b.x, b.y, b.r, 0,Math.PI*0.6);        
            this.ctx.fillStyle = "white";
            this.ctx.fill();                 
            this.ctx.beginPath()
            this.ctx.arc(b.x, b.y, b.r,Math.PI,Math.PI*1.6);        
            this.ctx.fill();   
        }
 
        this.ctx.beginPath();
        this.ctx.arc(b.x, b.y, b.r*0.4, 0, Math.PI*2);
        this.ctx.fillStyle = "#fff";
        this.ctx.fill();
        this.ctx.font = "0.7em Verdana";
        this.ctx.fillStyle = "Black"
        if(b.value > 9)
            this.ctx.fillText(b.value, b.x-8, b.y+5);
        else
            this.ctx.fillText(b.value, b.x-4, b.y+5);
        this.ctx.strokeStyle = "#000"
        this.ctx.closePath();        
    },

    printGrid()
    {
        this.ctx.fillStyle = "Black"
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height/2);
        this.ctx.lineTo(this.width, this.height/2)
        this.ctx.moveTo(this.TABLE_EDGE + this.AREA_WIDTH/4, 0)
        this.ctx.lineTo(this.TABLE_EDGE + this.AREA_WIDTH/4, this.height)
        this.ctx.moveTo(this.TABLE_EDGE + this.AREA_WIDTH/2, 0)
        this.ctx.lineTo(this.TABLE_EDGE + this.AREA_WIDTH/2, this.height)
        this.ctx.moveTo(this.TABLE_EDGE + this.AREA_WIDTH/4*3, 0)
        this.ctx.lineTo(this.TABLE_EDGE + this.AREA_WIDTH/4*3, this.height)
        this.ctx.stroke()
    }

    
}

export const {Ball} = billard_utils;
export default billard_utils;
