import { IScene } from "./IScene.js";
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js"

import { SceneEnum } from "../SceneEnum.js";
import { SceneManager } from "../SceneManager.js";

import { WIDTH } from "../G.js"
import { HEIGHT } from "../G.js"
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js";
export class MenuScene extends IScene{
    static instance = null

    constructor(p) {
        if (MenuScene.instance) {
            
            return MenuScene.instance
        }
        super(p);
        MenuScene.instance = this;
        MenuScene.instance.init()
        
    } 
    

    
    //call after constructor
    init(){
        let func =()=>{
            SceneManager.instance.changeScene(SceneEnum.TUTORIAL)
        }

        let go_tutorial_button = new RectButton(this.p,300,100,func)
        go_tutorial_button.position.x = 540
        go_tutorial_button.position.y = 360
        MenuScene.instance.add(go_tutorial_button)

        let text = new DrawableText(this.p,"棒球菜單介面",50)
        text.position.x = WIDTH / 2
        text.position.y = HEIGHT / 7
        MenuScene.instance.add(text)

    }
}