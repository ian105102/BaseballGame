import { IObject } from "../../IObject.js";

export class HitPointUi extends IObject {
    constructor(p) {
        super(p)
        this.size = this.p.createVector(60, 100)
    }

    _on_draw() {
        this.p.push();

        // 繪製半透明的源（圓形）
        this.p.noStroke();
        this.p.fill("rgba(0, 217, 255, 0.34)"); // 白色，透明度 100/255
        this.p.ellipse(0, 0, this.size.x * 0.6, this.size.x * 0.6); // 根據 x 的長度畫圓

        this.p.pop();
    }

    _on_update(delta) {

    }
}