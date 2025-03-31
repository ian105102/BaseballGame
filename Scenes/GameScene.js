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
import { Character } from "../Objects/DrawableObj/Unit/Character.js"

export class GameScene extends IScene{
    static instance = null

    constructor(p) {
        if (GameScene.instance) {
            
            return GameScene.instance
        }
        super(p);


        let assetLoader = new AssetLoader(p);
        

        this.World = Matter.World.create({ gravity: { x: 0, y: 0 } });
        this.engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
        this.batModel = p.loadModel('./Asset/3dObject/BaseballBat.obj',true);
        console.log(this.batModel);
        
        GameScene.instance = this;
        GameScene.instance.init()
    } 
    

    
    //call after constructor
    init(){
        
        let func =()=>{
            SceneManager.instance.changeScene(SceneEnum.SCORE)
        }
        let go_score_button = new RectButton(this.p,300,100,func)
        go_score_button.position.x = 800
        go_score_button.position.y = 600

        let instance = GameScene.instance

       
   

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

        this.Player = new Character(this.p, this.bat, this.ball)

        
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
        this.bat.setPosition(this.p.mouseX, this.p.mouseY)


         

  
    }
}