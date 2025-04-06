import {IObject} from "../../IObject.js"


export class Baseball extends IObject {

    constructor(p, world, hitboxSize, img) {
        super(p);

        this.img = img;
        this.hitboxSize = hitboxSize;

        this.body = Matter.Bodies.circle(
            this.position.x,
            this.position.y,
            Math.max(hitboxSize.x, hitboxSize.y) / 2,
            {
                isStatic: false,
                isSensor: true,
            }
        );
        Matter.World.add(world, this.body);
    }

    _on_update(delta) {
        // 同步物理位置與視覺位置
        Matter.Body.setPosition(this.body, {
            x: this.position.x,
            y: this.position.y,
        });
    }

    _on_draw() {
        const p = this.p;

        // 若圖片尚未載入，則不繪製
        if (!this.img) return;

        p.fill(0);
        p.noStroke();
        p.ellipse(0, 0, 70, 70);
    
        p.push();
        p.imageMode(p.CENTER);

        // 繪製圖片於 (0,0)，寬高由 hitboxSize 決定
        p.image(this.img, 0, 0,65,65);
        p.pop();
    }
}