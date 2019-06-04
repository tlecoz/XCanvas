class GradientStroke extends Gradient {

  constructor(gradient:GradientColor,isLinear:boolean=true){
    super(gradient,isLinear)
    this.styleType = "strokeStyle";

  }
  public get dataString():string{
    var linear:number = 0;
    if(this.isLinear) linear = 1;
    return this.gradient.REGISTER_ID+","+linear;
  }
  public static fromDataString(data:string):GradientStroke{
    var t:string[] = data.split(",");
    return new GradientStroke(ObjectLibrary.instance.getObjectByRegisterId(t[0]),t[1] == "1");
  }

  public apply(context:CanvasRenderingContext2D,path:Path,target:Display2D):void{


    if(this.lineStyle) this.lineStyle.apply(context,path,target);
    super.apply(context,path,target);
    if(target.fillStrokeDrawable) context.stroke(path.path);


  }
}
