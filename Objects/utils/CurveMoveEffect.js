
export class CurveMoveEffect {
    constructor( p, speed = 0.005, debug = false , loop = false ) {
        this.p = p;
        this.t = 0; // 時間參數（0~1）
        this.speed = speed; // 控制速度
        this.active = false; // 控制是否執行 update
        this.debug = debug; // 是否啟用 debug 模式
        this.callback = null;
        this.loop = loop // 是否循環
        this.points = null; // 控制點
    }
    // 設置 Catmull-Rom 曲線的控制點 , points用於設置曲線的控制點, callback用於設置運算所需 , onComplete用於設置完成後的回調函數
    do(points, callback = null , OnComplete = null , velocity = 0.005 , acc = 0.005) {
        console.log(points);
        this.points = points;
        console.log(this.points);
        this.callback = callback; // 儲存回調函數
        this.t = 0;  // 重置動畫進度
        this.active = true; 
        this.OnComplete = OnComplete;
        this.acc = acc;
        this.velocity = velocity;
    }

    update(delta) {
   
        if (!this.active) return;
        if ( this.points == null  || this.points.length < 2) {
            return;
        }
      
        let position = this.calculateCatmullRomPosition(this.points, this.t);

        if (this.debug) {
            this.draw(); // 繪製曲線
        }

        if (this.callback) {
            this.callback(position.x, position.y , this.t);
        }
        // 更新 t 值
        
        if (this.t < 1) {
            this.velocity += this.acc * delta;
            this.t += this.velocity;
        } else {
            if (this.loop) {
                console.log("loop");
                this.t = 0; // 重置 t 以循環
                this.velocity = 0;
            } else {
                this.t = 1; // 停止在最後一點
                this.velocity = 0;
                this.active = false;
            }
            if(this.OnComplete){
                console.log("onComplete");
                this.OnComplete();
                this.OnComplete = null;
            }
           
        }
    }

    // 計算 Catmull-Rom 樣條插值
    calculateCatmullRomPosition(points, t) {
        let p0, p1, p2, p3;
        let n = points.length - 1;

        let segment = Math.floor(t * n);
        let localT = (t * n) - segment; // 獲取當前區間內的局部 t 值

        p1 = points[segment];
        p2 = points[Math.min(segment + 1, n)];

        p0 = segment > 0 ? points[segment - 1] : p1;
        p3 = segment < n - 1 ? points[segment + 2] : p2;

        return this.catmullRom(p0, p1, p2, p3, localT);
    }

    // Catmull-Rom 核心計算函數
    catmullRom(p0, p1, p2, p3, t) {
        let t2 = t * t;
        let t3 = t2 * t;

        let x = 0.5 * (
            (2 * p1.x) +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
        );

        let y = 0.5 * (
            (2 * p1.y) +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
        );

        return { x, y };
    }

    draw() {
        this.p.noFill();
        this.p.stroke(100);
        this.p.strokeWeight(1);

        // 繪製 Catmull-Rom 曲線
        this.p.beginShape();
        for (let t = 0; t <= 1; t += 0.01) {
            let pos = this.calculateCatmullRomPosition(this.points, t);
            this.p.vertex(pos.x, pos.y);
        }
        this.p.endShape();

        // 繪製控制點
        this.p.fill(0);
        for (let point of this.points) {
            this.p.ellipse(point.x, point.y, 10);
        }
    }
}