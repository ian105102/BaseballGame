import { IObject } from "../../IObject";

export class Character extends IObject{
    constructor(p, centerx, centery){
        super(p);
        this.p = p;

        this.hands = new hands(centerx, centery);
        
    }

    setPosition(x, y) {
    
        this.position.x = x;
        this.position.y = y;
        this.hands.setPosition(x, y);
    }
    drawBody(){
     
        this.p.fill(255, 0, 0);
        this.p.ellipse(0 , 0, 90, 90);
    }


    _on_draw(){
        this.hands.display();
        this.drawBody();
    
    }
    _on_update(delta){
    
    }

}