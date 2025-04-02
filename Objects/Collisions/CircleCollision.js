import {ICollision} from "./ICollision.js"


export class CircleCollision extends ICollision {
  constructor(p, radius) {
    super(p);
    this.p = p;
    this.radius = radius;
  }

  checkCollision(x, y) {//實測下來應該是不需要減去半徑
    return this.p.collidePointCircle(x, y, this.position.x , this.position.y , this.radius * 2);
  }
  checkCollisionWithLine(x1, y1, x2, y2) {
    return this.p.collideLineCircle(
      x1, y1, 
      x2, y2,   
      this.position.x,  this.position.y, 
      this.radius * 2 
    );
  }

  checkCollisionWithMouse() {
    return this.p.collidePointCircle(this.p.mouseX, this.p.mouseY,  this.position.x - this.radius, this.position.y - this.radius, this.radius * 2);
  }

  checkCollisionWithCircle(circleCollision){
    return this.p.collideCircleCircle(
      this.position.x - this.radius, this.position.y - this.radius, this.radius * 2,
      circleCollision.position.x - circleCollision.radius, circleCollision.position.y - circleCollision.radius, circleCollision.radius * 2
      );
  }

  checkCollisionWithRect(rectCollision){
    return this.p.collideCircleRect(
      rectCollision.position.x - rectCollision.width / 2,rectCollision.position.y - rectCollision.height / 2,rectCollision.width,rectCollision.height,
      this.position.x - this.radius, this.position.y - this.radius, this.radius * 2
    )
  }

  _on_draw(){
    this.p.fill(200, 0, 200,100);

    this.p.ellipse(0, 0, this.radius, this.radius);
  }
}
