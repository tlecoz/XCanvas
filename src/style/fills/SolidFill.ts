class SolidFill extends Solid {

  constructor(r:number|SolidColor|string="#000000",g:number=null,b:number=null,a:number=null){
    super(r,g,b,a);
    this.styleType = "fillStyle";

  }
  public get dataString():string{
    return this.color.REGISTER_ID;
  }
  public static fromDataString(data:string):SolidFill{
    return new SolidFill(ObjectLibrary.instance.getObjectByRegisterId(data));
  }

  public apply(context:CanvasRenderingContext2D,path:Path,target:Display2D):void{

    super.apply(context,path,target);
    if(target.fillStrokeDrawable) context.fill(path.path,this.fillPathRule);

  }
}
