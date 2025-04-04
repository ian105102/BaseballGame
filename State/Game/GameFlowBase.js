export class GameFlowBase {
    constructor(System){
        if(new.target === GameFlowBase) {
            throw new Error('Cannot instantiate an abstract class.');
        }
        this.system = System;
 
    }
    start(){
        
    }

  
    update(delta){

    }

}