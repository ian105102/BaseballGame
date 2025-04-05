import { IObject } from "../../IObject.js";

export class StrikeZoneUi extends IObject {
    constructor(p) {
        super(p)
        this.size = this.p.createVector(60, 100)
    }


    _on_draw() {
        this.p.push();
 
        this.p.fill(0, 0, 0 , 0);
        this.p.stroke(255, 0, 0);
        this.p.strokeWeight(2);
        this.p.rect( - this.size.x/2,  -this.size.y/2, this.size.x, this.size.y);

        this.p.pop();
    }

    _on_update(delta) {

    }
}
