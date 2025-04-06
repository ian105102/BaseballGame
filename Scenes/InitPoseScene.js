import { IScene } from "./IScene.js";

import { BackImage } from "../Objects/DrawableObj/ui/BackImage.js";

import { HEIGHT, WIDTH } from "../G.js";
import { PoseTracker } from "../PoseTracker.js";


export class InitPoseScene extends IScene {
  static instance = null;

  constructor(p) {
    if (InitPoseScene.instance) {
      return InitPoseScene.instance;
    }
    super(p);
    InitPoseScene.instance = this;
    
    this.init();

  }



  init() {
    this.poseTracker = PoseTracker.getInstance(this.p);
    this.video = this.poseTracker.video;
    this.poseTracker.needVideo = true; 
    this.Videimg = new BackImage(this.p, this.video);
    this.Videimg.isMirror = true; // 鏡像翻轉
    this.Videimg.img = this.video;
    this.Videimg.position.x = WIDTH / 2;
    this.Videimg.position.y = HEIGHT / 2;
    this.Videimg.size.x = 1080;
    this.Videimg.size.y = 720;
    InitPoseScene.instance.add(this.Videimg);
  }


  OnStop() {
    this.poseTracker.needVideo = false; 
  }

}