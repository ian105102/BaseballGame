
/*
    處理3d物件到2d畫布的繪製
    這個類別會將3D物件繪製到2D畫布上
    這樣可以在2D畫布上顯示3D物件
    這個類別會使用p5.js的createGraphics()函數來創建一個3D畫布
    然後使用p5.js的image()函數將3D畫布上的圖像顯示到2D畫布上
    這樣可以在2D畫布上顯示3D物件
    
*/
export class ThreeDtoTwoD{     
    constructor(p, sizeX,sizeY , model){
      
        this.p = p;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.pg = p.createGraphics(sizeX, sizeY, p.WEBGL); 
        this.batModel = model;
        this.pg.model(model);
     
    }
    display(position ,rotate ,rotateCenter ,color, translate ){
      
        this.pg.push();
       
        this.pg.rotateX(rotate.x); // 旋轉模型
        this.pg.rotateY(rotate.y); // 旋轉模型
        this.pg.rotateZ(rotate.z); // 旋轉模型
        this.pg.translate(rotateCenter.x, rotateCenter.y, rotateCenter.z); 
        this.pg.translate(translate.x, translate.y, translate.z);
        
        this.pg.clear();
        this.pg.fill(color);
        this.pg.noStroke();
        this.pg.model(this.batModel);
        this.pg.pop();
        // 顯示 3D 畫布上的圖像
        
        this.p.image(this.pg, position.x - this.sizeX/2, position.y - this.sizeY/2,this.sizeX ,this.sizeY); 

    }
}