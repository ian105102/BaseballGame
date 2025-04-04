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
        let dot_radius = 5
        let dot_spacing = 15

        const drawDots = (label, count, max, y) => {
            p.text(label, x, y)
            for (let i = 0; i < max; i++) {
                if (i < count) {
                    p.fill(0) 
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
        drawDots("S", this.s_count, 3, y)
        y += spacing
        drawDots("B", this.b_count, 4, y)
        y += spacing
        drawDots("O", this.o_count, 3, y)
        p.text(`分數: ${this.score}`, x, y+30)
        p.pop()
    }

    _on_update(delta) {

    }
}
