// sketch.js


import { SceneManager } from "./SceneManager.js"
import { WIDTH } from "./G.js"
import { HEIGHT } from "./G.js"
import poseTracker from './detection.js';

import{AssetLoader }from './AssetLoader.js';

const main_sketch = (p)=>{
    /// <reference types="p5" />
    //const game_scene = new GameScene(p)
    let scene_manager; 
    p.setup = () =>{
        let assetLoader = new AssetLoader(p);
        assetLoader.loadAssets([
            { type: 'model', url: './Asset/3dObject/BaseballBat.obj' },
  
        ]);

      

        p.is_left_pressing = false
        p.is_right_pressing = false

        p.is_first_left_pressing = false
        p.is_first_right_pressing = false
    
        p.createCanvas(WIDTH, HEIGHT);


      
        p.window_width = WIDTH
        p.window_height = HEIGHT
     
        // 確認資源加載完成後在執行遊戲
        scene_manager = new SceneManager(p)
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

