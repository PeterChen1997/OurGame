/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global gEngine */

function NewSnake(kSnakeHead,kSnakeBody,xPos,yPos){
    this.mNewSnake=[];
    this.kSnakeHead = kSnakeHead;
    this.kSnakeBody=kSnakeBody;
    this.mLength=null;
    this.mTime=0;
    this.mDir=null;
    this.SNAKE_SIZE=5;
    this.DEFAULT_POS=[xPos,yPos];
    this.mTrace=[];
    this.mSpeed=null;
    this.mBorder={
        S:-60,
        N:60,
        E:100,
        W:-100
    };
    this.mEatNum=null;
}
var DIRECTION={
    N:4,
    S:3,
    E:2,
    W:1
};
NewSnake.prototype.getSnake=function(){return this.mNewSnake;};
NewSnake.prototype.getSnakeLen=function(){return this.mLength;};
NewSnake.prototype.initialize = function () {
    this.mSpeed=1;
    for(var i=0;i<this.mLength;i++){
            this.mNewSnake[i]=null;
    }
    this.mLength=5;
    this.mDir=DIRECTION.N;
    this.mNewSnake[0]=new TextureRenderable(this.kSnakeHead);
    this.mNewSnake[0].getXform().setPosition(this.DEFAULT_POS[0],this.DEFAULT_POS[1]);
    this.mNewSnake[0].getXform().setSize(this.SNAKE_SIZE,this.SNAKE_SIZE);
    this.mNewSnake[0].setColor([1,1,1,0]);
    for(var i=1;i<this.mLength;i++){
        this.mNewSnake[i]=new TextureRenderable(this.kSnakeBody);
        this.mNewSnake[i].getXform().setSize(this.SNAKE_SIZE,this.SNAKE_SIZE);
        this.mNewSnake[i].setColor([1,1,1,0]);
        this.mNewSnake[i].getXform().setPosition(this.mNewSnake[i-1].getXform().getXPos(),this.mNewSnake[i-1].getXform().getYPos()-this.mLength);
        
    }
    for(var i=0;i<this.mLength*gEngine.GameLoop.kFPS/this.mSpeed;i++){
        this.mTrace[i]=[this.mNewSnake[0].getXform().getXPos(),this.mNewSnake[0].getXform().getYPos()-i*this.SNAKE_SIZE*this.mSpeed/gEngine.GameLoop.kFPS];
        //console.log(this.mTrace[i][1]);
    }
    this.mEatNum=0;
    
        //this.updatePos();    

};
NewSnake.prototype.move=function(){
    var delta=this.SNAKE_SIZE*this.mSpeed/gEngine.GameLoop.kFPS;
        var xform=this.mNewSnake[0].getXform();
        if(this.mDir===DIRECTION.E){
            xform.setPosition(xform.getXPos()+delta,xform.getYPos());
            xform.setRotationInDegree(270);
        }
        if(this.mDir===DIRECTION.N){
            xform.setPosition(xform.getXPos(),xform.getYPos()+delta);
            xform.setRotationInDegree(0);
        }
        if(this.mDir===DIRECTION.S){
            xform.setPosition(xform.getXPos(),xform.getYPos()-delta);
            xform.setRotationInDegree(180);
        }
        if(this.mDir===DIRECTION.W){
            xform.setPosition(xform.getXPos()-delta,xform.getYPos());
            xform.setRotationInDegree(90);
        }
        for(var i=this.mLength*gEngine.GameLoop.kFPS/this.mSpeed-1;i>0;i--){
            this.mTrace[i]=this.mTrace[i-1];
        }
        for(var i=1;i<this.mLength;i++){
            this.mNewSnake[i].getXform().setPosition(this.mTrace[i*gEngine.GameLoop.kFPS/this.mSpeed][0],this.mTrace[i*gEngine.GameLoop.kFPS/this.mSpeed][1]);
        }
        this.mTrace[0]=[xform.getXPos(),xform.getYPos()];
        
        //for(var i=0;i<this.mLength;i++){
};
NewSnake.prototype.update=function(up,down,left,right){
    if (gEngine.Input.isKeyPressed(right)) {
        if(this.mDir!==DIRECTION.W){
            this.mDir=DIRECTION.E;            
        }
    }
    if (gEngine.Input.isKeyPressed(left)) {
        if(this.mDir!==DIRECTION.E){
            this.mDir=DIRECTION.W;
        }
    }
    if (gEngine.Input.isKeyPressed(up)) {
        if(this.mDir!==DIRECTION.S){
            this.mDir=DIRECTION.N;
        }
    }
    if (gEngine.Input.isKeyPressed(down)) {
        if(this.mDir!==DIRECTION.N){
            this.mDir=DIRECTION.S;
        }
    }
    if(gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)){
        this.eat(1);
    }
    this.move();
    if(this.deathCheck()){
        this.initialize();
    }
};

NewSnake.prototype.eat=function(num){
    for(var j=0;j<num;j++){
        for(var i=this.mLength*gEngine.GameLoop.kFPS/this.mSpeed;i<(this.mLength+1)*gEngine.GameLoop.kFPS/this.mSpeed;i++){
            this.mTrace[i]=[this.mNewSnake[this.mLength-1].getXform().getXPos(),this.mNewSnake[this.mLength-1].getXform().getYPos()];
            //console.log(this.mTrace[i][1]);
        }
        this.mNewSnake[this.mLength]=new TextureRenderable(this.kSnakeBody);
        this.mNewSnake[this.mLength].getXform().setSize(this.SNAKE_SIZE,this.SNAKE_SIZE);
        this.mNewSnake[this.mLength].setColor([1,1,1,0]);
        this.mNewSnake[this.mLength].getXform().setPosition(this.mNewSnake[this.mLength-1].getXform().getXPos(),this.mNewSnake[this.mLength-1].getXform().getYPos());
        this.mLength++;
    }
    
};
NewSnake.prototype.draw = function (vpMatrix) {
    for(var i=0;i<this.mLength;i++){
        this.mNewSnake[i].draw(vpMatrix);
    }
};
NewSnake.prototype.getHeadPos=function(){

    return [this.mNewSnake[0].getXform().getXPos(),this.mNewSnake[0].getXform().getYPos()];
};
NewSnake.prototype.deathCheck=function(){
    if(this.mNewSnake[0].getXform().getXPos()<=this.mBorder.W){return true;}
    if(this.mNewSnake[0].getXform().getXPos()>=this.mBorder.E){return true;}
    if(this.mNewSnake[0].getXform().getYPos()<=this.mBorder.S){return true;}
    if(this.mNewSnake[0].getXform().getYPos()>=this.mBorder.N){return true;}
    return false;
};