
import { GameFlowBase } from "./GameFlowBase.js";
import { CircleCollision } from "../../Objects/Collisions/CircleCollision.js";
import { BaseballPlay } from "../../BaseballPlayEnum.js";
import { WaitTimer } from "../../Objects/Utils/GeneratorManager.js";
import { RectangleCollision } from "../../Objects/Collisions/RectangleCollision.js";
import { GameChangeBatter } from "./GameChangeBatter.js";
import { SceneManager } from "../../SceneManager.js";
import { SceneEnum } from "../../SceneEnum.js";
import { WIDTH } from "../../G.js";



export class GameHitBall extends GameFlowBase {
    constructor(System){
        super(System);
        this.isSwingbat = false;
        this.isHitBaseball = false;
        this.isBadBall = false;
        this.isRollingBall = false;
        this.hitType = BaseballPlay.NONE;
   
    }
    start(){
       
        this.centerPoint = { x:  WIDTH / 2+5, y: 550 };
        this.circleCollishion = new  CircleCollision(this.system.p);
        this.rectangleCollishion = new  RectangleCollision(this.system.p);

        this.rectangleCollishion.width = 60;
        this.rectangleCollishion.height = 100;
        this.rectangleCollishion.position.x =  this.centerPoint.x;
        this.rectangleCollishion.position.y =  this.centerPoint.y;
        this.rectangleCollishion.isActive = true;

        this.rectangleCollishionBig = new  RectangleCollision(this.system.p);
        this.rectangleCollishionBig.width = 120;
        this.rectangleCollishionBig.height = 180;
        this.rectangleCollishionBig.position.x =  this.centerPoint.x;
        this.rectangleCollishionBig.position.y =  this.centerPoint.y;
        this.rectangleCollishionBig.isActive = true;

        this.timer = new WaitTimer();
        this.circleCollishion.radius = 15;
        this.StrikeZonePoint = { x: this.centerPoint.x, y: this.centerPoint.y };
        this.system.GeneratorManager.start(this.wait());
  
    }
    *wait(){

        yield* this.timer.delay(2000);
        this.ThrowBaseball();
    }
    ThrowBaseball() {
      
        this.system.baseball.isActive = true;
        const { baseball, bat, ballCurveEffect, p } = this.system;
        // 隨機變化投球位置
        const randomX = p.random(-60, 60);
        const randomY = p.random(-90, 90);
        // 設置碰撞區域位置
        this.circleCollishion.position.set(
            this.StrikeZonePoint.x + randomX / 2,
            this.StrikeZonePoint.y + randomY
        );
        // 設置棒球初始位置
        baseball.position.set(
            this.StrikeZonePoint.x - 10,
            this.StrikeZonePoint.y - 200
        );
        baseball.scale.set(0, 0);
     
        this.system.hitPointUi.position.set(
            this.StrikeZonePoint.x + randomX / 2,
            this.StrikeZonePoint.y + randomY 
        );
        this.system.hitPointUi.isActive = true;
        // 判斷是否為壞球
        this.isBadBall = !this.rectangleCollishion.checkCollisionWithCircle(
            this.circleCollishion
        );


        ballCurveEffect.do(
            [
                { x: baseball.position.x, y: baseball.position.y },
                { x: this.StrikeZonePoint.x + randomX, y: this.StrikeZonePoint.y - 130 + randomY },
                { x: this.StrikeZonePoint.x + randomX / 2, y: this.StrikeZonePoint.y + randomY }, // 這裡是擊球點
                { x: this.StrikeZonePoint.x - randomX, y: this.StrikeZonePoint.y + 150 + randomY }
            ],
            (x, y, t) => this._updateBaseballPosition(x, y, t, baseball, bat, ballCurveEffect),
            () => this._onSkipTheBall(),
            0.0002,
            0.0001
        );
    }
    *ScreenShake(){
        this.system.gameCanva.classList.add('shake');
        yield* this.timer.delay(40);
        this.system.gameCanva.classList.remove('shake');
    }
    
    _updateBaseballPosition(x, y, t, baseball, bat, ballCurveEffect) {
        this.circleCollishion.draw();
        this.rectangleCollishion.checkCollision();
        
        // 判斷棒球是否到達指定位置
        const collisionDetected = this.circleCollishion.checkCollisionWithLine(
            baseball.position.x, baseball.position.y, x, y
        ); 


        const batHitDetected = bat.checkCollide([baseball.body]);
      
        const checkSwing = this.rectangleCollishionBig.checkCollision(baseball.position.x, baseball.position.y) && batHitDetected;

        if (collisionDetected && batHitDetected) {
            ballCurveEffect.isActive = false;
            this.isHitBaseball = true;
            this.HitBaseball({ x, y }, baseball.scale.x, ballCurveEffect.getSpeed());
            this.system.GeneratorManager.start(this.ScreenShake());
        }
        
        if (checkSwing ) {  //之後要加上速度判斷
            this.isSwingbat = true;
          
        }
        
        baseball.position.set(x, y);
        baseball.scale.set(0.1 + t * 1.2, 0.1 + t * 1.2);
    }

    RandomPoint(batSpeed , hitpoint ,size ){

        let randomPoints = [];
        let type = BaseballPlay.HOME_RUN;
        let endSize = 0;
        randomPoints.push({x: hitpoint.x, y: hitpoint.y});
        randomPoints.push({x: hitpoint.x, y: hitpoint.y });
        randomPoints.push({x: hitpoint.x, y: hitpoint.y });
        if(batSpeed > 0.5){   // home run
            this.hitType = BaseballPlay.HOME_RUN;
      
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

            this.isRollingBall = false;
            
        }else if(batSpeed > 0.1){  //一般安打

            this.hitType = BaseballPlay.BASE_HIT;
            randomPoints.push({x: hitpoint.x, y: hitpoint.y });
            let randomX = this.system.p.random(-300, 300);
            let randomY = this.system.p.random(150, 300);
            randomPoints[1].y = hitpoint.y - randomY;
            randomPoints[1].x = hitpoint.x + randomX/2;
            randomPoints[2].y = hitpoint.y- randomY - randomY/3;
            randomPoints[2].x = hitpoint.x + randomX;
            randomPoints[3].y = hitpoint.y- randomY - randomY/5;
            randomPoints[3].x = hitpoint.x + randomX + randomX/3;
            type = BaseballPlay.BASE_HIT;
            endSize =size*0.1;


            this.system.point +=1;
        }else {  //滾地球

            this.hitType = BaseballPlay.GROUND_BALL;
            let randomX = this.system.p.random(-300, 300);
            let randomY = this.system.p.random(30, 150);
            randomPoints[1].y = hitpoint.y - randomY;
            randomPoints[1].x = hitpoint.x + randomX/2;
            randomPoints[2].y = hitpoint.y + randomY;
            randomPoints[2].x = hitpoint.x + randomX;
            endSize =size*0.5;

            type = BaseballPlay.GROUND_BALL;
            this.system.point +=3;
        }
        return {
            randomPoints: randomPoints,
            speed: batSpeed,
            type: type,
            endSize: endSize
        };
        
    }

    HitBaseball(hitPoint , size ,startVelocity ){  


        let randomPoints = this.RandomPoint(2, hitPoint , size); // 這裡輸入從arduino接收的速度
        this.CalculateScore();
        this.midPoint = {
            x: this.system.baseball.position.x,
            y: this.system.baseball.position.y
        }
    
     
     
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
                this.system.baseball.isActive = false;
                this._onHitTheBall();
            }
            ,
            startVelocity+randomPoints.speed/5000,
            0
        ); 
    }
    _onHitTheBall(){
     
        this.system.baseball.isActive = false;
        this.system.GeneratorManager.start(this.next());
    }
    _onSkipTheBall(){
        this.CalculateScore();
        this.system.baseball.isActive = false;
        this.system.GeneratorManager.start(this.next());
    }
    judge(ballType){
     
        if(ballType == BaseballPlay.GROUND_BALL){
            this.system.ResultShowtext.text = "滾地球!";
            return; 
        }
        if(ballType == BaseballPlay.HOME_RUN){
            this.system.ResultShowtext.text = "全壘打!";
            return; 
        }
        if(ballType == BaseballPlay.BASE_HIT){
            this.system.ResultShowtext.text = "安打!";
            return; 
        }
        return; 
    }
    CalculateScore(){
        this.system.ResultShowtext.isActive = true;
        console.log(this.isSwingbat , this.isHitBaseball , this.isBadBall);
        console.log(this.hitType);
        if(this.isBadBall && this.isHitBaseball){
            console.log("壞球擊中");
            this.judge(this.hitType);
            return;
        }
        if(this.isHitBaseball){
            console.log("擊球成功");
            this.judge(this.hitType);
            return;
        }
        if(this.isSwingbat){
            console.log("好球");
            this.system.strikePoint++;
            this.system.ResultShowtext.text = "好球!";
            return;
        }
        if(this.isBadBall){
            console.log("壞球");
            this.system.ResultShowtext.text = "壞球!";
            this.system.ballPoint++;
        }else{
            console.log("好球");
            this.system.ResultShowtext.text = "好球!";
            this.system.strikePoint++;
        }
    }
    *next(){
        this.system.hitPointUi.isActive = false;
        const AtBatOver = this.AtBatOver(this.isHitBaseball , this.isRollingBall);
        if(AtBatOver == 1){

            this.system.scoreboard.setCounts(this.system.strikePoint, this.system.ballPoint, this.system.outPoint , this.system.point);
            yield* this.timer.delay(2000);
            this.system.changeState(new GameChangeBatter(this.system));
            this.system.ResultShowtext.isActive = false;

            return;
        }
        if(AtBatOver == 2){
            this.system.scoreboard.setCounts(this.system.strikePoint, this.system.ballPoint, this.system.outPoint , this.system.point);
            yield* this.timer.delay(2000);
            this.system.ResultShowtext.isActive = false;
            SceneManager.instance.changeScene(SceneEnum.SCORE);
 
            return;
        }
        this.system.scoreboard.setCounts(this.system.strikePoint, this.system.ballPoint, this.system.outPoint , this.system.point);
        let nextwait = this.system.p.random(1000, 3000);
        yield* this.timer.delay(nextwait);
        this.system.ResultShowtext.isActive = false;
        this.system.changeState(new GameHitBall(this.system));
    }
    AtBatOver(ishit) {
     
        if(ishit){
       
            return 1;
        }
  
        if (this.system.strikePoint >= 3) {
            this.system.strikePoint = 0;
            this.system.ballPoint = 0;

            this.system.outPoint++;
            this.system.ResultShowtext.text = "OUT!";
            return 1; 
        }
        
        if (this.system.ballPoint >= 4) {
            this.system.strikePoint = 0;
            this.system.ballPoint = 0;
            this.system.point++;
  
            return 1;  
        }
        if (this.system.outPoint >= 3) {
            this.system.ResultShowtext.text = "OUT!";
            return 2; // 結束比賽
        }
        return 0; // 這位打者還沒結束打擊
    }
    update(){

    }

}