class PatternStroke extends Pattern {

  constructor(source:BitmapData,crop:boolean=true,applyTargetScale:boolean=false){
    super(source,crop,applyTargetScale)
    this.styleType = "strokeStyle";

  }
  public get dataString():string{
    var crop:number = 0;
    var targetScale:number = 0;
    if(this.crop) crop = 1;
    if(this.applyTargetScale) targetScale = 1;
    return this.source.REGISTER_ID+","+crop+","+targetScale;
  }
  public static fromDataString(data:string):PatternStroke{
    var t:string[] = data.split(",");
    return new PatternStroke(ObjectLibrary.instance.getObjectByRegisterId(t[0]),t[1] == "1",t[1] == "1");
  }

  public apply(context:CanvasRenderingContext2D,path:Path,target:Display2D):void{

    if(this.lineStyle) this.lineStyle.apply(context,path,target);
    super.apply(context,path,target);
    if(target.fillStrokeDrawable) context.stroke(path.path);

  }
}
