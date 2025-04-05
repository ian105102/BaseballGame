import { IObject } from "../../IObject.js";


export class DrawableText extends IObject {
    constructor(p, text, text_size, font = null) {
        super(p);
        this.text = text;
        this.text_size = text_size;
        this.font = font; // 新增字體參數
    }

    _on_draw() {
        this.p.push(); // 保護繪圖狀態

        this.p.strokeWeight(1);
        this.p.textAlign(this.p.LEFT);
        this.p.textSize(this.text_size);

        if (this.font) {
            this.p.textFont(this.font); // 套用字體
        }

        this.p.text(this.text, 0, 0);

        this.p.pop(); // 還原狀態
    }

    _on_update(delta) {
        // 尚未使用
    }
}