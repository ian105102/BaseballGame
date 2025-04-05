import { IScene } from "./IScene.js";
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js"

import { SceneEnum } from "../SceneEnum.js";
import { SceneManager } from "../SceneManager.js";

import { WIDTH } from "../G.js"
import { HEIGHT } from "../G.js"
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js";

export class MenuScene extends IScene {
  static instance = null;

  constructor(p) {
    if (MenuScene.instance) {
      return MenuScene.instance;
    }
    super(p);
    this.p = p;
    this.playing = false;

    this.ballBtn = { x: 400, y: 500, w: 180, h: 158, hoverOffset: 0 };
    this.gloveBtn = { x: 680, y: 500, w: 200, h: 266, hoverOffset: 0 };

    MenuScene.instance = this;
    this.init();
  }

  setImages(assets) {
    this.bgImg = assets.bgImg;
    this.ballImg = assets.ballImg;
    this.gloveImg = assets.gloveImg;
    return this;
  }

  init() {
    const text = new DrawableText(this.p, "棒球菜單介面", 50);
    text.position.x = WIDTH / 2;
    text.position.y = HEIGHT / 7;
    this.maskHoverOffset = 0;
    this.add(text);

    const func = () => {
      SceneManager.instance.changeScene(SceneEnum.TUTORIAL);
    };
    const goTutorialButton = new RectButton(this.p, 300, 100, func);
    goTutorialButton.position.x = 540;
    goTutorialButton.position.y = 360;
    this.add(goTutorialButton);
  }

  OnStart() {
    // 可擴充用
  }

  draw() {
    const p = this.p;

    if (!this.bgImg || !this.ballImg || !this.gloveImg) {
      console.log("⛔ 有圖片沒載到！目前狀態：", {
        bgImg: this.bgImg,
        ballImg: this.ballImg,
        gloveImg: this.gloveImg,
      });
      return;
    }

    p.imageMode(p.CORNER);
    p.background(255);
    p.image(this.bgImg, 0, 0, p.width, p.height);

    const hoverBall = this.isMouseOver(this.ballImg, this.ballBtn);
    const hoverGlove = this.isMouseOver(this.gloveImg, this.gloveBtn);
    this.drawHover(this.ballBtn, this.ballImg, hoverBall);
    this.drawHover(this.gloveBtn, this.gloveImg, hoverGlove);
    p.cursor(hoverBall || hoverGlove ? p.HAND : p.ARROW);
  }

  mousePressed() {
    const p = this.p;
    if (p.mouseButton === p.LEFT) {
      if (this.isMouseOver(this.ballImg, this.ballBtn)) {
        this.playing = true;
        SceneManager.instance.changeScene(SceneEnum.GAME);
      } else if (this.isMouseOver(this.gloveImg, this.gloveBtn)) {
        SceneManager.instance.changeScene(SceneEnum.TUTORIAL);
      }
    }
  }

  drawHover(btn, img, hovering) {
    const p = this.p;
    p.imageMode(p.CENTER);
    btn.hoverOffset = p.lerp(btn.hoverOffset, hovering ? -20 : 0, 0.2);
    p.image(img, btn.x, btn.y + btn.hoverOffset, btn.w, btn.h);
  }

  isMouseOver(img, btn) {
    const p = this.p;
    const left = btn.x - btn.w / 2;
    const right = btn.x + btn.w / 2;
    const top = btn.y + btn.hoverOffset - btn.h / 2;
    const bottom = btn.y + btn.hoverOffset + btn.h / 2;

    if (
      p.mouseX < left ||
      p.mouseX > right ||
      p.mouseY < top ||
      p.mouseY > bottom
    )
      return false;

    const relX = p.int(p.map(p.mouseX, left, right, 0, img.width));
    const relY = p.int(p.map(p.mouseY, top, bottom, 0, img.height));
    const c = img.get(relX, relY);
    return c[3] > 10;
  }
}