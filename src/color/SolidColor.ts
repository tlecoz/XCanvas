class SolidColor extends EventDispatcher {

  public static UPDATE_STYLE = "UPDATE_STYLE";

  public static INVISIBLE_COLOR:SolidColor = new SolidColor(0,0,0,0);

  protected _r:number;
  protected _g:number;
  protected _b:number;
  protected _a:number;
  protected _style:string;
  protected useAlpha:boolean = false;


  constructor(r:number|string,g:number=null,b:number=null,a:number=1){
      super();
      //r can contains these values :
      //-> 0...255 => as the red component
      //-> 0xrrggbb => RGB hex number
      //-> 0xaarrggbb
      //-> "#rrggbb"
      //--> "#aarrggbb"

      console.warn("new SolidColor ",r,g,b,a)


      var red:number;
      if(g==null){
        if( typeof(r) == "string"){
          var s = (r as string).split("#").join("0x")
          //console.log(s);
          r = Number(s);
        }

        var color:number = r as number;

        if(r > 0xffffff){//useAlpha

          a = color >>> 24;
          red = color >>> 16 & 0xFF;
          g = color >>>  8 & 0xFF;
          b = color & 0xFF;
        }else{

          red = color >> 16;
          g = color >> 8 & 0xFF;
          b = color & 0xFF;
          a = 1;
          console.log("aaa ",red,g,b)
        }
      }



      if(isNaN(red)) red = r as number;


      this._r = red;
      this._g = g;
      this._b = b;
      this._a = a;
      this.updateStyle();
  }
  public clone():SolidColor{ return new SolidColor(this._r,this._g,this._b,this._a); }


  public get dataString():string{
    return this._r+","+this._g+","+this._b+","+this._a;
  }
  public static fromDataString(data:string):SolidColor{
    const t = data.split(",");
    return new SolidColor(Number(t[0]),Number(t[1]),Number(t[2]),Number(t[3]))
  }



  public get r():number{return this._r;}
  public set r(n:number){
    if(this._r != n){
      this._r = n;
      this.updateStyle();
    }
  }

  public get g():number{return this._g;}
  public set g(n:number){
    if(this._g != n){
      this._g = n;
      this.updateStyle();
    }
  }

  public get b():number{return this._b;}
  public set b(n:number){
    if(this._b != n){
      this._b = n;
      this.updateStyle();
    }
  }

  public get a():number{return this._a;}
  public set a(n:number){
    if(this._a != n){
      this._a = n;
      this.updateStyle();
    }
  }

  public setRGB(r:number,g:number,b:number):void{
    this.useAlpha = false;
    this._r = r;
    this._g = g;
    this._b = b;
    this.updateStyle();
  }
  public setRGBA(r:number,g:number,b:number,a:number):void{
    this.useAlpha = true;
    this._r = r;
    this._g = g;
    this._b = b;
    this._a = a;
    this.updateStyle();
  }

  public createBrighterColor(pct:number):SolidColor{
    var r = this._r + (255 - this._r) * pct;
    var g = this._g + (255 - this._g) * pct;
    var b = this._b + (255 - this._b) * pct;
    return new SolidColor(r,g,b);
  }
  public createDarkerColor(pct:number):SolidColor{
    var r = this._r * (1 - pct);
    var g = this._g * (1 - pct);
    var b = this._b * (1 - pct);
    return new SolidColor(r,g,b);
  }

  protected updateStyle(dispatchEvent:boolean=true):void{
      if(this.useAlpha) this._style = "rgba("+this._r+","+this._g+","+this._b+","+this._a+")";
      else this._style = "rgb("+this._r+","+this._g+","+this._b+")";
    //console.log(this.style)

      if(dispatchEvent) this.dispatchEvent(SolidColor.UPDATE_STYLE);
  }
  public get style():string{ return this._style; }



}
