import { IObject } from "../../IObject.js";

export class ScoreboardUi extends IObject {
    constructor(p) {
        super(p)

        this.text_size = 20

        // S、B、O 狀態數值
        this.s_count = 0
        this.b_count = 0
        this.o_count = 0
        this.score = 0
    }

    // 設定 S/B/O 數值
    setCounts(s, b, o , score) {
        this.s_count = s
        this.b_count = b
        this.o_count = o
        this.score = score
    }

    _on_draw() {
        const p = this.p
        p.push()
  
        p.textSize(this.text_size)
        p.fill(0)
        p.textAlign(p.LEFT, p.TOP)
        p.noStroke()
        let x = 50
        let y = 50
        let spacing = 30
        let dot_radius = 10
        let dot_spacing = 15

        // 計算背景板尺寸
        let padding = 15;
        let row_count = 4; // S, B, O, 分數
        let bg_width = 180; // 可依實際內容調整
        let bg_height = row_count * spacing + 20;
        let corner_radius = 12;

        // 畫背景圓角矩形 + 邊框
        p.push();
        p.stroke(100);               // 邊框顏色
        p.strokeWeight(10);          // 邊框粗細
        p.fill(255, 230);            // 白底透明
        p.rect(x - padding, y - padding, bg_width, bg_height, corner_radius);
        p.pop();


        const drawDots = (label, count, max, y , color) => {
            p.text(label, x, y)
            for (let i = 0; i < max; i++) {
                if (i < count) {
                    p.fill(color) 
                    p.stroke(0) 
                } else {
                    p.noFill()
                    p.stroke(150) 
                }
                p.circle(x + 30 + i * dot_spacing, y + this.text_size / 2, dot_radius)
                p.noStroke()
                p.fill(0)
            }
        }

        // 畫 S、B、O 三行
        drawDots("S", this.s_count, 3, y , "rgb(27, 168, 27)")
        y += spacing
        drawDots("B", this.b_count, 4, y ,  "rgb(255, 179, 0)")
        y += spacing
        drawDots("O", this.o_count, 3, y , "rgb(214, 14, 14)")
        p.text(`分數: ${this.score}`, x, y+30)
        p.pop()
    }

    _on_update(delta) {

    }
}
