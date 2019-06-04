class BitmapFill extends FillStroke {

  public bd:BitmapData;
  public centerInto:boolean = false;
  public x:number = 0;
  public y:number = 0;
  public scaleX:number = 1;
  public scaleY:number = 1;
  public rotation:number = 0;

  constructor(bd:BitmapData,centerInto:boolean=true){
    super();
    this.bd = bd;
    this.centerInto = centerInto;
    this.styleType = "fillStyle";

  }

  public get dataString():string{
    var centerInto:number = 0;
    if(this.centerInto) centerInto = 1;
    return this.bd.REGISTER_ID+","+centerInto;
  }
  public static fromDataString(data:string):BitmapFill{
    var t:string[] = data.split(",");
    return new BitmapFill(ObjectLibrary.instance.getObjectByRegisterId(t[0]),t[1] == "1");
  }



  public clone(cloneMedia:boolean=false,cloneLineStyle:boolean=true):BitmapFill{
    var o:BitmapFill;
    if(cloneMedia) o = new BitmapFill(this.bd.clone());
    else o = new BitmapFill(this.bd);
    o.x = this.x;
    o.y = this.y;
    o.scaleX = this.scaleX;
    o.scaleY = this.scaleY;
    o.rotation = this.rotation;
    if(this.lineStyle){
      if(cloneLineStyle) o.lineStyle = this.lineStyle.clone()
      else o.lineStyle = this.lineStyle;
    }
    return o;
  }




  public apply(context:CanvasRenderingContext2D,path:Path,target:Display2D):void{
    const bd:HTMLCanvasElement|ImageBitmap = this.bd.htmlCanvas;
    context.save(); // do not delete ! need it for mouseevent



    context.clip(path.path);

    context.scale(target.inverseW * this.scaleX,target.inverseH * this.scaleY);
    context.translate(target.xAxis,target.yAxis);
    context.rotate(this.rotation)
    if(this.centerInto) context.translate((target.width-bd.width)*0.5,(target.height-bd.height)*0.5);
    context.translate(this.x,this.y)
    super.apply(context,path,target);


    if(target.fillStrokeDrawable) context.drawImage(bd,0,0);

    context.restore();// do not delete ! need it for mouseevent



  }
}
