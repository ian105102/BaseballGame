import { IObject } from "../../IObject.js";


export class DrawableText extends IObject{



    constructor(p,text,text_size){
        super(p)
        this.text = text
        this.text_size = text_size
        
    }

    _on_draw(){
        this.p.strokeWeight(1)
        this.p.textAlign(this.p.CENTER);
        this.p.textSize(this.text_size);
        this.p.text(this.text, 0, 0);

    }

    _on_update(delta){
        
    }
}