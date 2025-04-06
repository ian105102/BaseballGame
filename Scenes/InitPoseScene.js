import { IScene } from "./IScene.js";


export class InitPoseScene extends IScene {
  static instance = null;

  constructor(p) {
    if (InitPoseScene.instance) {
      return InitPoseScene.instance;
    }
    super(p);

  }



  init() {

  }

  draw() {
   
  }

}