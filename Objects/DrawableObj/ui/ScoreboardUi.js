import { IObject } from "../../IObject.js";

export class ScoreboardUi extends IObject {
    constructor(p) {
        super(p)

        this.text_size = 25

        // S、B、O 狀態數值
        this.s_count = 0
        this.b_count = 0
        this.o_count = 0
        this.score = 0
        this.textFont = null // 預設字體為 null，表示使用 p5.js 的預設字體
    }

    // 設定 S/B/O 數值
    setCounts(s, b, o , score) {
        this.s_count = s
        this.b_count = b
        this.o_count = o
        this.score = score
    }

    _on_draw() {
        const p = this.p;


        // 初始座標與樣式參數
        const x = 50;
        let y = 50;
        const spacing = 30;
        const dot_radius = 10;
        const dot_spacing = 15;
        // 背景面板樣式
        const padding = 15;
        const row_count = 4; // S, B, O, 分數
        const bg_width = 180;
        const bg_height = row_count * spacing + 20;
        const corner_radius = 12;


        p.push();


    
        // 畫背景圓角矩形 + 邊框
        p.stroke(100);               // 邊框顏色
        p.strokeWeight(10);         // 邊框粗細
        p.fill(255, 230);           // 背景白色帶透明
        p.rect(x - padding, y - padding, bg_width, bg_height, corner_radius);

        p.pop();


        p.push();
    
        // 設定文字屬性
        if (this.textFont) {
            p.textFont(this.textFont); // 套用字體
        }
        p.textSize(this.text_size);
        p.fill(0);
        p.textAlign(p.LEFT, p.TOP);
        p.noStroke();
    

    
        // 畫點點的函式
        const drawDots = (label, count, max, y, color) => {
            p.stroke(0);
         
            p.strokeWeight(1);
            p.text(label, x, y);
            for (let i = 0; i < max; i++) {
                if (i < count) {
                    p.fill(color);
                    p.stroke(0);
                    p.strokeWeight(2);
                } else {
                    p.noFill();
                    p.stroke(150);
                    p.strokeWeight(3);
                }
                p.circle(x + 30 + i * dot_spacing, y + this.text_size / 2, dot_radius);
                p.noStroke();
                p.fill(0);
            }
        };
    
        // 繪製 S、B、O 行
        drawDots("S", this.s_count, 3, y, "rgb(27, 168, 27)");
        y += spacing;
        drawDots("B", this.b_count, 4, y, "rgb(255, 179, 0)");
        y += spacing;
        drawDots("O", this.o_count, 3, y, "rgb(214, 14, 14)");
    

        p.stroke(0);
        p.strokeWeight(1);
        // 畫分數文字
        p.text(`分數: ${this.score}`, x, y + 30);
    
        p.pop();
    }

    _on_update(delta) {

    }
}
