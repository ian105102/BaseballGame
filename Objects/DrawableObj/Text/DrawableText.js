import { IObject } from "../../IObject.js";

export class DrawableText extends IObject {
    constructor(p, text, text_size, font = null) {
        super(p);
        this.p = p;
        this.text = text;
        this.text_size = text_size;
        this.font = font;

        this.fillColor = p.color(0);         // 黑色填色
        this.strokeColor = p.color(255);     // 白色描邊
        this.strokeWeight = 3;               // 預設無描邊
    }

    _on_draw() {
        const p = this.p;
        p.push();

        if (this.font) {
            p.textFont(this.font);
        }

        p.textAlign(p.LEFT);
        p.textSize(this.text_size);

        // ✅ 使用樣式參數
        if (this.strokeWeight > 0) {
            p.stroke(this.strokeColor);
            p.strokeWeight(this.strokeWeight);
        } else {
            p.noStroke();
        }

        p.fill(this.fillColor);
        p.text(this.text, 0, 0);

        p.pop();
    }

    _on_update(delta) {
        // 尚未使用
    }
}
