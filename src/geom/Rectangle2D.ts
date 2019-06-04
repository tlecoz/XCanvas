class Rectangle2D {

  public minX:number;
  public minY:number;
  public maxX:number;
  public maxY:number;

  


  constructor(minX:number=0,minY:number=0,maxX:number=0,maxY:number=0){
    this.init(minX,minY,maxX,maxY);
  }

  public init(minX:number=0,minY:number=0,maxX:number=0,maxY:number=0):Rectangle2D{
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
    return this;
  }

  public get x():number{return this.minX}
  public set x(n:number){this.minX = n;}

  public get y():number{return this.minY}
  public set y(n:number){this.minY = n;}

  public get width():number{return this.maxX - this.minX}
  public set width(n:number){this.maxX = this.minX + n;}

  public get height():number{return this.maxY - this.minY}
  public set height(n:number){this.maxY = this.minY + n;}

  public clear():void{ this.x = this.y = this.width = this.height = 0}

  public draw(context:CanvasRenderingContext2D):void{
    context.save();
    context.strokeStyle = "#000000";
    context.rect(this.minX,this.minY,this.maxX-this.minX,this.maxY-this.minY);
    context.stroke();
    context.restore();
  }






}
