class RectBounds {

  public minX:number = Number.MAX_VALUE;
  public minY:number = Number.MAX_VALUE;
  public maxX:number = Number.MIN_VALUE;
  public maxY:number = Number.MIN_VALUE;
  protected points:Pt2D[];
  protected nbPoint:number;
  private static rect:RectBounds;

  constructor(){
    this.points = [];
    this.nbPoint = 0;
    this.reset();
  }

  public reset():void{
    this.minX = Number.MAX_VALUE;
    this.minY = Number.MAX_VALUE;
    this.maxX = Number.MIN_VALUE;
    this.maxY = Number.MIN_VALUE;
  }
  public addPoint(px:number,py:number,registerPoint:boolean=true){
    if(px <= this.minX) this.minX = px;
    if(px >= this.maxX) this.maxX = px;
    if(py <= this.minY) this.minY = py;
    if(py >= this.maxY) this.maxY = py;
    if(registerPoint) this.points[this.nbPoint++] = new Pt2D(px,py);
  }
  public addRect(minX:number,minY:number,maxX:number,maxY:number){
      if(minX <= this.minX) this.minX = minX;
      if(maxX >= this.maxX) this.maxX = maxX;
      if(minY <= this.minY) this.minY = minY;
      if(maxY >= this.maxY) this.maxY = maxY;
  }
  public drawBounds = function(context2D:CanvasRenderingContext2D){
      context2D.save();
      context2D.beginPath();
      context2D.strokeStyle = "#000000"
      context2D.setTransform(1, 0, 0, 1, 0, 0);
      context2D.rect(this.x,this.y,this.width,this.height);
      context2D.stroke();
      context2D.restore();
  }

  public get x():number{return this.minX}
  public get y():number{return this.minY}
  public get width():number{return this.maxX - this.minX}
  public get height():number{return this.maxY - this.minY}

  public static getBounds(xAxis:number,yAxis:number,w:number,h:number,rotation:number):RectBounds{
    if(!RectBounds.rect) RectBounds.rect = new RectBounds();
    let r:RectBounds = RectBounds.rect;
    r.reset();

    let x0 = -xAxis;
    let y0 = -yAxis;
    let a0 = Math.atan2(y0,x0) + rotation;
    let d0 = Math.sqrt(x0*x0+y0*y0);

    let x1 = -xAxis + w;
    let y1 = -yAxis;
    let a1 = Math.atan2(y1,x1) + rotation;
    let d1 = Math.sqrt(x1*x1+y1*y1);

    let x2 = -xAxis + w;
    let y2 = -yAxis + h;
    let a2 = Math.atan2(y2,x2) + rotation;
    let d2 = Math.sqrt(x2*x2+y2*y2);

    let x3 = -xAxis;
    let y3 = -yAxis + h;
    let a3 = Math.atan2(y3,x3) + rotation;
    let d3 = Math.sqrt(x3*x3+y3*y3);

    r.addPoint(xAxis + Math.cos(a0)*d0 , yAxis + Math.sin(a0) * d0);
    r.addPoint(xAxis + Math.cos(a1)*d1 , yAxis + Math.sin(a1) * d1);
    r.addPoint(xAxis + Math.cos(a2)*d2 , yAxis + Math.sin(a2) * d2);
    r.addPoint(xAxis + Math.cos(a3)*d3 , yAxis + Math.sin(a3) * d3);
    
    return r;
  }
}
