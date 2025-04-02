import { GameFlowBase } from "./GameFlowBase.js";
import { GamePlateAppearance } from "./GamePlateAppearance.js";
import { WaitTimer } from "../../Objects/Utils/GeneratorManager.js";

export class GameCountdown extends GameFlowBase {
    constructor(System){
        super(System);
        this.timer = new WaitTimer();
    }
    start(){
        this.system.GeneratorManager.start(this.countdown());
 
    }
    *countdown() {
        console.log("倒數開始...");
        for (let i = 3; i > 0; i--) {
          console.log(i);
          this.system.countdownText.text = i.toString(); 
          yield* this.timer.delay(1000); 
        }
      
        this.system.countdownText.isActive = false;
        console.log("開始遊戲");
        this.system.changeState(new GamePlateAppearance(this.system));
      }
      

}