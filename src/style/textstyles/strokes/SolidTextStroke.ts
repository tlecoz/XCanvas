class SolidTextStroke extends Solid {

  constructor(textStyle:TextStyle,r:number|SolidColor|string="#000000",g:number=null,b:number=null,a:number=null){
    super(r,g,b,a);
    this.styleType = "strokeStyle";
    this.textStyle = textStyle;


  }
  public get dataString():string{
    return this.textStyle.REGISTER_ID+","+this.color.REGISTER_ID;
  }
  public static fromDataString(data:string):SolidTextStroke{
    var t:string[] = data.split(",");
    return new SolidTextStroke(ObjectLibrary.instance.getObjectByRegisterId(t[0]),ObjectLibrary.instance.getObjectByRegisterId(t[1]));
  }

  
  public apply(context:CanvasRenderingContext2D,path:TextPath,target:Display2D):void{

    this.textStyle.apply(context,path,target);
    super.apply(context,path,target);
    if(target.fillStrokeDrawable) context.strokeText(path.text,this.textStyle.offsetX/target.width,this.textStyle.offsetY/target.height);

  }
}
