
export class PoseTracker {
  static #instance;
  #pose;
  #smoothLeftHand = { x: 0, y: 0 };
  #smoothRightHand = { x: 0, y: 0 };
  #lerpFactor = 0.1; 

  constructor(p) {
    if (PoseTracker.#instance) {
      return PoseTracker.#instance;
    }
    PoseTracker.#instance = this;
    this.#pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    this.#lerpFactor = 0.5;
    this.setOptions({
      modelComplexity: 0,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });
    this.p = p;
    this.width = 1080;
    this.height = 720;
    this.video = this.p.createCapture(this.p.VIDEO)
    .size(1080, 720)
    .hide();
    this.detections_pose = [];
    this.#pose.onResults((results) => this.gotPose(results));
    this.OnGetPose = function (results) {};
    this.needVideo = false;
    this.flippedGraphics = this.p.createGraphics(this.width,  this.height);
    this.myCamera = new Camera(this.video.elt, {
      onFrame: async () => {
          if (!this.needVideo) return;
  
          this.flippedGraphics.push();
          this.flippedGraphics.translate(this.width, 0); 
          this.flippedGraphics.scale(-1, 1);         
          this.flippedGraphics.image(this.video, 0, 0,  this.width , this.height);
          this.flippedGraphics.pop();
  
          // 把鏡像後的畫面傳送給 poseTracker
          await this.send(this.flippedGraphics.canvas);
      },
      width:  this.width,
      height:  this.height
  }).start(); 

  }


  setOptions(options) {
    this.#pose.setOptions(options);
  }

  async send(image) {
    await this.#pose.send({ image });
  }

  gotPose(results) {
    this.detections_pose = results.poseLandmarks || [];
    this.OnGetPose(results);
  }

  customLerp(a, b, t) {
    return a + (b - a) * t;
  }

  getHandToShoulderDistances(userDefinedZ = 1) {
    let leftShoulder = this.detections_pose[11] ?? null;
    let rightShoulder = this.detections_pose[12] ?? null;
    let leftWrist = this.detections_pose[15] ?? null;
    let rightWrist = this.detections_pose[16] ?? null;

    let leftRelative = { x: 0, y: 0 };
    let rightRelative = { x: 0, y: 0 };

    if (!leftShoulder || !rightShoulder || !leftWrist || !rightWrist) {
      return { leftHand: this.#smoothLeftHand, rightHand: this.#smoothRightHand };
    }

    let shoulderCenter = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2
    };

    leftRelative = {
      x: (leftWrist.x - shoulderCenter.x) * userDefinedZ,
      y: (leftWrist.y - shoulderCenter.y) * userDefinedZ
    };
    rightRelative = {
      x: (rightWrist.x - shoulderCenter.x) * userDefinedZ,
      y: (rightWrist.y - shoulderCenter.y) * userDefinedZ
    };

    this.#smoothLeftHand.x = this.customLerp(this.#smoothLeftHand.x, leftRelative.x, this.#lerpFactor);
    this.#smoothLeftHand.y = this.customLerp(this.#smoothLeftHand.y, leftRelative.y, this.#lerpFactor);
    this.#smoothRightHand.x = this.customLerp(this.#smoothRightHand.x, rightRelative.x, this.#lerpFactor);
    this.#smoothRightHand.y = this.customLerp(this.#smoothRightHand.y, rightRelative.y, this.#lerpFactor);

    return {
      leftHand: this.#smoothLeftHand,
      rightHand: this.#smoothRightHand
    };
  }

  static getInstance(p) {
    if (!PoseTracker.#instance) {
    
      new PoseTracker(p); // 實例會自動賦值給 #instance
    }
    return PoseTracker.#instance;
  }

}

