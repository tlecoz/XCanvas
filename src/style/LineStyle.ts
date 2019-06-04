class LineStyle extends RegisterableObject {
  public cap:"butt"|"round"|"square"=null;
  public dashOffset:number=null;
  public dashLineDist:number=null;
  public dashHoleDist:number=null;
  public join:"bevel"|"round"|"miter"=null;
  public lineWidth:number=null;
  public miterLimit:number=null;

  public allowScaleTransform:boolean = true;

  constructor(lineWidth:number=null){
    super();

    this.lineWidth = lineWidth;
  }

  public get dataString():string{
    return [this.lineWidth,this.cap,this.dashOffset,this.dashLineDist,this.dashHoleDist,this.join,this.miterLimit,Number(this.allowScaleTransform)].join(",");
  }

  public static fromDataString(data:string):LineStyle{
    var t:any[] = data.split(",");
    var o:LineStyle = new LineStyle(Number(t[0]));


    if(t[1] != "null") o.cap = t[1];
    if(t[2] != "null") o.dashOffset = Number(t[2]);
    if(t[3] != "null") o.dashLineDist = Number(t[3]);
    if(t[4] != "null") o.dashHoleDist = Number(t[4]);
    if(t[5] != "null") o.join = t[5];
    if(t[6] != "null") o.miterLimit = Number(t[6]);
    o.allowScaleTransform = t[7] == "1";

    return o;
  }

  public clone():LineStyle{
    var o:LineStyle = new LineStyle(this.lineWidth);
    o.cap = this.cap;
    o.dashOffset = this.dashOffset;
    o.dashHoleDist = this.dashHoleDist;
    o.dashLineDist = this.dashLineDist;
    o.join = this.join;
    o.miterLimit = this.miterLimit;
    return o;
  }

  public apply(context:CanvasRenderingContext2D,path:Fillable,target:Display2D):void{
    if(this.cap) context.lineCap = this.cap;
    if(this.join) context.lineJoin = this.join;
    if(this.lineWidth) context.lineWidth = this.lineWidth;
    if(this.miterLimit) context.miterLimit = this.miterLimit;

    let sx:number = 1,sy:number = 1;
    if(this.allowScaleTransform){
      sx = target.scaleX;
      sy = target.scaleY;
    }


    let s = Math.max(target.width/sx,target.height/sy);
    let s2 = Math.min(target.width,target.height);

    if(this.dashOffset) context.lineDashOffset = this.dashOffset;
    if(this.dashLineDist) {

      if(this.dashHoleDist)context.setLineDash([this.dashLineDist/s,this.dashHoleDist/s])
      else context.setLineDash([this.dashLineDist/s]);
    }
   context.lineWidth = this.lineWidth / s2 ;
 }



}
