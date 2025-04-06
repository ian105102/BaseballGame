import { IScene } from "./IScene.js";
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js"

import { SceneEnum } from "../SceneEnum.js";
import { SceneManager } from "../SceneManager.js";

import { WIDTH } from "../G.js"
import { HEIGHT } from "../G.js"
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js";
import ReceiveArduino from "../ArduinoConnectJS.js"

class Firework {
  constructor(p, startX, startY) {
    this.p = p;
    this.x = startX;
    this.y = startY;
    this.exploded = false;
    this.trailSpeed = p.random(3, 5);
    this.particles = [];
    this.color = p.random(['#ff7675', '#74b9ff', '#ffeaa7', '#fd79a8']);
  }

  update() {
    if (!this.exploded) {
      this.y -= this.trailSpeed;
      if (this.y < this.p.random(200, 300)) {
        this.explode();
      }
    } else {
      for (let p of this.particles) {
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 4;
      }
      this.particles = this.particles.filter(p => p.alpha > 0);
    }
  }

  explode() {
    this.exploded = true;
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: this.x,
        y: this.y,
        vx: this.p.cos(i * 18) * this.p.random(1, 3),
        vy: this.p.sin(i * 18) * this.p.random(1, 3),
        alpha: 255
      });
    }
  }

  draw() {
    if (!this.exploded) {
      this.p.stroke(this.color);
      this.p.strokeWeight(4);
      this.p.point(this.x, this.y);
    } else {
      for (let p of this.particles) {
        this.p.noStroke();
        this.p.fill(this.color);
        this.p.ellipse(p.x, p.y, 5);
      }
    }
  }

  isDone() {
    return this.exploded && this.particles.length === 0;
  }
}

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

    this.balloons = [];
    this.fireworks = [];

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
    this.balloonsNum = 8;
    const func = () => {
      SceneManager.instance.changeScene(SceneEnum.TUTORIAL);
    };
    const goTutorialButton = new RectButton(this.p, 300, 100, func);
    goTutorialButton.position.x = 540;
    goTutorialButton.position.y = 360;
    this.add(goTutorialButton);

    for (let i = 0; i < this.balloonsNum; i++) {
      this.balloons.push({
        x: this.p.random(0, this.ballBtn.x - this.ballBtn.w / 2 - 10),
        y: this.p.random(HEIGHT, HEIGHT + 200),
        speed: this.p.random(0.5, 1.5),
        color: this.p.random(['#00f0ff', 
                              '#aaffaa', 
                              '#ffee88', 
                              '#ffcccc',
                              '#FFADAD', 
                              '#FDFFB6',  
                              '#CAFFBF',  
                              '#9BF6FF',  
                              '#A0C4FF',  
                              '#BDB2FF',  
                              '#FFC6FF'])
      });
    }

    this.fireworks = [];
  }

  OnStart() {}

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

    this.drawBalloons();
    this.drawFireworks();

    const hoverBall = this.isMouseOver(this.ballImg, this.ballBtn);
    const hoverGlove = this.isMouseOver(this.gloveImg, this.gloveBtn);
    this.drawHover(this.ballBtn, this.ballImg, hoverBall);
    this.drawHover(this.gloveBtn, this.gloveImg, hoverGlove);
    p.cursor(hoverBall || hoverGlove ? p.HAND : p.ARROW);
  }

  drawBalloons() {
    const p = this.p;
    for (let balloon of this.balloons) {
      p.stroke(80);
      p.strokeWeight(1);
      p.line(balloon.x, balloon.y + 15, balloon.x, balloon.y + 50);

      p.fill(balloon.color);
      p.noStroke();
      p.ellipse(balloon.x, balloon.y, 20, 30);

      balloon.y -= balloon.speed;
      if (balloon.y < -50) {
        balloon.y = HEIGHT + this.p.random(0, 100);
        balloon.x = this.p.random(0, this.ballBtn.x - this.ballBtn.w / 2 - 10);
      }
    }
  }

  drawFireworks() {
    const p = this.p;

    if (p.frameCount % 30 === 0) {
      const x = p.random(this.gloveBtn.x + this.gloveBtn.w / 2 + 10, WIDTH);
      this.fireworks.push(new Firework(p, x, HEIGHT));
    }

    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];
      fw.update();
      fw.draw();
      if (fw.isDone()) {
        this.fireworks.splice(i, 1);
      }
    }
  }

  mousePressed() {
    const p = this.p;
    if (p.mouseButton === p.LEFT) {
      if (this.isMouseOver(this.ballImg, this.ballBtn)) {
        if(ReceiveArduino.arduinoConnected){
          this.playing = true;
          SceneManager.instance.changeScene(SceneEnum.GAME);
        } else {
          alert("請點擊RULES進行教學, 並校正球棒角度!");
          console.log("is not connect Arduino!");
        }
      } else if (this.isMouseOver(this.gloveImg, this.gloveBtn)) {
        ReceiveArduino.connect();
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
