import { IObject } from "../../IObject.js";
import { Hands } from "./BodyComponents/HandsObj.js";

export class Character extends IObject{
    constructor(p){
        super(p);
        this.p = p;
        this.position = p.createVector(0, 0);
        this.hands = new Hands(p);
        this.color = "rgb(255, 0, 0)";
        this.delay = this.p.random(0, 10000);
        this.needEye = false; // 是否需要眼睛
      
        
    }

    setPosition(x, y) {
    
        this.position.x = x;
        this.position.y = y;
        this.hands.setPosition(x, y);
    }
    drawBody() {


        // 計算身體搖擺
        const sway = this.p.sin((this.p.frameCount + this.delay) * 0.1) * 5;
        const swaX = this.p.sin((this.p.frameCount + this.delay) * 0.05) * 5;
        this.drawShadow(swaX); // 畫陰影
        this.p.push();
        this.p.noStroke();
        
        // 畫左腳
        this.p.fill(100);
        this.p.arc(-30, 50, 40, 40, this.p.PI, 0, this.p.CHORD);
    
        // 畫右腳
        this.p.fill(100);
        this.p.arc(30, 50, 40, 40, this.p.PI, 0, this.p.CHORD);
        this.p.pop();
    
        // 畫身體
        this.p.push();
        this.p.noStroke();
        this.p.fill(this.color);
        this.p.translate(swaX, sway);
        this.p.ellipse(0, -40, 100, 100);

       

            
        // ======== 畫眼睛 =========
        if (this.needEye) {
            this.drawEyes();
        }
        this.p.pop();   
    }
    drawShadow(swaX) {
        this.p.push();
        this.p.fill(0, 0, 0, 50); // 半透明黑色
        this.p.noStroke();
        this.p.ellipse(0+ swaX, 50, 120, 40); // 固定底部位置，若想高度更穩可不加 sway
        this.p.pop();
    }
    drawEyes() {
        const eyeY = -50;          // 眼睛的 y 座標
        const eyeOffsetX = 20;     // 左右眼的 x 偏移
        const isBlinking = ((this.p.frameCount +this.delay)% 180) < 10;
        
        this.p.fill(0);
    
        // 左眼
        if (isBlinking) {
            this.p.ellipse(-eyeOffsetX, eyeY, 15, 15); // 細長橢圓
        } else {
            this.p.ellipse(-eyeOffsetX, eyeY, 15, 50); // 細長橢圓
        }
    
        // 右眼
        if (isBlinking) {
            this.p.ellipse(eyeOffsetX, eyeY, 15, 15);
        } else {
            this.p.ellipse(eyeOffsetX, eyeY, 15, 50); // 細長橢圓
        }
    }
    _on_draw(){
        this.hands.draw();
        this.drawBody();    
      
      
    
    }
    _on_update(delta){
    
    }

}