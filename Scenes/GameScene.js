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

export class GameScene extends IScene{
    static instance = null

    constructor(p) {
        if (GameScene.instance) {
            
            return GameScene.instance
        }
        super(p);

      
        let assetLoader = new AssetLoader(p);
        this.video;

        this.World = Matter.World.create({ gravity: { x: 0, y: 0 } });
        this.engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
        this.batModel = p.loadModel('./Asset/3dObject/BaseballBat.obj',true);
        console.log(this.batModel);
        
        this.ballCurveEffect = new CurveMoveEffect(p, 0.01, true, true);

        GameScene.instance = this;
        GameScene.instance.init()

    
        
    } 
    
    
    video;
    //call after constructor
    init(){
        this.needVideo = true;
        let func =()=>{
            SceneManager.instance.changeScene(SceneEnum.SCORE)
        }
        let go_score_button = new RectButton(this.p,300,100,func)
        go_score_button.position.x = 800
        go_score_button.position.y = 600

        let instance = GameScene.instance
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
        

        instance.add(go_score_button)
        
        let text = new DrawableText(this.p,"遊戲介面",50)
        text.position.x = WIDTH / 2
        text.position.y = HEIGHT / 8
        instance.add(text)

        // this.bat = new Bat(this.p)
        this.ball = new Ball(this.p)

      
        instance.add(this.ball)


        console.log(this.batModel)
        
        this.bat = new Hitbox3Ditem( this.p , this.batModel, this.World, this.engine, {x:WIDTH/2,y:HEIGHT/2});
        instance.add(this.bat);

        this.Player = new Character(this.p, this.bat, this.ball);
        instance.add(this.Player);
        
        this.baseball = new Baseball(this.p, this.World , {x: 30, y: 30});
        instance.add(this.baseball);


        this.ballCurveEffect.do(
            [
                { x: 540, y: 500 },
                { x: 500, y: 0 },
                { x: 520, y: 500 },
            ],
            (x,y,t) =>{
                console.log(x,y,t);
                this.baseball.position.x = x;
                this.baseball.position.y = y;
         
            }
         );
        
    }

    _on_update(delta){
        // let hit = this.bat.collider.checkCollisionWithCircle(this.ball.collider)
        // console.log(hit)
        // if(hit && this.p.is_first_left_pressing){
        //     console.log("bat hit ball!")
        //     this.ball.stop_shoot()

        // }
        Matter.Engine.update(this.engine);
        
        this.bat.rotateEuler(0, this.p.mouseY/100 , this.p.mouseX/100);
       
        this.Player.setPosition(WIDTH/2-130, HEIGHT/2 +200);
      
        this.bat.setPosition(this.Player.hands.getrelLeft().x, this.Player.hands.getrelLeft().y);
       
        this.Player.hands.setLeftHandPosition(50, 50);
        this.Player.hands.setRightHandPosition(-50, 50);
        let handPositions = poseTracker.getHandToShoulderDistances();
        this.Player.hands.setLeftHandPosition( handPositions.leftHand.x * 400,handPositions.leftHand.y * 400);
        this.Player.hands.setRightHandPosition(handPositions.rightHand.x * 400, handPositions.rightHand.y * 400);
    
        this.p.image(this.video, WIDTH-280, HEIGHT-190, 270,180);
       
        this.ballCurveEffect.update(delta);


        if(this.bat.checkCollide([this.baseball.body])){
            console.log("bat hit ball!")
            this.baseball.isActive = false;
        }


    }
    OnStop(){
        this.needVideo = false;
    }

}