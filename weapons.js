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
        Bullets.push(this)
    }
    update(){  
        ctx.beginPath();
        ctx.fillStyle="red"
        ctx.arc(this.x,this.y, this.radius, 0, Math.PI*2, false)
        ctx.fill()
        ctx.closePath();

        this.x+=this.velocity_x
        this.y +=this.velocity_y
    }
}