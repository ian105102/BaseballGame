import { IObject } from "../../IObject.js";
import { Hands } from "./BodyComponents/HandsObj.js";

export class Character extends IObject{
    constructor(p, position){
        super(p);
        this.p = p;
        this.position = p.createVector(position.x, position.y);
        this.hands = new Hands(p);
        
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
        this.drawBody();
        this.hands.display();
      
    
    }
    _on_update(delta){
    
    }

}