import { GameFlowBase } from "./GameFlowBase.js";
import { GameHitBall } from "./GameHitBall.js";
import { WaitTimer } from "../../Objects/Utils/GeneratorManager.js";

export class GameCountdown extends GameFlowBase {
    constructor(System){
        super(System);
        this.timer = new WaitTimer();
    }
    start(){
        this.system.countdownText.isActive = true;
        this.system.GeneratorManager.start(this.countdown());
 
    }
    *countdown() {
        console.log("倒數開始...");
        this.system.soundManager.playWhenReady("button2", "play");
        for (let i = 3; i > 0; i--) {
          console.log(i);
          this.system.countdownText.text = i.toString(); 
        
          yield* this.timer.delay(1000); 
          this.system.soundManager.playWhenReady("button2", "play");

        }
      
        this.system.countdownText.isActive = false;
        console.log("開始遊戲");
        this.system.changeState(new GameHitBall(this.system));
      }
      

}