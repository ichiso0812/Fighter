var Players = []
class Player {
    constructor(x, y, name){
        this.x = x
        this.y = y
        this.radius=20
        this.name = name
        this.speed=10
        this.life=1
        Players.push(this)
    }
    update(){
        if (this.life >= 0){
            this.draw()
            this.coll_bullet()
        } else {
            SocketIO.emit("end_round", {looser:this.name})
        }
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle="red"
        ctx.strokeStyle = "white"
        ctx.arc(this.x,this.y, this.radius, 0, Math.PI*2, false)
        ctx.fill()
        if (this.life==1){
            ctx.stroke()
        }
        ctx.closePath();
    }
    coll_bullet(){
        Bullets.forEach((bullet,index)=>{
            if (bullet.player!=this.name) {
                var d2 = (bullet.x-this.x)*(bullet.x-this.x) + (bullet.y - this.y)*(bullet.y - this.y)
                if (d2 <= (bullet.radius + this.radius)*(bullet.radius + this.radius)){
                    delete Bullets[index]
                    this.life -=1;
                }
            }
            
        })  
        
    }
    static find(pseudo){
        var result = ""
        Players.forEach(function(player){
            if (player.name==pseudo){
                result = player
            }
        })
        return result
    }
}
