class PatternTextStroke extends Pattern {

  constructor(textStyle:TextStyle,bd:BitmapData,centerInto:boolean=true,applyTargetScale:boolean=false){
    super(bd,centerInto,applyTargetScale)
    this.styleType = "strokeStyle";
    this.textStyle = textStyle;

  }

  public get dataString():string{
    var crop:number = 0;
    var targetScale:number = 0;
    if(this.crop) crop = 1;
    if(this.applyTargetScale) targetScale = 1;
    return this.textStyle.REGISTER_ID+","+this.source.REGISTER_ID+","+crop+","+targetScale;
  }
  public static fromDataString(data:string):PatternTextStroke{
    var t:string[] = data.split(",");
    return new PatternTextStroke(ObjectLibrary.instance.getObjectByRegisterId(t[0]),ObjectLibrary.instance.getObjectByRegisterId(t[1]),t[2] == "1",t[3] == "1");
  }

  public apply(context:CanvasRenderingContext2D,path:TextPath,target:Display2D):void{

    this.textStyle.apply(context,path,target);
    super.apply(context,path,target);
    if(target.fillStrokeDrawable) context.strokeText(path.text,this.textStyle.offsetX/target.width,this.textStyle.offsetY/target.height);

  }
}
