/*
export class SpritesheetSequence {


  private nbX:number;
  private frameDuration:number;
  private framePerSecond:number;
  private currentFrame:number;
  private startFrame:number;
  private endFrame:number;
  private started:boolean;
  private startTime:number;

  private _nbFrame:number;
  private _frameX:number;
  private _frameY:number;
  private _frameW:number;
  private _frameH:number;

  public loopSequence:boolean;

  constructor(source:BitmapMovie,startFrame:number,endFrame:number,framePerSecond:number,loop:boolean=true){
    this._frameW = source.frameW;
    this._frameH = source.frameH;
    this.framePerSecond = framePerSecond;
    this.startFrame = startFrame;
    this.endFrame = endFrame;
    this.nbX = source.nbX;
    this._nbFrame = endFrame - startFrame;
    this.frameDuration = 1000 / framePerSecond;
    this.currentFrame = startFrame;
    this.started = false;
    this.startTime = 0;
    this._frameX = 0;
    this._frameY = 0;
    this.loopSequence = loop;
    this.updateFrame(this.currentFrame);
  }
  public updateFrame(id:number):void{
    this._frameY = Math.floor(id / this.nbX) * this._frameH;
    this._frameX = (id % this.nbX) * this._frameW;
  }
  public start():void{
    this.started = true;
    this.startTime = new Date().getTime();
  }
  public stop():void{
    this.started = false;
  }
  public reset(start:boolean){
    this.started = start;
    this.currentFrame = this.startFrame;
  }
  public update():void{
    if(false == this.started) return;
    var time = new Date().getTime() - this.startTime;
    if(time > this.frameDuration){
        this.startTime = new Date().getTime();
        this.currentFrame++;
        if(this.currentFrame > this.endFrame){
            if(this.loopSequence) this.currentFrame = this.startFrame;
            else this.currentFrame = this.endFrame;
        }
        this.updateFrame(this.currentFrame);
    }
  }

  public get fps():number{return this.framePerSecond;}
  public set fps(n:number){
    this.framePerSecond = n;
    this.frameDuration = 1000/this.framePerSecond;
  }

  public get frameX():number{return this._frameX;}
  public get frameY():number{return this._frameY;}

  public get frameW():number{return this._frameW;}
  public get frameH():number{return this._frameH;}

  public get nbFrame():number{return this._nbFrame;}

}*/
