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
      const tutorialscene = new TutorialScene(p);
      tutorialscene.setImages({
        bgGrass: assets.bgGrass,
        tv:assets.tv,
        batter:assets.batter,
        mask:assets.mask,
        jfFont:assets.jfFont,
      });

      this.scenes.set(SceneEnum.TUTORIAL, tutorialscene);
      const gameScene = new GameScene(p);
      gameScene.setImages({
        playball: assets.playball
      });
      this.scenes.set(SceneEnum.GAME, gameScene);
      const scorescene = new ScoreScene(p);
      scorescene.setImages({
        BGResult:assets.BGResult,
        bat:assets.bat,
        pinkCap:assets.pinkCap,
        trophy:assets.trophy,
        home:assets.home,
        joystick:assets.joystick,
        mvp:assets.mvp,
        jfFont:assets.jfFont,
        Baseball:assets.Baseball,
      })
      this.scenes.set(SceneEnum.SCORE, scorescene);
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
  