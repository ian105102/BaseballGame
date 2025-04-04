import {IObject} from "../../IObject.js"

export class Circle extends IObject{
    
    constructor(p){
        super(p)
        this.radius = 20;
    }
    _on_draw (){
        this.p.fill("rgb(60, 131, 154)");
        this.p.ellipse(0, 0, this.radius, this.radius);
    }
    _on_update(){

    }
}
