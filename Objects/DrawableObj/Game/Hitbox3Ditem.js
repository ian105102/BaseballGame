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
import { ThreeDtoTwoD } from "../../Utils/ThreeDtoTwoD.js";
import { IObject } from "../../IObject.js"
export class Hitbox3Ditem extends IObject {
    #currentScale = this.p.createVector(1, 1);

    constructor(p, model, world, engine, position= {x:0, y:0}, size = {x:400, y:400} ,color = "#c6780a", hitboxSize= {x:30, y:200}, rotateCenter = {x:0, y:70}) {
        super(p);
        this.p = p;
        this.view3d = new ThreeDtoTwoD(p, size, model);
        
        // 確保position是有效的對象
        if (!position || typeof position.x === 'undefined' || typeof position.y === 'undefined') {
            console.error("Invalid position provided");
            position = {x: 0, y: 0};
        }
        
        this.position = this.p.createVector(position.x, position.y);
        this.size = this.p.createVector(size.x, size.y);
        this.rotation3D = this.p.createVector(0, 0, 0);
        this.color = color;
        this.rotateCenter = this.p.createVector(rotateCenter.x, rotateCenter.y);
        
        console.log("Hitbox3Ditem", hitboxSize.x, hitboxSize.y);
        this.body = Matter.Bodies.rectangle(this.position.x, this.position.y, hitboxSize.x, hitboxSize.y, {
            isStatic: false,
            isSensor: true,
        });
        Matter.Body.setCentre(this.body, { x: this.position.x - rotateCenter.x, y: this.position.y - rotateCenter.y });
        Matter.Body.setPosition(this.body, { x: this.position.x, y: this.position.y });
        this.collisionHandler = this.onCollisionStart.bind(this);

        Matter.Events.on(engine, 'collisionStart', this.collisionHandler);
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

    handleCollision(hitbox, otherBody) {
        console.log("HitboxItem 碰撞發生！", { hitbox, otherBody });
    }

    setPosition(x, y) {
        this.position.set(x, y);
        Matter.Body.setPosition(this.body, { x:x, y:y });
    }
    
    rotateEuler(x, y, z) {
        this.rotation3D.set(x, y, z);
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
        let newScale = this.p.createVector(scaleX / this.#currentScale.x, scaleY / this.#currentScale.y);
        Matter.Body.scale(this.body, newScale.x, newScale.y);
        this.#currentScale.set(scaleX, scaleY);
    }

    drawHitbox() {
        const vertices = this.body.vertices;
        this.p.noFill();
        this.p.stroke(255, 0, 0);
        this.p.beginShape();
        for (let i = 0; i < vertices.length; i++) {
            this.p.vertex(vertices[i].x - this.position.x, vertices[i].y - this.position.y  );
        }
        this.p.endShape(this.p.CLOSE);
    }

    _on_draw() {
       
        this.view3d.display(this.position, this.rotation3D, this.rotateCenter, this.color, { x: 0, y: 0, z: 0 });
        this.drawHitbox();
    }

    _on_update(delta) {}

    checkCollide(bodiesArray) {
        for (let otherBody of bodiesArray) {
            if (otherBody === this.body) continue;
            let collision = Matter.Collision.collides(this.body, otherBody);
            if (collision !== null) {
                return true;
            }
        }
        return false;
    }
}
