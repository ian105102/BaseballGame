import { IObject } from "../../IObject.js";

export class BackImage extends IObject {
    constructor(p, img) {
        super(p);
        this.size = this.p.createVector(60, 100); // 預設尺寸
        this.img = img; // 傳入的圖片
        this.isMirror = false; // 是否鏡像
    }
    _on_draw() {
        this.p.push();
    
        // 鏡像處理（使用 scale 進行座標系反轉）
        if (this.isMirror) {
            this.p.scale(-1, 1); // 左右鏡像
        }
    
        // 設定圖片模式為中心對齊
        this.p.imageMode(this.p.CENTER);
    
        // 繪製圖片（因為中心為原點，所以畫在 0, 0）
        if (this.img) {
            this.p.image(this.img, 0, 0, this.size.x, this.size.y);
        }
    
        // 描邊框（可打開用來對位）
        this.p.noFill();
        this.p.noStroke();
        this.p.rect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);
    
        this.p.pop();
    }
    _on_update(delta) {
        // 更新邏輯（如果需要）
    }


}