import { GameFlowBase } from "./GameFlowBase.js";


export class GamePlateAppearance extends GameFlowBase {
    constructor(System){
        super(System);
    }
    start(){
        this.system.GeneratorManager.start(this.Throwbaseball());
   
  
    }
    *Throwbaseball(){
        console.log("開始投球");
        this.system.baseball.isActive = true;
        this.system.ballCurveEffect.do(
            [
                { x: 540, y: 500 },
                { x: 500, y: 0 },
                { x: 520, y: 500 },
            ],
            (x,y,t) =>{
    
                this.system.baseball.position.x = x;
                this.system.baseball.position.y = y;
                this.system.baseball.scale.x =  t;
                this.system.baseball.scale.y =  t;
            
            }
            ); 
    }

  
    update(delta){

    }

}