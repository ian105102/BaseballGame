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


export class GameScene extends IScene{
    static instance = null

    constructor(p) {
        if (GameScene.instance) {
            
            return GameScene.instance
        }
        super(p);


        this.video;

        this.World = Matter.World.create({ gravity: { x: 0, y: 0 } });
        this.engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
        this.batModel = p.loadModel('./Asset/3dObject/BaseballBat.obj',true);
        
        this.GeneratorManager = new GeneratorManager();
   

        GameScene.instance = this;
        GameScene.instance.init()
    
        
        
    } 
    
    
    video;
    //call after constructor
    init(){


        let instance = GameScene.instance

        this.ballCurveEffect = new CurveMoveEffect(this.p, 0.01, false, false , true);
        this.ballCurveEffect.isActive = false;


        let func =()=>{
            SceneManager.instance.changeScene(SceneEnum.SCORE)
        }
        let go_score_button = new RectButton(this.p,300,100,func)
        go_score_button.position.x = 800
        go_score_button.position.y = 600
        instance.add(go_score_button)




        this.needVideo = true;
        this.video = this.p.createCapture(this.p.VIDEO)
        .size(WIDTH, HEIGHT)
        .hide();
        this.myCamera = new Camera(this.video.elt, {         
            onFrame: async () => {
                if(!this.needVideo)return;
             
                await poseTracker.send(this.video.elt);
              
            },
            width: 1080,
            height: 720
        }).start();
        

        
        let text = new DrawableText(this.p,"遊戲介面",50)
        text.position.x = WIDTH / 2
        text.position.y = HEIGHT / 8
        instance.add(text)




        this.countdownText = new DrawableText(this.p,"0",50);
        this.countdownText.position.x = WIDTH / 2
        this.countdownText.position.y = HEIGHT / 2;
        instance.add(this.countdownText);


        this.baseball = new Baseball(this.p, this.World , {x: 30, y: 30});
        this.baseball.position.set(WIDTH/2, HEIGHT/2);
        this.baseball.isActive = false;
        instance.add(this.baseball);



        this.bat = new Hitbox3Ditem( this.p , this.batModel, this.World, this.engine, {x:WIDTH/2,y:HEIGHT/2});
        instance.add(this.bat);

        this.Player = new Character(this.p, this.bat, this.ball);
        instance.add(this.Player);
        
        this.scoreboard = new ScoreboardUi(this.p , "S", 50);
        this.scoreboard.position.x = 0;
        this.scoreboard.position.y = 0;
        instance.add(this.scoreboard);
        
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


        Matter.Engine.update(this.engine);
        
        this.bat.rotateEuler(0, this.p.mouseY/100 , this.p.mouseX/100);
       
        this.Player.setPosition(WIDTH/2-170, HEIGHT/2 +210);
      
        this.bat.setPosition(this.Player.hands.getrelLeft().x, this.Player.hands.getrelLeft().y);
       
        this.Player.hands.setLeftHandPosition(50, 50);
        this.Player.hands.setRightHandPosition(-50, 50);
        let handPositions = poseTracker.getHandToShoulderDistances();
        this.Player.hands.setLeftHandPosition( handPositions.leftHand.x * 400,handPositions.leftHand.y * 400);
        this.Player.hands.setRightHandPosition(handPositions.rightHand.x * 400, handPositions.rightHand.y * 400);
    
        this.p.image(this.video, WIDTH-280, HEIGHT-190, 270,180);
       
        this.ballCurveEffect.update(delta);




        this.GameFlow.update(delta);
        this.GeneratorManager.update();
    }
    OnStop(){
        this.needVideo = false;
        this.GeneratorManager.clearAll();
        this.changeState(new GameNone(GameScene.instance));

  
    }
    AtBatOver(ishit) {
     
        if(ishit){
            
            return true;
        }
        console.log(this.strikePoint , this.ballPoint);
        if (this.strikePoint >= 3) {
            this.outPoint++;
            return true; 
        }
        
        if (this.ballPoint >= 4) {
            this.point++;
            return true;  
        }
     
        return false; // 這位打者還沒結束打擊
    }
    changeState(state){
        this.GameFlow
        this.GameFlow = state;
        this.GameFlow.start();
    }

}