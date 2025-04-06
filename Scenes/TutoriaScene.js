import { IScene } from "./IScene.js";
import { SceneEnum } from "../SceneEnum.js";
import { SceneManager } from "../SceneManager.js";

import { WIDTH } from "../G.js";
import { HEIGHT } from "../G.js";
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js";
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js";

import ReceiveArduino from "../ArduinoConnectJS.js"
    

export class TutorialScene extends IScene {
  static instance = null;

  setImages(assets) {
    this.bgGrass = assets.bgGrass;
    this.tv = assets.tv;
    this.batter = assets.batter;
    this.mask = assets.mask;
    this.jfFont = assets.jfFont;
    this.setup(); 
    return this;
  }

  constructor(p) {
    if (TutorialScene.instance) return TutorialScene.instance;
    super(p);
    this.needVideo = true;
    this.video;
    this.myCamera;
    this.textObjects = [];
    this.maskHoverOffset = 0;
    this.backHoverOffset = 0;
    TutorialScene.instance = this;
    this.init();
  }

  setup() {
    const p = this.p;
    if (this.jfFont) {
      let title = new DrawableText(p, "教學介面", 50, this.jfFont);
      title.position.x = 80;
      title.position.y = HEIGHT / 9;
      title.strokeWeight = 4;
      title.strokeColor = p.color(255);
      title.fillColor = p.color(0);
      this.textObjects.push(title);

      let rule = new DrawableText(p,
        "請站在攝影機前方。\n你將進行一局進攻。\n\n若三顆好球都未成功揮棒，\n將算作一次出局。\n\n三次出局，遊戲結束！\n盡量揮棒擊中球，挑戰高分吧！",
        28,
        this.jfFont
      );
      rule.position.x = WIDTH / 2 - 150;
      rule.position.y = HEIGHT / 2 + 80;
      rule.strokeWeight = 3;
      rule.strokeColor = p.color(255);
      rule.fillColor = p.color(0);
      this.textObjects.push(rule);
    }
  }

  init() {
    // ⛳️ Button
    let func = () => {
      SceneManager.instance.changeScene(SceneEnum.MENU);
    };
    this.ribbons = []; // 儲存所有彩帶
    this.ribbonColors = ['#e63946', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];

    this.video = this.p.createCapture(this.p.VIDEO).size(WIDTH, HEIGHT).hide();
    this.myCamera = new Camera(this.video.elt, {
      onFrame: async () => {
        if (!this.needVideo) return;
      },
      width: WIDTH,
      height: HEIGHT,
    }).start();

    this.correctionTime = 5*60; // 秒數*幀數
    this.countdownText = null;
    this.hintText = null;
  }

  draw() {
    const p = this.p;

    if (!this.bgGrass || !this.tv) {
      console.log("\u26D4 \u80CC\u666F\u5716\u6216\u96FB\u8996\u5716\u672A\u8F09\u5165\uFF01");
      return;
    }

    const hoveringMask = this.isMouseOverMask();
    this.maskHoverOffset = p.lerp(this.maskHoverOffset, hoveringMask ? -20 : 0, 0.1);

    p.imageMode(p.CORNER);
    p.background(255);
    p.image(this.bgGrass, 0, 0, p.width, p.height);

    const tvWidth = 512;
    const tvHeight = 512;
    const tvX = (WIDTH - tvWidth) / 2 ;
    const tvY = -40;

    const batterX = tvX - 260;
    const batterY = tvY + 145;
    const maskX = tvX + 500;
    const maskY = tvY + 400 + this.maskHoverOffset;

    p.image(this.tv, tvX, tvY, tvWidth, tvHeight);
    p.image(this.batter, batterX, batterY, 300, 525);
    p.image(this.mask, maskX, maskY, 300, 300);

    // 顯示文字物件
    for (let obj of this.textObjects) {
      if (obj.strokeWeight && obj.strokeColor) {
        p.push();
        p.textFont(obj.font);
        p.textSize(obj.text_size);
        p.stroke(obj.strokeColor);
        p.strokeWeight(obj.strokeWeight);
        p.fill(obj.fillColor || 0);
        p.textAlign(p.LEFT);
        p.text(obj.text, obj.position.x, obj.position.y);
        p.pop();
      } else {
        obj.draw();
      }
    }

    if (this.video) {
      const videoX = tvX + (tvWidth - 270) / 2;
      const videoY = tvY + (tvHeight - 180) / 2 - 52;
      p.image(this.video, videoX, videoY, 270, 180);
    }

    this.updateRibbons();
    this.drawRibbons(p);
  
    // 指標樣式
    p.cursor(hoveringMask ? p.HAND : p.ARROW);


    // 校準球棒角度
    console.log("euler: ", ReceiveArduino.euler[2], ", ", ReceiveArduino.euler[0], ", ", ReceiveArduino.euler[1]);
    if(this.correctionTime % 60 == 0 & ReceiveArduino.arduinoConnected){
      // 先移除舊的文字
      if (this.countdownText) {
        this.remove(this.countdownText);
      }
      let text;
      if(this.correctionTime <= 0){
        ReceiveArduino.correctionQurt = ReceiveArduino.quat;
        ReceiveArduino.correctionEuler = ReceiveArduino.euler;
        ReceiveArduino.correctionAcceleration = ReceiveArduino.acceleration;
        text = new DrawableText(this.p, "完成校正！", 50);
      } else {
        text = new DrawableText(this.p, "校正倒數：" + String(this.correctionTime/60), 40);
      }
      text.position.x = WIDTH / 2;
      text.position.y = HEIGHT / 2;
      text.font = this.iansuiFont; // ✅ 套用 Iansui 字體
      this.add(text);
      // 記住這個文字
      this.countdownText = text;
    }


    let correctionText;
    if(ReceiveArduino.arduinoConnected){
      this.correctionTime--;
      correctionText = new DrawableText(this.p, "將球棒直立以校正角度\n並請勿大幅度晃動", 50);
    } else {
      correctionText = new DrawableText(this.p, "Arduino連接中...", 50);
    }
    this.remove(this.hintText);
    correctionText.position.x = WIDTH / 2;
    correctionText.position.y = HEIGHT*0.7;
    correctionText.font = this.iansuiFont; // ✅ 套用 Iansui 字體
    this.add(correctionText);
    this.hintText = correctionText;
  
    super.draw();
  }

  isMouseOverMask() {
    const p = this.p;
    const tvX = (WIDTH - 512) / 2;
    const maskX = tvX + 500;
    const maskY = -50 + 400 + this.maskHoverOffset;
    const inBounds = p.mouseX > maskX && p.mouseX < maskX + 300 &&
                     p.mouseY > maskY && p.mouseY < maskY + 300;
    if (!inBounds) return false;
    const relX = p.int(p.map(p.mouseX, maskX, maskX + 300, 0, this.mask.width));
    const relY = p.int(p.map(p.mouseY, maskY, maskY + 300, 0, this.mask.height));
    const c = this.mask.get(relX, relY);
    return c[3] > 10;
  }

  mousePressed() {
    if (this.isMouseOverMask()) {
      SceneManager.instance.changeScene(SceneEnum.MENU);
    }
  }

  OnStop() { this.needVideo = false; }
  OnStart() { this.needVideo = true; }

  updateRibbons() {
    const tvX = (WIDTH - 512) / 2;
    if (this.p.frameCount % 25 === 0) {
      let x;
      do { x = this.p.random(WIDTH); } while (x < tvX + 512);
      this.ribbons.push({
        x,
        y: -20,
        vy: this.p.random(1, 2),
        sway: this.p.random(0.5, 1),
        angle: this.p.random(this.p.TWO_PI),
        color: this.p.random(this.ribbonColors),
      });
    }
    for (let r of this.ribbons) {
      r.y += r.vy;
      r.angle += 0.1;
      r.x += Math.sin(r.angle) * r.sway;
    }
    this.ribbons = this.ribbons.filter(r => r.y < HEIGHT / 2);
  }

  drawRibbons(p) {
    p.push();
    p.noStroke();
    for (let r of this.ribbons) {
      p.fill(r.color);
      p.push();
      p.translate(r.x, r.y);
      p.rotate(Math.sin(r.angle) * 0.5);
      p.beginShape();
      p.curveVertex(-6, -12); p.curveVertex(0, -6);
      p.curveVertex(6, 0); p.curveVertex(0, 6);
      p.curveVertex(-6, 12); p.curveVertex(-12, 6);
      p.curveVertex(-6, -12);
      p.endShape(p.CLOSE);
      p.pop();
    }
    p.pop();
  }
}