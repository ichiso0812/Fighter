var Players = []
class Player {
    constructor(x, y, name){
        this.x = x
        this.y = y
        this.radius=22
        this.name = name
        this.speed=8
        this.life=2
        this.color="red"
        Players.push(this)
    }
    update(){
        if (this.life > 0){
            this.draw()
            this.coll_bullet()
            this.coll_circle_bullet()
        } else {
            socket.emit("end_round", {looser:this.name})
            Players.forEach((_player, index)=>{
                if (_player.name==this.name){
                    var winner_index = index== 0 ? 1 : 0
                    kills[Players[winner_index].name] +=1

                    Players.splice(index, 1)
                    Players.push(this)
                    this.life = 2
                    Bullets = []
                    CircleBullets = []
                    $("#game_chat").append("<p>La ball'z "+this.name+" n'a pas été à la hauteur !</p>")
                    game_state = "new_round"
                }
            })
        }
    }
    draw(){
        ctx.beginPath();
        ctx.fillStyle=this.color
        ctx.shadowBlur = 20
        ctx.strokeStyle = "red"
        ctx.arc(this.x,this.y, this.radius, 0, Math.PI*2, false)
        ctx.fill()
        if (this.life==1){
            ctx.lineWidth = 2
            ctx.stroke()
            ctx.lineWidth = 1
        }
        ctx.shadowBlur = 0
        ctx.closePath();
        ctx.fillStyle = "black"
        ctx.font = "30px Noto Serif"
        ctx.fillText(this.life, this.x-8, this.y+9)
    }
    //COLLISIONS
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
    coll_circle_bullet(){
        CircleBullets.forEach((circle_bullet, index)=>{
            if (circle_bullet.player != this.name){
                if (circle_bullet.state == "big"){
                    var d2 = (circle_bullet.x-this.x)*(circle_bullet.x-this.x) + (circle_bullet.y - this.y)*(circle_bullet.y - this.y)
                    if (d2 <= (circle_bullet.radius + this.radius)*(circle_bullet.radius + this.radius)){
                        delete CircleBullets[index]
                        this.life -=1;
                    }
                }else {
                    circle_bullet.childrens.forEach((bullet_child, index)=>{
                        var d2 = (bullet_child.x-this.x)*(bullet_child.x-this.x) + (bullet_child.y - this.y)*(bullet_child.y - this.y)
                        if (d2 <= (circle_bullet.childrens_radius + this.radius)*(circle_bullet.childrens_radius + this.radius)){
                            delete circle_bullet.childrens[index]
                            this.life -=1;
                        }
                    })
                }
            }
        })
    }

    //STATIC
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