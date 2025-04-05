import { GameFlowBase } from "./GameFlowBase.js";
import { WaitTimer } from "../../Objects/Utils/GeneratorManager.js";
import { GameHitBall } from "./GameHitBall.js";


export class GameChangeBatter extends GameFlowBase {
    constructor(System){
        super(System);
    }
    start(){
        this.timer = new WaitTimer();
        this.system.GeneratorManager.start(this.wait());
        
        

    }
    Init(){
        this.system.strikePoint = 0;
        this.system.ballPoint = 0;
        this.system.scoreboard.setCounts(0, 0,0);
        this.system.round++;
        this.system.scoreboard.setCounts(this.system.strikePoint, this.system.ballPoint, this.system.outPoint , this.system.point);
    }
    *wait(){
        yield * this.system.objEffect.FadeIn();
        console.log("等待下一位打者...");
        this.Init();

        this.system.changeState(new GameHitBall(this.system));
        yield  *this.system.objEffect.FadeOut(); 


    }



}