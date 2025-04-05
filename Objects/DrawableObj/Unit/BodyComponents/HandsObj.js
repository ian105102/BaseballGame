/*
    處理手部位置的類別
    這個類別會處理手部位置的更新

*/
import { IObject } from "../../../IObject.js";
export class Hands extends IObject {
    constructor(p) {
        super(p);
        this.p = p;
        this.position = p.createVector(0, 0);
        this.relLeft = this.p.createVector(0, 0);
        this.relRight = this.p.createVector(0, 0);
    }
    getrelLeft() {
        let x = this.relLeft.x + this.position.x;
        let y = this.relLeft.y + this.position.y;
        return this.p.createVector(x, y);

     
    }
    getrelRight() {
        
        let x = this.relRight.x + this.position.x;
        let y = this.relRight.y + this.position.y;
        return this.p.createVector(x, y);
    }

    setPosition(x, y) {
        
        this.position.x = x;
        this.position.y = y;

    }

    setLeftHandPosition(x, y) {
        this.relLeft.x = x;
        this.relLeft.y = y;
    }

    setRightHandPosition(x, y) {
        this.relRight.x = x;
        this.relRight.y = y;
    }

    drawRightHandsItem(x, y) {

    }

    drawLeftHandsItem(x, y) {
     
    }

    drawLeftHand() {
        this.p.fill("rgb(0, 0, 0)");
        this.p.ellipse( 0 + this.relLeft.x,  0 + this.relLeft.y, 30, 30);
    }

    drawRightHand() {
        this.p.fill("rgb(0, 0, 0)");
        this.p.ellipse( 0 + this.relRight.x, 0 + this.relRight.y, 30, 30);
    }

    _on_draw() {
     
        this.drawLeftHand();
        this.drawLeftHandsItem(this.relLeft.x,this.relLeft.y);
        this.drawRightHand();
        this.drawRightHandsItem(this.relRight.x, this.relRight.y);
    }
}