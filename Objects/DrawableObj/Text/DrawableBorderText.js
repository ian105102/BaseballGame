import { IObject } from "../../IObject.js";


export class DrawableBorderText extends IObject {
    constructor(p, text, text_size, font = null, stroke_color = '#000', fill_color = '#fff') {
        super(p);
        this.text = text;
        this.text_size = text_size;
        this.font = font; // 可傳入字體
        this.stroke_color = stroke_color;
        this.fill_color = fill_color;
        this.strokeWeight = 20; // 邊框粗細
    }

    _on_draw() {
        this.p.push(); // 保護樣式堆疊

        this.p.textAlign(this.p.CENTER);
        this.p.textSize(this.text_size);

        if (this.font) {
            this.p.textFont(this.font);
        }

        // 邊框（描邊）
        this.p.stroke(this.stroke_color);
        this.p.strokeWeight(this.strokeWeight); // 邊框粗細
        this.p.fill(this.fill_color); // 文字填色
        this.p.text(this.text, 0, 0);

        this.p.pop();
    }

    _on_update(delta) {
        // 目前無更新邏輯
    }
}