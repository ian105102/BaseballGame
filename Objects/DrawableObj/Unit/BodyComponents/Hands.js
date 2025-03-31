/*
    處理手部位置的類別
    這個類別會處理手部位置的更新

*/
class Hands extends IObject {
    constructor(p) {
        super(p);
        this.p = p;
        this.relLeft = this.p.createVector(0, 0);
        this.relRight = this.p.createVector(0, 0);
    }

    setPosition(x, y) {
        this.position.set(x, y);
    }

    setLeftHandPosition(x, y) {
        this.relLeft.set(x, y);
    }

    setRightHandPosition(x, y) {
        this.relRight.set(x, y);
    }

    drawRightHandsItem() {
        this.p.fill(0, 255, 0);
        this.p.ellipse( 0+ this.relRight.x, 0 + this.relRight.y, 70, 10);
    }

    drawLeftHandsItem() {
        this.p.fill(0, 255, 0);
        this.p.ellipse( 0+ this.relLeft.x, 0+ this.relLeft.y, 70, 10);
    }

    drawLeftHand() {
        this.p.fill(0, 255, 0);
        this.p.ellipse( 0 + this.relLeft.x,  0 + this.relLeft.y, 20, 20);
    }

    drawRightHand() {
        this.p.fill(0, 255, 0);
        this.p.ellipse( 0 + this.relRight.x, 0 + this.relRight.y, 20, 20);
    }

    display() {
     
        this.drawLeftHand();
        this.drawLeftHandsItem();
        this.drawRightHand();
        this.drawRightHandsItem();
    }
}