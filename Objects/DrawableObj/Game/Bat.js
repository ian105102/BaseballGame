import { IObject } from "../../IObject.js"
import { RectangleCollision } from "../../Collisions/RectangleCollision.js"

export class Bat extends IObject{
    constructor(p){
        super(p)
        this.width = 100
        this.height = 400
        this.p = p
        this.collider = new RectangleCollision(this.p,this.width,this.height)
    }


    _on_update(delta){
        this.position = this.p.createVector(this.p.mouseX,this.p.mouseY)
        this.update_collider()
    }

    _on_draw(){
       
        this.p.rectMode(this.p.CENTER)
        this.p.fill(0,0,255,70)
        this.p.rect(0,0,this.width,this.height)
        if(this.isHovered){
            this._draw_on_hover()
        }
        if(this.isPressed){
            this._draw_on_pressed()
        }

    }

    update_collider(){
        this.collider.position = this.position
        this.collider.width = this.width
        this.collider.height = this.height
        this.collider.draw()
    }
}