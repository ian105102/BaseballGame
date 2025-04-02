
import { GameFlowBase } from "./GameFlowBase.js";
import { CircleCollision } from "../../Objects/Collisions/CircleCollision.js";


export class GamePlateAppearance extends GameFlowBase {
    constructor(System){
        super(System);
    
    }
    start(){
        this.circleCollishion = new  CircleCollision(this.system.p);
        this.circleCollishion.position.x = 520;
        this.circleCollishion.position.y = 600;
        this.circleCollishion.radius = 10;
        this.ThrowBaseball();

        

        
  
    }
    ThrowBaseball(){
  
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

                this.circleCollishion.draw();
                if(this.circleCollishion.checkCollisionWithLine(this.system.baseball.position.x, this.system.baseball.position.y ,x,y)){
                    if(this.system.bat.checkCollide([this.system.baseball.body])){
                        
                        this.system.ballCurveEffect.isActive = false;
                        this.onHitBaseball = false;
                     
                        this.HitBaseball({x , y} , t ,  this.system.ballCurveEffect.velocity );

                    }   
                }
                this.system.baseball.position.x = x;
                this.system.baseball.position.y = y;
                this.system.baseball.scale.x =  t;
                this.system.baseball.scale.y =  t;
                
            },
            ()=>{

                this._onSkipTheBall();
            }
            ,
            0.005,
            0.001
        ); 
    }

    HitBaseball(hitPoint , size ,startVelocity ){
        this.system.ballCurveEffect.do(
            [
        
                hitPoint,
                { x: 500, y: 300 },
                { x: 540, y: 200 },

            ],
            (x,y,t) =>{
    
                this.system.baseball.position.x = x;
                this.system.baseball.position.y = y;
                let remap = this.system.p.map(t, 0, 1, size, 0);
                this.system.baseball.scale.x = remap;
                this.system.baseball.scale.y =  remap;
            
            },
            ()=>{
             
                this._onHitTheBall();
            }
            ,
            startVelocity,
            0.001
        ); 
    }
    _onHitTheBall(){
        this.next();
    }
    _onSkipTheBall(){
        this.next();
    }

    next(){
        this.system.changeState(new GamePlateAppearance(this.system));
    }

}