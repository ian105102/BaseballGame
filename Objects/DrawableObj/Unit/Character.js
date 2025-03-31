
class Character{
    constructor( centerx, centery){
        
        this.x = centerx;
        this.y = centery;
        this.hands = new hands(centerx, centery);
        
    }

    setPosition(x, y) {
    
        this.x = x;
        this.y = y;
        this.hands.setPosition(x, y);
    }
    drawBody(){
     
        fill(255, 0, 0);
        ellipse(this.x, this.y, 90, 90);
    }


    display(){
        this.hands.display();
        this.drawBody();
    
    }

}