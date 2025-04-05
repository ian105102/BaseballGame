import { IScene } from "./IScene.js";
import { SceneEnum } from "../SceneEnum.js";
import { SceneManager } from "../SceneManager.js";

import { WIDTH } from "../G.js";
import { HEIGHT } from "../G.js";
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js";
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js";

    constructor(p) {
        if (TutorialScene.instance) {
            
            return TutorialScene.instance
        }
        super(p);
        TutorialScene.instance = this;
        TutorialScene.instance.init()
    } 
    

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
    return this;
  }

  init() {
    // ⛳️ Button
    let func = () => {
      SceneManager.instance.changeScene(SceneEnum.MENU);
    };

    let go_game_button = new RectButton(this.p, 200, 100, func);
    go_game_button.position.x = 840;
    go_game_button.position.y = 600;
    this.add(go_game_button);

    // ⛳️ Title Text
    let text = new DrawableText(this.p, "教學介面", 50);
    text.position.x =150;
    text.position.y = HEIGHT / 9;
    this.add(text);

    // 🎥 Setup camera
    this.video = this.p.createCapture(this.p.VIDEO).size(WIDTH, HEIGHT).hide();

    this.myCamera = new Camera(this.video.elt, {
      onFrame: async () => {
        if (!this.needVideo) return;
        await poseTracker.send(this.video.elt);
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
    const tvY = (HEIGHT - tvHeight) / 2;
  
    p.image(this.tv, tvX, tvY, tvWidth, tvHeight);
  
    if (this.video) {
        const videoWidth = 270;
        const videoHeight = 180;
        
        const videoX = tvX + (tvWidth - videoWidth) / 2;
        const videoY = tvY + (tvHeight - videoHeight) / 2 - 52;
      
        p.image(this.video, videoX, videoY, videoWidth, videoHeight);
      }
      
  
    super.draw();
  }
  

  OnStop() {
    this.needVideo = false;
  }

  OnStart() {
    this.needVideo = true;
  }
}
