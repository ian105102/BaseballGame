import { IScene } from "./IScene.js";
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js";

import { SceneEnum } from "../SceneEnum.js";
import { SceneManager } from "../SceneManager.js";

import { WIDTH } from "../G.js";
import { HEIGHT } from "../G.js";
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js";

export class ScoreScene extends IScene {
  static instance = null;

  constructor(p) {
    if (ScoreScene.instance) {
      return ScoreScene.instance;
    }
    super(p);
    ScoreScene.instance = this;
    this.images = {}; // 儲存圖像
    this.textObjects = [];
    this.mvpAlpha = 255; // MVP 圖片透明度控制
    this.mvpAlphaDir = -2; // MVP 透明度變化方向

    this.ballAngleLeft = 0;
    this.ballAngleRight = 0;
    this.ballFloatOffset = 0;
    this.ballFloatDir = 1;
    this.ballMoveX = 0;
    this.ballMoveXDir = 1;

    ScoreScene.instance.init();
  }

  setImages(assets) {
    this.images.BGResult = assets.BGResult;
    this.images.bat = assets.bat;
    this.images.pinkCap = assets.pinkCap;
    this.images.home = assets.home;
    this.images.joystick = assets.joystick;
    this.images.mvp = assets.mvp;
    this.images.trophy = assets.trophy;
    this.images.Baseball = assets.Baseball;
    this.jfFont = assets.jfFont;
    return this;
  }

  init() {
    let func = () => {
      SceneManager.instance.changeScene(SceneEnum.MENU);
    };
    this.homeBtn = { x: WIDTH / 2, y: HEIGHT - 100, w: 256, h: 256, hoverOffset: 0 };
  }

  draw() {
    const p = this.p;

    p.imageMode(p.CORNER);
    p.background(255);

    if (this.images.BGResult) {
      p.image(this.images.BGResult, 0, 0, WIDTH, HEIGHT);
    }

    const hoverHome = this.isMouseOver(this.images.home, this.homeBtn);
    this.homeBtn.hoverOffset = p.lerp(this.homeBtn.hoverOffset, hoverHome ? -20 : 0, 0.2);
    p.imageMode(p.CENTER);
    p.image(this.images.home, this.homeBtn.x, this.homeBtn.y + this.homeBtn.hoverOffset, this.homeBtn.w, this.homeBtn.h);
    p.cursor(hoverHome ? p.HAND : p.ARROW);

    // MVP 閃爍效果
    if (this.images.mvp) {
      p.tint(255, this.mvpAlpha);
      p.image(this.images.mvp, WIDTH / 2, 100, 512, 512);
      p.noTint();
      this.mvpAlpha += this.mvpAlphaDir;
      if (this.mvpAlpha <= 100 || this.mvpAlpha >= 255) {
        this.mvpAlphaDir *= -1;
      }
    }

    // 棒球動態裝飾
    if (this.images.Baseball) {
      this.ballAngleLeft += 0.05;
      this.ballAngleRight += 0.03;
      this.ballFloatOffset += this.ballFloatDir * 0.5;
      if (this.ballFloatOffset > 10 || this.ballFloatOffset < -10) this.ballFloatDir *= -1;

      this.ballMoveX += this.ballMoveXDir * 1;
      if (this.ballMoveX > 100 || this.ballMoveX < -100) this.ballMoveXDir *= -1;

      // 左球：旋轉 + 左右移動
      p.push();
      p.translate(150 + this.ballMoveX, HEIGHT / 2);
      p.rotate(this.ballAngleLeft);
      p.image(this.images.Baseball, 0, this.ballFloatOffset, 100, 100);
      p.pop();

      // 右球：只旋轉
      p.push();
      p.translate(WIDTH - 150, HEIGHT / 2);
      p.rotate(this.ballAngleRight);
      p.image(this.images.Baseball, 0, this.ballFloatOffset, 100, 100);
      p.pop();
    }

    if (this.images.trophy)   p.image(this.images.trophy, WIDTH - 200, HEIGHT/2 + 200, 256, 256);
    if (this.images.joystick) p.image(this.images.joystick, 200, HEIGHT/2 + 200, 256, 256);
    if (this.images.pinkCap)  p.image(this.images.pinkCap, 150, HEIGHT/2 - 200, 256, 256);
    if (this.images.bat)      p.image(this.images.bat, WIDTH - 200, HEIGHT/2 - 200, 256, 256);

    for (let obj of this.textObjects) obj.draw();

    super.draw();
  }

  isMouseOver(img, btn) {
    const p = this.p;
    const left = btn.x - btn.w / 2;
    const right = btn.x + btn.w / 2;
    const top = btn.y + btn.hoverOffset - btn.h / 2;
    const bottom = btn.y + btn.hoverOffset + btn.h / 2;

    if (
      p.mouseX < left || p.mouseX > right ||
      p.mouseY < top || p.mouseY > bottom
    ) return false;

    const relX = p.int(p.map(p.mouseX, left, right, 0, img.width));
    const relY = p.int(p.map(p.mouseY, top, bottom, 0, img.height));
    const c = img.get(relX, relY);
    return c[3] > 10;
  }

  mousePressed() {
    if (this.isMouseOver(this.images.home, this.homeBtn)) {
      SceneManager.instance.changeScene(SceneEnum.MENU);
    }
  }
}