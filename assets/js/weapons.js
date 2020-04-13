var can_shoot_bullet = true
var Bullets = []
class Bullet {
    constructor(x,y, destination_x, destination_y, player){
        this.x = x
        this.y = y
        this.destination_x =  destination_x
        this.destination_y = destination_y
        
        this.dx = (this.destination_x - this.x)
        this.dy = (this.destination_y - this.y)
        this.mag = (Math.sqrt(this.dx*this.dx+this.dy*this.dy))
        this.player = player
        this.speed=18
        
        this.velocity_x = (this.dx/this.mag)*this.speed
        this.velocity_y = (this.dy/this.mag)*this.speed
        this.radius = 10
        this.color="red"
        this.reload_time = 400
        Bullets.push(this)
    }
    update(){
        this.color=Player.find(this.player).color
        ctx.beginPath();
        ctx.fillStyle=this.color
        ctx.arc(this.x,this.y, this.radius, 0, Math.PI*2, false)
        ctx.fill()
        ctx.closePath();

        this.x+=this.velocity_x
        this.y +=this.velocity_y
       
    }
}
var can_shot_circle_bullet = true
var CircleBullets = []
class CircleBullet {
    constructor(x,y,destination_x, destination_y,player){
        this.x = x
        this.y = y
        this.destination_x = destination_x
        this.destination_y = destination_y
        this.speed = 8
        this.dx = (this.destination_x - this.x)
        this.dy = (this.destination_y - this.y)
        this.mag = (Math.sqrt(this.dx*this.dx+this.dy*this.dy))
        this.childrens = []
        this.childrens_number = 8
        this.player = player
        this.state = "big"
        this.color = "red"
        this.velocity_x = (this.dx/this.mag)*this.speed
        this.velocity_y = (this.dy/this.mag)*this.speed
        this.radius = 20
        this.childrens_radius = 15
        this.childrens_speed = 12

        this.reload_time = 1600
        CircleBullets.push(this)
    }

    update(){
        this.color=Player.find(this.player).color
        if (this.state=="big"){

            ctx.beginPath();
            ctx.fillStyle=this.color
            ctx.strokeSyle = "red"
            ctx.arc(this.x,this.y, this.radius, 0, Math.PI*2, false)
            ctx.stroke()
            ctx.fill()
            ctx.closePath();

            this.x += this.velocity_x
            this.y += this.velocity_y

            //transition
            if ((this.x>=this.destination_x-this.radius && this.x <=this.destination_x+this.radius ) && (this.y>=this.destination_y-this.radius && this.y <=this.destination_y+this.radius )){
                this.create_childrens()
                this.state = "many"
            }
        }else if (this.state=="many"){
            this.childrens.forEach((child)=>{
                ctx.beginPath();
                ctx.fillStyle=this.color
                ctx.strokeSyle = "red"
                ctx.arc(child.x,child.y, this.childrens_radius, 0, Math.PI*2, false)
                ctx.stroke()
                ctx.fill()
                ctx.closePath();

                child.x += child.velocity_x
                child.y += child.velocity_y
            })
            
             
        }
    }
    create_childrens(){
        for (var i=0; i<this.childrens_number; i++){ 
            this.childrens.push(
                {
                    x:this.x + this.radius*(Math.cos( ((Math.PI*2)/this.childrens_number)*(i+1))), 
                    y:this.y + this.radius*(Math.sin( ((Math.PI*2)/this.childrens_number)*(i+1)))
                }
            )
        }
        this.childrens.forEach((child)=>{
            var dx = (child.x - this.x)
            var dy = (child.y - this.y)
            var mag = (Math.sqrt(dx*dx+dy*dy))
            child.velocity_x = (dx/mag)*this.childrens_speed
            child.velocity_y = (dy/mag)*this.childrens_speed
        })
    }
}
