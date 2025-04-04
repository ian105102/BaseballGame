import { HEIGHT, WIDTH } from "../../../G.js";

export class ObjEffect {
    #name = "CircleEffect";
    getname(){
        return this.#name;
    }
    constructor(p , obj){
        this.p = p;
        this.obj = obj;
        this.obj.radius = 20;
        this.obj.position.set(WIDTH/2, HEIGHT/2);
    }
    *FadeIn() {
        console.log("FadeIn");
        for (let i = 0; i <= 20; i++) {
            this.obj.scale.set(i*3, i*3);

            yield;
        }
    }
    
    *FadeOut() {
        console.log("FadeOut");
        let size = 0;
        for (let i = 0; i <= 20; i++) {
            size = 20 - i;
            this.obj.scale.set(size*3, size*3);
            yield;
        }
    }
 
}
