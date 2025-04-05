import {IScene} from "./IScene.js"
import {Ball} from "../Objects/DrawableObj/Ball/Ball.js"
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js"
import { SceneManager } from "../SceneManager.js"
import { SceneEnum } from "../SceneEnum.js"

import { WIDTH } from "../G.js"
import { HEIGHT } from "../G.js"
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js"
import { Bat } from "../Objects/DrawableObj/Game/Bat.js"

import { Hitbox3Ditem } from "../Objects/DrawableObj/Game/Hitbox3Ditem.js"
import { AssetLoader } from "../AssetLoader.js"
import { Character } from "../Objects/DrawableObj/Unit/CharacterObj.js"
import poseTracker from '../detection.js';
import { CurveMoveEffect } from "../Objects/Utils/CurveMoveEffect.js"
import { Baseball } from "../Objects/DrawableObj/Ball/Baseball.js"
import { GameCountdown } from "../State/Game/GameCountdown.js"
import { GameNone } from "../State/Game/GameNone.js"
import { GeneratorManager } from "../Objects/Utils/GeneratorManager.js"

import { ObjEffect } from "../Objects/DrawableObj/effect/ObjEffect.js"
import { Circle } from "../Objects/DrawableObj/effect/Circle.js"
import { ScoreboardUi } from "../Objects/DrawableObj/ui/ScoreboardUi.js"
import {  StrikeZoneUi } from "../Objects/DrawableObj/ui/StrikeZoneUi.js"
import { BackImage } from "../Objects/DrawableObj/ui/BackImage.js"
import { HitPointUi } from "../Objects/DrawableObj/ui/HitPointUi.js"

import ReceiveArduino from "../ArduinoConnectJS.js"


export class GameScene extends IScene{
    static instance = null

    constructor(p) {
        if (GameScene.instance) {
            
            return GameScene.instance
        }
        super(p);
        this.gameCanva = document.querySelector(".GameCanvas");
    

        this.video;

        this.World = Matter.World.create({ gravity: { x: 0, y: 0 } });
        this.engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
        this.batModel = p.loadModel('./Asset/3dObject/BaseballBat.obj',true);
        this.backgroundimg = p.loadImage('../Asset/img/gamebg.png',true);
        
        this.GeneratorManager = new GeneratorManager();
   

        GameScene.instance = this;
        GameScene.instance.init()
        
    } 
    setImages(assets) {
        this.playball = assets.playball;
        return this;
    }
    video;
    //call after constructor
    init(){


        let instance = GameScene.instance

        this.ballCurveEffect = new CurveMoveEffect(this.p, 0.01, false, false , true);
        this.ballCurveEffect.isActive = false;


        // let func =()=>{
        //     SceneManager.instance.changeScene(SceneEnum.SCORE)
        // }
        // let go_score_button = new RectButton(this.p,300,100,func)
        // go_score_button.position.x = 800
        // go_score_button.position.y = 600
        // instance.add(go_score_button)

        this.Backimage = new BackImage(this.p, this.backgroundimg);
        this.Backimage.size.set(WIDTH, HEIGHT);
        this.Backimage.position.set(WIDTH/2, HEIGHT/2-40);
        this.Backimage.scale.set(1.3, 1.3);
        instance.add(this.Backimage);


        this.needVideo = true;
        this.video = this.p.createCapture(this.p.VIDEO)
        .size(WIDTH, HEIGHT)
        .hide();
        this.flippedGraphics = this.p.createGraphics(WIDTH, HEIGHT);
        this.myCamera = new Camera(this.video.elt, {
            onFrame: async () => {
                if (!this.needVideo) return;
        
                // 將翻轉後的影像畫到離屏畫布
                this.flippedGraphics.push();
                this.flippedGraphics.translate(WIDTH, 0);   // 移動到畫布右邊
                this.flippedGraphics.scale(-1, 1);          // 水平翻轉
                this.flippedGraphics.image(this.video, 0, 0, WIDTH, HEIGHT);
                this.flippedGraphics.pop();
        
                // 把鏡像後的畫面傳送給 poseTracker
                await poseTracker.send(this.flippedGraphics.canvas);
            },
            width: 1080,
            height: 720
        }).start();

        
        this.strikeZoneUi = new StrikeZoneUi(this.p );
        this.strikeZoneUi.position.x = WIDTH / 2+5;
        this.strikeZoneUi.position.y = 550;
        this.strikeZoneUi.size.set(60,100);
        instance.add(this.strikeZoneUi);

        this.hitPointUi = new HitPointUi(this.p );
        this.hitPointUi.isActive = false;
        instance.add(this.hitPointUi);
        
        // let text = new DrawableText(this.p,"遊戲介面",50)
        // text.position.x = WIDTH / 2
        // text.position.y = HEIGHT / 8
        // instance.add(text)


        this.secondbaseman = new Character(this.p);
        this.secondbaseman.color = "rgb(0, 0, 255)";
        this.secondbaseman.scale.set(0.25, 0.25);
        this.secondbaseman.setPosition(WIDTH/2+5, HEIGHT/2 -115  );
        this.secondbaseman.hands.isActive = false;
        this.secondbaseman.needEye = true;
        instance.add(this.secondbaseman);


        this.frstOutfielder = new Character(this.p);
        this.frstOutfielder.color = "rgb(0, 0, 255)";
        this.frstOutfielder.scale.set(0.35, 0.35);
        this.frstOutfielder.setPosition(WIDTH/2+400, HEIGHT/2 -80  );
        this.frstOutfielder.hands.isActive = false;
        this.frstOutfielder.needEye = true;
        instance.add(this.frstOutfielder);


        this.secondOutfielder = new Character(this.p);
        this.secondOutfielder.color = "rgb(0, 0, 255)";
        this.secondOutfielder.scale.set(0.35, 0.35);
        this.secondOutfielder.setPosition(WIDTH/2-400, HEIGHT/2 -80  );
        this.secondOutfielder.hands.isActive = false;
        this.secondOutfielder.needEye = true;
        instance.add(this.secondOutfielder);

        this.frstbaseman = new Character(this.p);
        this.frstbaseman.color = "rgb(0, 0, 255)";
        this.frstbaseman.scale.set(0.5, 0.5);
        this.frstbaseman.setPosition(WIDTH/2+550, HEIGHT/2);
        this.frstbaseman.hands.isActive = false;
        this.frstbaseman.needEye = true;
        instance.add(this.frstbaseman);
        
        this.thirdbaseman = new Character(this.p);
        this.thirdbaseman.color = "rgb(0, 0, 255)";
        this.thirdbaseman.scale.set(0.5, 0.5);
        this.thirdbaseman.setPosition(WIDTH/2-560, HEIGHT/2 );
        this.thirdbaseman.hands.isActive = false;
        this.thirdbaseman.needEye = true;
        instance.add(this.thirdbaseman);

        this.pitcher = new Character(this.p);
        this.pitcher.color = "rgb(0, 0, 255)";
        this.pitcher.scale.set(0.5, 0.5);
        this.pitcher.setPosition(WIDTH/2, HEIGHT/2 );
        this.pitcher.hands.isActive = false;
        this.pitcher.needEye = true;
        instance.add(this.pitcher);

   
        this.baseball = new Baseball(this.p, this.World , {x: 30, y: 30});
        this.baseball.position.set(WIDTH/2-5, HEIGHT/2);
        this.baseball.isActive = false;
        instance.add(this.baseball);

        this.bat = new Hitbox3Ditem( this.p , this.batModel, this.World, this.engine, {x:WIDTH/2,y:HEIGHT/2});
        instance.add(this.bat);

 




        this.Player = new Character(this.p);
        this.Player.setPosition(WIDTH/2-110, HEIGHT/2 +210);
        this.Player.color = "rgb(255, 0, 0)";
        instance.add(this.Player);


        this.catcher = new Character(this.p);
        this.catcher.color = "rgb(0, 0, 255)";
        this.catcher.scale.set(1.2, 1.2);
        this.catcher.setPosition(WIDTH/2, HEIGHT/2 +380);

        instance.add(this.catcher);



        this.scoreboard = new ScoreboardUi(this.p );
        this.scoreboard.position.x = 0;
        this.scoreboard.position.y = 0;
        instance.add(this.scoreboard);





        this.ResultShowtext = new DrawableText(this.p,"",150);
        this.ResultShowtext.position.x = WIDTH / 2;
        this.ResultShowtext.position.y = HEIGHT / 2;
        instance.add(this.ResultShowtext);
        this.ResultShowtext.isActive = false;


        this.countdownText = new DrawableText(this.p,"0",150);
        this.countdownText.position.x = WIDTH / 2
        this.countdownText.position.y = HEIGHT / 2;
        instance.add(this.countdownText);


        this.videoImage = new BackImage(this.p, this.backgroundimg);
        this.videoImage.size.set(270, 180);
        this.videoImage.isMirror = true; // 鏡像處理
        this.videoImage.position.set(WIDTH - 290/2, HEIGHT - 200/2);
      
        instance.add(this.videoImage);

        this.circle = new Circle( this.p);
        this.circle.radius = 200;
        this.circle.position.x = WIDTH / 2;
        this.circle.position.y = HEIGHT / 2;
        this.circle.scale.set(0 , 0);

        instance.add(this.circle); // 轉場特效用球體，需要覆蓋所有物件
        this.objEffect = new ObjEffect(this.p, this.circle);




    }
    OnStart(){
     
        this.changeState(new GameCountdown(GameScene.instance) );
        this.needVideo = true;
        this.strikePoint = 0;
        this.ballPoint = 0;
        this.outPoint = 0;
        this.point = 0;
        this.round = 0;
        this.scoreboard.setCounts(0, 0,0 ,0);

    }

    _on_update(delta){

      
        this.p.imageMode(this.p.CORNER);
        this.p.image(this.playball, 0, 0, this.p.width, this.p.height);
        Matter.Engine.update(this.engine);
        
        if(!this.firstdata){
            this.firstEuler = ReceiveArduino.euler;
            this.oldEuler = this.firstEuler;
            this.firstdata  = true;
        }

        // this.newEuler = ReceiveArduino.euler;
         // 平滑過渡到新的 Euler 角度
        // this.batEuler[0] = this.p.lerp((this.newEuler[0]-this.firstEuler[0]), (this.oldEuler[0]-this.firstEuler[0]), 0.1)
        // this.batEuler[1] = this.p.lerp((this.newEuler[1]-this.firstEuler[1]), (this.oldEuler[1]-this.firstEuler[1]), 0.1), 
        // this.batEuler[2] = this.p.lerp((this.newEuler[2]-this.firstEuler[2]), (this.oldEuler[2]-this.firstEuler[2]), 0.1), 
        
        // 旋轉 bat
        // console.log("ReceiveArduino.euler: ", ReceiveArduino.euler);
        // console.log("this.batEuler: ", this.batEuler);
        // this.bat.rotateEuler(this.firstEuler[0]-(this.newEuler[0]-this.oldEuler[0]),
        //                     this.firstEuler[1]-(this.newEuler[1]-this.oldEuler[1]), 
        //                     this.firstEuler[2]-(this.newEuler[2]-this.oldEuler[2]));
        this.bat.rotateEuler(ReceiveArduino.euler[0], ReceiveArduino.euler[1], ReceiveArduino.euler[2]);

        this.oldEuler = this.newEuler;
       
    
      
        this.bat.setPosition(this.Player.hands.getrelLeft().x, this.Player.hands.getrelLeft().y);
       
        this.Player.hands.setLeftHandPosition(50, 50);
        this.Player.hands.setRightHandPosition(-50, 50);
        let handPositions = poseTracker.getHandToShoulderDistances();
        this.Player.hands.setLeftHandPosition(handPositions.leftHand.x * 400,handPositions.leftHand.y * 400);
        this.Player.hands.setRightHandPosition(handPositions.rightHand.x * 400, handPositions.rightHand.y * 400);
    

       
        this.ballCurveEffect.update(delta);

        this.videoImage.img = this.video;


        this.GameFlow.update(delta);
        this.GeneratorManager.update();
    }
    OnStop(){
        this.needVideo = false;
        this.GeneratorManager.clearAll();
        this.changeState(new GameNone(GameScene.instance));

  
    }

    changeState(state){
        this.GameFlow
        this.GameFlow = state;
        this.GameFlow.start();
    }

}