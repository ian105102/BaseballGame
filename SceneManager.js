import { SceneEnum } from "./SceneEnum.js"
import { GameScene } from "./Scenes/GameScene.js";
import { MenuScene } from "./Scenes/MenuScene.js";
import { ScoreScene } from "./Scenes/ScoreScene.js";
import { TutorialScene } from "./Scenes/TutoriaScene.js";




export class SceneManager {
    static instance = null
    constructor(p,assets) {
        if(SceneManager.instance){
            return SceneManager.instance
        }

       
      this.assets = assets;
      this.scenes = new Map();
      const menuScene = new MenuScene(p);
      menuScene.setImages({
        bgImg: assets.bgImg,
        ballImg: assets.ballImg,
        gloveImg: assets.gloveImg
      });
      this.scenes.set(SceneEnum.MENU, menuScene);
      this.scenes.set(SceneEnum.TUTORIAL, new TutorialScene(p));
      const gameScene = new GameScene(p);
      gameScene.setImages({
        playball: assets.playball
      });
      this.scenes.set(SceneEnum.GAME, gameScene);
      this.scenes.set(SceneEnum.SCORE, new ScoreScene(p));
      //this.scenes.set(SceneEnum.MENU, new MenuScene());
      this.currentScene = this.scenes.get(SceneEnum.MENU);
      SceneManager.instance = this

    }
  
    changeScene(sceneEnum) {

      if (!this.scenes.has(sceneEnum)) {
        throw new Error(`Scene ${sceneEnum} does not exist.`);
      }

      this.currentScene.OnStop();
      this.currentScene = this.scenes.get(sceneEnum);
      this.currentScene.OnStart();
      console.log(`Changed to ${sceneEnum}`);
    }
  
    update(delta) {
      if (this.currentScene) {
        this.currentScene.update(delta);
      }
    }
  
    draw() {
      if (this.currentScene) {
        this.currentScene.draw();
      }
    }
  }
  