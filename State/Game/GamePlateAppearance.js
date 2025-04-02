
import { GameFlowBase } from "./GameFlowBase.js";
import { CircleCollision } from "../../Objects/Collisions/CircleCollision.js";


export class GamePlateAppearance extends GameFlowBase {
    constructor(System){
        super(System);
        this.onHitBaseball =  false;
    }
    start(){
        this.circleCollishion = new  CircleCollision(this.system.p);
        this.circleCollishion.position.x = 520;
        this.circleCollishion.position.y = 600;
        this.circleCollishion.radius = 10;
        this.system.GeneratorManager.start(this.ThrowBaseball());
        

        
  
    }
    *ThrowBaseball(){
        this.onHitBaseball = true;
        console.log("開始投球");
        this.system.baseball.isActive = true;
        this.system.ballCurveEffect.do(
            [
                { x: 540, y: 200 },
                { x: 500, y: 300 },
                { x: 520, y: 600 },
                { x: 550, y: 700 }
            ],
            (x,y,t) =>{
    
                this.system.baseball.position.x = x;
                this.system.baseball.position.y = y;
                this.system.baseball.scale.x =  t;
                this.system.baseball.scale.y =  t;
            
            },
            ()=>{
                
                this.UnHitBaseball();
            }
            ,
            0.005,
            0.001
        ); 
    }
    UnHitBaseball(){
        this.onHitBaseball = false;
        console.log("沒打到!!!");
    }
    HitBaseball(startPoint , startT , startVelocity){
        this.system.ballCurveEffect.do(
            [
        
                this.hitPoint,
                { x: 500, y: 300 },
                { x: 540, y: 200 },

            ],
            (x,y,t) =>{
    
                this.system.baseball.position.x = x;
                this.system.baseball.position.y = y;
                let remap = this.system.p.map(t, 0, 1, 1, 0);
                this.system.baseball.scale.x = remap;
                this.system.baseball.scale.y =  remap;
            
            },
            ()=>{
                
                this.UnHitBaseball();
            }
            ,
            startVelocity,
            0.001
        ); 
    }

    
    update(delta){
        if(this.onHitBaseball){
            let x1 = this.system.baseball.position.x;
            let y1 = this.system.baseball.position.y;
            this.circleCollishion.draw();
            if(this.circleCollishion.checkCollision(x1, y1)){
                if(this.system.bat.checkCollide([this.system.baseball.body])){
                    this.system.ballCurveEffect.isActive = false;
                    this.onHitBaseball = false;
              
                    this.HitBaseball({x1 , y1} ,  );
                }   
            }
        }

    }

}