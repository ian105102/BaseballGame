export class IObject {
    constructor(p) {
      if (new.target === IObject) {
        throw new Error('Cannot instantiate an abstract class.');
      }
      this.p = p;
      this.position = p.createVector(0, 0);
      this.rotation3D = 0;
      this.scale = p.createVector(1, 1);
      this.isActive = true; // Default value for isActive , you can change it in derived classes
    }
    // Abstract methods


    _on_draw(){
        throw new Error('Abstract method _on_draw() must be implemented in derived class');

    }

    _on_update(delta){
        throw new Error('Abstract method _on_update() must be implemented in derived class');
    }
    
    draw() {
        if (!this.isActive) return;
        this.p.push()
        this.applyTransformations()
        this._on_draw()
        this.p.pop()
    }
  
    update(delta) {
      if(!this.isActive) return;
      this._on_update(delta)
    }

    
  
    // Example of a utility method using p5 functions
    applyTransformations() {
      this.p.translate(this.position.x, this.position.y);
      this.p.rotate(this.rotation3D);
      this.p.scale(this.scale.x, this.scale.y);
    }
  }