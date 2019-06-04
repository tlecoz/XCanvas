class Solid extends FillStroke {

  public color:SolidColor;



  constructor(r:number|SolidColor|string="#000000",g:number=null,b:number=null,a:number=null){
    super();
    //r can contains these values :
    //-> 0...255 => as the red component
    //-> 0xrrggbb => RGB hex number
    //-> 0xaarrggbb
    //-> "#rrggbb"
    //--> "#aarrggbb"

    if(r instanceof SolidColor) this.color = r;
    else this.color = new SolidColor(r,g,b,a);
  }

  public clone(cloneColor:boolean=false,cloneLineStyle:boolean=true,cloneTextStyle:boolean=true,cloneTextLineStyle:boolean=true):Solid{
    var o:Solid;
    if(cloneColor) o = new Solid(this.color.clone())
    else o = new Solid(this.color)
    o.fillPathRule = this.fillPathRule;
    o.styleType = this.styleType;
    o.alpha = this.alpha;

    if(this.lineStyle){
      if(cloneLineStyle) o.lineStyle = this.lineStyle.clone()
      else o.lineStyle = this.lineStyle;
    }
    if(this.textStyle){
      if(cloneTextStyle) o.textStyle = this.textStyle.clone(cloneTextLineStyle)
      else o.textStyle = this.textStyle;
    }
    return o;
  }

  public apply(context:CanvasRenderingContext2D,path:Fillable,target:Display2D):void{
    super.apply(context,path,target);
    context[this.styleType] = this.color.style;
  }


}
