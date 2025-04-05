import { IScene } from "./IScene.js";
import { SceneEnum } from "../SceneEnum.js";
import { SceneManager } from "../SceneManager.js";

import { WIDTH } from "../G.js";
import { HEIGHT } from "../G.js";
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js";
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js";

    

export class TutorialScene extends IScene {
  static instance = null;

  constructor(p) {
    if (TutorialScene.instance) {
      return TutorialScene.instance;
    }
    super(p);
    this.needVideo = true;
    this.video;
    this.myCamera;

    TutorialScene.instance = this;
    TutorialScene.instance.init();
  }

  setImages(assets) {
    this.bgGrass = assets.bgGrass;
    this.tv = assets.tv;
    this.batter = assets.batter;
    this.mask = assets.mask;
    this.iansuiFont = assets.iansuiFont;
    return this;
  }

  init() {
    // ⛳️ Button
    let func = () => {
      SceneManager.instance.changeScene(SceneEnum.MENU);
    };
    this.ribbons = []; // 儲存所有彩帶
    this.ribbonColors = ['#e63946', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
    this.maskHoverOffset = 0;
    // let go_game_button = new RectButton(this.p, 200, 100, func);
    // go_game_button.position.x = 840;
    // go_game_button.position.y = 600;
    //this.add(go_game_button);

    // ⛳️ Title Text
    let text = new DrawableText(this.p, "教學介面", 50);
    console.log("🔤 字型載入結果：", this.iansuiFont);
    text.position.x = 150;
    text.position.y = HEIGHT / 9;
    text.font = this.iansuiFont; // ✅ 套用 Iansui 字體
    this.add(text);


    // 🎥 Setup camera
    this.video = this.p.createCapture(this.p.VIDEO).size(WIDTH, HEIGHT).hide();

    this.myCamera = new Camera(this.video.elt, {
      onFrame: async () => {
        if (!this.needVideo) return;
      },
      width: WIDTH,
      height: HEIGHT,
    }).start();

  }

  draw() {
    const p = this.p;
  
    if (!this.bgGrass || !this.tv) {
      console.log("⛔ 背景圖或電視圖尚未載入！");
      return;
    }
  
    p.imageMode(p.CORNER);
    p.background(255);
    p.image(this.bgGrass, 0, 0, p.width, p.height);
  
    const tvWidth = 512;
    const tvHeight = 512;
    const tvX = (WIDTH - tvWidth) / 2;
    const tvY = -50;
  
    const batterWidth = 300;
    const batterHeight = 303;
    const batterX = tvX - 260;
    const batterY = tvY + 145;
  
    const maskWidth = 300;
    const maskHeight = 300;
    const maskX = tvX + 500;
    const maskY = tvY + 145;
  
    // 🖱 檢查 hover 狀態
    const hoveringMask = this.isMouseOverMask();
  
    // 🔄 動態更新偏移量（滑鼠移上去就往上浮）
    this.maskHoverOffset = p.lerp(this.maskHoverOffset, hoveringMask ? -20 : 0, 0.1);
  
    // 畫圖
    p.image(this.tv, tvX, tvY, tvWidth, tvHeight);
    p.image(this.batter, batterX, batterY, batterWidth, batterHeight);
    p.image(this.mask, maskX, maskY + this.maskHoverOffset, maskWidth, maskHeight);
  
    // video
    if (this.video) {
      const videoWidth = 270;
      const videoHeight = 180;
      const videoX = tvX + (tvWidth - videoWidth) / 2;
      const videoY = tvY + (tvHeight - videoHeight) / 2 - 52;
      p.image(this.video, videoX, videoY, videoWidth, videoHeight);
    }
  
    this.updateRibbons();
    this.drawRibbons(p);
  
    // 指標樣式
    p.cursor(hoveringMask ? p.HAND : p.ARROW);
  
    super.draw();
  }
  
  
  // ✅ 新增函式：偵測滑鼠是否在面罩上
  isMouseOverMask() {
    const p = this.p;
    const maskWidth = 300;
    const maskHeight = 300;
    const tvX = (WIDTH - 512) / 2;
    const maskX = tvX + 500;
    const maskY = -50 + 145 + this.maskHoverOffset;
  
    const left = maskX;
    const right = maskX + maskWidth;
    const top = maskY;
    const bottom = maskY + maskHeight;
  
    if (p.mouseX < left || p.mouseX > right || p.mouseY < top || p.mouseY > bottom) {
      return false;
    }
  
    // 🧠 對應到圖片上的像素座標
    const relX = p.int(p.map(p.mouseX, left, right, 0, this.mask.width));
    const relY = p.int(p.map(p.mouseY, top, bottom, 0, this.mask.height));
    const c = this.mask.get(relX, relY); // 取得 RGBA 值
  
    return c[3] > 10; // 透明度 > 10 視為非透明
  }
  
  
  // ✅ 點擊時返回主選單（當滑到 mask 上時）
  mousePressed() {
    if (this.isMouseOverMask()) {
      SceneManager.instance.changeScene(SceneEnum.MENU);
    }
  }
  
  

  OnStop() {
    this.needVideo = false;
  }

  OnStart() {
    this.needVideo = true;
  }
  drawBalloons(p) {
    const balloonColors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF'];
    const positions = [
      { x: 100, y: 200 },
      { x: 200, y: 250 },
      { x: WIDTH - 120, y: 220 },
      { x: WIDTH - 200, y: 300 }
    ];
    p.noStroke();
    for (let i = 0; i < positions.length; i++) {
      let { x, y } = positions[i];
      p.fill(balloonColors[i % balloonColors.length]);
      p.ellipse(x, y, 40, 50); // 氣球主體
      p.stroke(100);
      p.line(x, y + 25, x, y + 60); // 線繩
    }
  }
  updateRibbons() {
    const tvWidth = 512;
    const tvX = (WIDTH - tvWidth) / 2;
  
    // 每幾幀加入新彩帶（不出現在電視區）
    if (this.p.frameCount % 25 === 0) {
      let x;
      do {
        x = this.p.random(WIDTH);
      } while ( x < tvX + tvWidth); // ❌ 跳過電視範圍
  
      this.ribbons.push({
        x: x,
        y: -20,
        vy: this.p.random(1, 2),
        sway: this.p.random(0.5, 1),
        angle: this.p.random(this.p.TWO_PI),
        color: this.p.random(this.ribbonColors),
      });
    }
  
    // 更新位置
    for (let r of this.ribbons) {
      r.y += r.vy;
      r.angle += 0.1;
      r.x += Math.sin(r.angle) * r.sway;
    }
  
    // ❌ 只保留畫面上半部（避免蓋規則文字）
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
      p.curveVertex(-6, -12);
      p.curveVertex(0, -6);
      p.curveVertex(6, 0);
      p.curveVertex(0, 6);
      p.curveVertex(-6, 12);
      p.curveVertex(-12, 6);
      p.curveVertex(-6, -12);
      p.endShape(p.CLOSE);
      p.pop();
    }
    p.pop();
  }
  
}
