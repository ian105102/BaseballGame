import { IScene } from "./IScene.js";
import { SceneEnum } from "../SceneEnum.js";
import { SceneManager } from "../SceneManager.js";

import { WIDTH } from "../G.js";
import { HEIGHT } from "../G.js";
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js";
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js";
import { SoundManager } from "../AudioController/SoundManager.js";
import { PoseTracker } from "../PoseTracker.js";


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

    this.video = PoseTracker.getInstance(this.p).video;
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
    const p = this.p;
    this.ribbons = [];
    this.ribbonColors = ['#e63946', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];

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
    p.cursor(this.isMouseOverMask() ? p.HAND : p.ARROW);
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
  OnStart() { 
    this.needVideo = true;
  }

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