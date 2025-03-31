/*
    need p5 and matter.js
    HitboxItem 類別
    繼承自 Obj3d22d 類別
    用於處理 3D 模型的碰撞檢測
    使用 Matter.js 物理引擎來處理碰撞檢測
    這個類別會將 3D 模型轉換為 2D 碰撞檢測
    這個類別會使用 Matter.js 的 Bodies.rectangle() 函數來創建一個矩形的碰撞檢測
    這個類別會使用 Matter.js 的 Events.on() 函數來註冊碰撞事件
    這個類別會使用 Matter.js 的 Body.setPosition() 函數來設置碰撞檢測的位置
    這個類別會使用 Matter.js 的 Body.setAngle() 函數來設置碰撞檢測的角度
    這個類別會使用 Matter.js 的 Body.scale() 函數來設置碰撞檢測的大小
    這個類別會使用 Matter.js 的 World.add() 函數來將碰撞檢測添加到世界中
    這個類別會使用 Matter.js 的 Collision.collides() 函數來檢查碰撞
*/
import { ThreeDtoTwoD } from "../../utils/ThreeDtoTwoD.js";
import { IObject } from "../../IObject.js"
export class Hitbox3Ditem  extends IObject{
    #currentScaleX = 1;
    #currentScaleY = 1;
    constructor( p,centerX, centerY, sizeX, sizeY, model, world,engine, color = "#c6780a" , HitboxSizeX = 30 , HitboxSizeY = 200) {
        super(p);
    
        this.view3d = new ThreeDtoTwoD(p, sizeX, sizeY, model);
        this.centerX = centerX;
        this.centerY = centerY;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        
        this.rotateX = 0;
        this.rotateY = 0;
        this.rotateZ = 0;
        this.color = color;
        
        this.rotateCenter = { x: 0, y: 70, z: 0 };
        console.log("Hitbox3Ditem", HitboxSizeX, HitboxSizeY);
        // Matter.js hitbox
        this.body = Matter.Bodies.rectangle(this.centerX, this.centerY,HitboxSizeX, HitboxSizeY,
            { 
                isStatic: false ,
                isSensor: true , 
            }
        );
        Matter.Events.on(engine, 'collisionStart', this.onCollisionStart.bind(this));   // 註冊碰撞事件
        Matter.Body.setCentre(this.body, { x:centerX+0 , y:centerY -70}, false);
        Matter.Body.setPosition(this.body, { x: centerX , y: centerY  });
        Matter.World.add(world, this.body); 





    }
    onCollisionStart(event) {
        event.pairs.forEach(pair => {
            let hitbox, other;
            if (pair.bodyA === this.body) {
                hitbox = pair.bodyA;
                other = pair.bodyB;
            } else if (pair.bodyB === this.body) {
                hitbox = pair.bodyB;
                other = pair.bodyA;
            }
            if (hitbox) {
                this.handleCollision(hitbox, other);
            }
        });
    }
    // 當碰撞事件發生時的處理函數
    handleCollision(hitbox, otherBody) {
        console.log("HitboxItem 碰撞發生！", { hitbox, otherBody });
    }
    setPosition(x, y) {
        this.centerX = x;
        this.centerY = y;
        Matter.Body.setPosition(this.body, { x, y });
    }
    
    rotateEuler(x, y, z) {
        this.rotateX = x;
        this.rotateY = y;
        this.rotateZ = z;
        this.applyRotation(this.calculateDirectionFromEuler(x, y, z));
    }

    rotateQuaternion(x, y, z, w) {
        this.quaternion = { x, y, z, w };
        this.applyRotation(this.calculateDirectionFromQuaternion(x, y, z, w));
    }

    applyRotation({ dirX, dirY }) {
        let projectedLength = Math.hypot(dirX, dirY);
        Matter.Body.setAngle(this.body, 0);
        this.setScale(1, projectedLength);
        Matter.Body.setAngle(this.body, Math.atan2(dirY, dirX) - Math.PI / 2);
    }

    calculateDirectionFromEuler(x, y, z) {
        let cosX = Math.cos(x), sinX = Math.sin(x);
        let cosY = Math.cos(y), sinY = Math.sin(y);
        let cosZ = Math.cos(z + Math.PI / 2), sinZ = Math.sin(z + Math.PI / 2);

        return {
            dirX: cosY * cosZ,
            dirY: sinX * sinY * cosZ + cosX * sinZ,
            dirZ: cosX * sinY * cosZ - sinX * sinZ
        };
    }

    calculateDirectionFromQuaternion(x, y, z, w) {
        let xx = x * x, yy = y * y, zz = z * z;
        let xy = x * y, xz = x * z, yz = y * z;
        let wx = w * x, wy = w * y, wz = w * z;

        return {
            dirX: 1 - 2 * (yy + zz),
            dirY: 2 * (xy + wz),
            dirZ: 2 * (xz - wy)
        };
    }


    setScale(scaleX, scaleY) {
        let newScaleX = scaleX / this.#currentScaleX;
        let newScaleY = scaleY / this.#currentScaleY;
        Matter.Body.scale(this.body, newScaleX, newScaleY);
        this.#currentScaleX = scaleX;
        this.#currentScaleY = scaleY;
    }
    // Debug用
    // 繪製物體的邊界框
    drawHitbox() {
       
        const vertices = this.body.vertices;
     
        this.p.noFill();
        this.p.stroke(255, 0, 0);
        this.p.beginShape();
        for (let i = 0; i < vertices.length; i++) {
            this.p.vertex(vertices[i].x, vertices[i].y);
        }
        this.p.endShape(this.p.CLOSE);
    }
    _on_draw(){
      
        this.view3d.display({ x: this.centerX, y: this.centerY }, 
            { x: this.rotateX, y: this.rotateY, z: this.rotateZ },
            { x: this.rotateCenter.x, y: this.rotateCenter.y, z: this.rotateCenter.z },
            this.color, 
            { x: 0, y: 0, z: 0 });
        
        this.drawHitbox();
    }
    _on_update(delta){

    }

    /*
    檢查與其他物體的碰撞
    輸入: bodiesArray - 其他物體的陣列
    輸出: true - 碰撞發生
        false - 沒有碰撞
    */
    checkCollide(bodiesArray) {                                     
        for (let otherBody of bodiesArray) {
            // 過濾掉自身
            if (otherBody === this.body) continue;
            // 檢查碰撞
            let collision = Matter.Collision.collides(this.body, otherBody);
         
            if(collision === null ){
                continue;
            }else{
                return true;
            }

        }

        return false; // 沒有碰撞則回傳 false
    }
}