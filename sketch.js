// sketch.js


import { SceneManager } from "./SceneManager.js"
import { WIDTH } from "./G.js"
import { HEIGHT } from "./G.js"

import { SoundManager } from './AudioController/SoundManager.js';


import {PoseTracker} from "./PoseTracker.js";
const main_sketch = (p)=>{
    /// <reference types="p5" />
    //const game_scene = new GameScene(p)
    const assets = {};
    // p.preload = () => {

    //   };
    let soundManager;
    let scene_manager; 
    p.setup = () =>{

        PoseTracker.getInstance(p);
        assets.bgImg = p.loadImage("static/baseballGround.png");
        assets.playball = p.loadImage("static/ground3.png ");
        assets.ballImg = p.loadImage("static/ball.png");
        assets.gloveImg = p.loadImage("static/glove.png");
        assets.bgGrass = p.loadImage("static/grass.png");
        assets.tv = p.loadImage("static/TV.png");
        assets.batter = p.loadImage("static/batter.png");
        assets.mask = p.loadImage("static/mask.png");
        assets.jfFont = p.loadFont("Font/jf-openhuninn-2.1.ttf");
        assets.BGResult = p.loadImage("static/BGResult.png");
        assets.trophy = p.loadImage("static/trophy.png");
        assets.bat = p.loadImage("static/bat.png");
        assets.pinkCap = p.loadImage("static/pinkCap.png");
        assets.home = p.loadImage("static/home.png");
        assets.joystick = p.loadImage("static/joystick.png");
        assets.mvp = p.loadImage("static/MVP.png");
        assets.Baseball = p.loadImage("static/Baseball.png")
        soundManager = new SoundManager(p); // ⬅ 傳入 p5 實例
        soundManager.loadSounds();
        p.is_left_pressing = false
        p.is_right_pressing = false

        p.is_first_left_pressing = false
        p.is_first_right_pressing = false
    
        let canva =  p.createCanvas(WIDTH, HEIGHT);
        canva.class("GameCanvas");

      
        p.window_width = WIDTH
        p.window_height = HEIGHT

        p.frameRate(60); // 設定為每秒 60 幀
     
        // 確認資源加載完成後在執行遊戲
        // 把preload assets傳入Scene
        scene_manager = new SceneManager(p,assets)
    }
    
    p.draw = () =>{
        p.background(220);
        

        SceneManager.instance.update(0.1)
        SceneManager.instance.draw()

        p.handleInput()
        
    }
    p.handleInput = () => {
        p.is_first_left_pressing = false
        p.is_first_right_pressing = false
    }


    p.mousePressed = () => {
        if (SceneManager.instance.currentScene?.mousePressed) {
            SceneManager.instance.currentScene.mousePressed();
          }
        if (p.mouseButton === p.LEFT) {
            if(!p.is_left_pressing){
                p.is_first_left_pressing = true
                console.log("first pressing!")
            }

            p.is_left_pressing = true
            
            
            


        } else if (p.mouseButton === p.RIGHT) {
            if(!p.is_right_pressing){
                p.is_first_right_pressing = true
            }else{
                p.is_first_right_pressing = false
            }
            p.is_right_pressing = true
            
            
            
        }
    }
    
    p.mouseReleased = () => {
        if (p.mouseButton === p.LEFT) {
            p.is_left_pressing = false
            p.is_first_left_pressing = false

        } else if (p.mouseButton === p.RIGHT) {
            p.is_right_pressing = false
            p.is_first_right_pressing = false
        }
    }

    //pressed function is broken so I'm not gonna use it :)
    
}

new p5(main_sketch)

