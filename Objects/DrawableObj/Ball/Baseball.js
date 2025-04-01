import {IObject} from "../../IObject.js"


export class Baseball extends IObject{

    constructor(p , world , hitboxSize ){
        super(p);
 
        
        this.body = Matter.Bodies.circle(this.position.x, this.position.y, Math.max(hitboxSize.x, hitboxSize.y) / 2, {
            isStatic: false,
            isSensor: true,
        });
        Matter.World.add(world, this.body);
        
        
    }


    _on_update(delta) {
        // 更新物理位置
        Matter.Body.setPosition(this.body, {
            x: this.position.x,
            y: this.position.y 
        });
    

    }




    _on_draw(){
    
        this.p.fill(255, 0, 0);
     
        this.p.ellipse(0,0, 50, 50);
    }



}