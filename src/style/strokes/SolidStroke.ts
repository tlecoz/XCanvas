class SolidStroke extends Solid {

  constructor(r:number|SolidColor|string="#000000",g:number=null,b:number=null,a:number=null){
    super(r,g,b,a);
    this.styleType = "strokeStyle";

  }

  public get dataString():string{
    return this.color.REGISTER_ID;
  }
  public static fromDataString(data:string):SolidStroke{
    return new SolidStroke(ObjectLibrary.instance.getObjectByRegisterId(data));
  }

  public apply(context:CanvasRenderingContext2D,path:Path,target:Display2D):void{

    if(this.lineStyle) this.lineStyle.apply(context,path,target);
    super.apply(context,path,target);
    if(target.fillStrokeDrawable) context.stroke(path.path);

  }
}
