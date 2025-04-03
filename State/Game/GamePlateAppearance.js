
import { GameFlowBase } from "./GameFlowBase.js";
import { CircleCollision } from "../../Objects/Collisions/CircleCollision.js";
import { BaseballPlay } from "../../BaseballPlayEnum.js";


export class GamePlateAppearance extends GameFlowBase {
    constructor(System){
        super(System);
    
    }
    start(){
        this.circleCollishion = new  CircleCollision(this.system.p);

        this.circleCollishion.radius = 15;
        this.ThrowBaseball();

        

        
  
    }
    ThrowBaseball(){
  
        console.log("開始投球");
        this.system.baseball.isActive = true;
     
        let randomX = this.system.p.random(-50, 50);
        let randomY = this.system.p.random(-75, 75);
        this.circleCollishion.position.x = 550 + randomX/2;
        this.circleCollishion.position.y = 550 + randomY;
        this.StrikeZonePoint = {
            x: 550 ,
            y: 550
        }
        this.system.ballCurveEffect.do(
            [
                { x: this.StrikeZonePoint.x-10, y: this.StrikeZonePoint.y-200 },
                { x: this.StrikeZonePoint.x +randomX, y:  this.StrikeZonePoint.y -130 + randomY },
                { x: this.StrikeZonePoint.x +randomX/2, y:  this.StrikeZonePoint.y +randomY },
                { x: this.StrikeZonePoint.x -randomX, y:  this.StrikeZonePoint.y +150 +randomY}
            ],
            (x,y,t) =>{

                this.circleCollishion.draw();
                if(this.circleCollishion.checkCollisionWithLine(this.system.baseball.position.x, this.system.baseball.position.y ,x,y)){
                    if(this.system.bat.checkCollide([this.system.baseball.body])){
                        
                        this.system.ballCurveEffect.isActive = false;
                        this.onHitBaseball = false;
                     
                        this.HitBaseball({x , y} , t ,  this.system.ballCurveEffect.getSpeed() );

                    }   
                }
                this.system.baseball.position.x = x;
                this.system.baseball.position.y = y;
                this.system.baseball.scale.x = 0.1+ t*1.2;
                this.system.baseball.scale.y = 0.1+ t*1.2;
                
            },
            ()=>{

                this._onSkipTheBall();
            }
            ,
            0.0001,
            0.0001
        ); 
    }

    RandomPoint(batSpeed , hitpoint ,size ){

        let randomPoints = [];
        let type = BaseballPlay.HOME_RUN;
        let endSize = 0;
        randomPoints.push({x: hitpoint.x, y: hitpoint.y});
        randomPoints.push({x: hitpoint.x, y: hitpoint.y });
        randomPoints.push({x: hitpoint.x, y: hitpoint.y });
        if(batSpeed > 0.5){   // home run
            randomPoints.push({x: hitpoint.x, y: hitpoint.y });
            let randomX = this.system.p.random(-200, 200);
            let randomY = this.system.p.random(350, 450);
            randomPoints[1].y = hitpoint.y - randomY;
            randomPoints[1].x = hitpoint.x + randomX/2;
            randomPoints[2].y = hitpoint.y- randomY - randomY/3;
            randomPoints[2].x = hitpoint.x + randomX;
            randomPoints[3].y = hitpoint.y- randomY - randomY/5;
            randomPoints[3].x = hitpoint.x + randomX + randomX/2;
            type = BaseballPlay.HOME_RUN;
            endSize =0;
        }else if(batSpeed > 0.1){  //一般安打
            randomPoints.push({x: hitpoint.x, y: hitpoint.y });
            let randomX = this.system.p.random(-300, 300);
            let randomY = this.system.p.random(100, 350);
            randomPoints[1].y = hitpoint.y - randomY;
            randomPoints[1].x = hitpoint.x + randomX/2;
            randomPoints[2].y = hitpoint.y- randomY - randomY/3;
            randomPoints[2].x = hitpoint.x + randomX;
            randomPoints[3].y = hitpoint.y- randomY - randomY/5;
            randomPoints[3].x = hitpoint.x + randomX + randomX/3;
            type = BaseballPlay.BASE_HIT;
            endSize =size*0.1;

        }else {  //滾地球

     
            let randomX = this.system.p.random(-300, 300);
            let randomY = this.system.p.random(30, 150);
            randomPoints[1].y = hitpoint.y - randomY;
            randomPoints[1].x = hitpoint.x + randomX/2;
            randomPoints[2].y = hitpoint.y + randomY;
            randomPoints[2].x = hitpoint.x + randomX;
            endSize =size*0.5;

            type = BaseballPlay.GROUND_BALL;

        }
        return {
            randomPoints: randomPoints,
            speed: batSpeed,
            type: type,
            endSize: endSize
        };
        
    }

    HitBaseball(hitPoint , size ,startVelocity ){  
        console.log("擊球");
        
        this.midPoint = {
            x: this.system.baseball.position.x,
            y: this.system.baseball.position.y
        }
    
        let randomPoints = this.RandomPoint(2, hitPoint , size);
        console.log("擊球點", randomPoints.endSize);
        this.system.ballCurveEffect.do(
            randomPoints.randomPoints,
            (x,y,t) =>{
    
                this.system.baseball.position.x = x;
                this.system.baseball.position.y = y;
                
                let remap = this.system.p.map(t, 0, 1, size, randomPoints.endSize);
                this.system.baseball.scale.x = remap;
                this.system.baseball.scale.y =  remap;
            
            },
            ()=>{
             
                this._onHitTheBall();
            }
            ,
            startVelocity+randomPoints.speed/2000,
            0
        ); 
    }
    _onHitTheBall(){
        this.next();
    }
    _onSkipTheBall(){
        this.next();
    }
    update(){
        this.system.p.fill(0, 0, 0 , 0);
        this.system.p.stroke(255, 0, 0);
        this.system.p.strokeWeight(2);
        this.system.p.rect(this.StrikeZonePoint.x -80/2,this.StrikeZonePoint.y - 120/2, 80, 120);
    }

    next(){
        this.system.changeState(new GamePlateAppearance(this.system));
    }

}