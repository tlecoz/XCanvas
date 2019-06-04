class HueRotateFilter extends Filter {
  constructor(angle:number=0){
    super();
    this._angle = angle;
  }

  public get dataString():string{return ""+this._angle}
  public static fromDataString(data:string):HueRotateFilter{return new HueRotateFilter(Number(data));}


  public get value():string{ return "hue-rotate("+this._angle+"+%)"}
  public clone():HueRotateFilter{return new HueRotateFilter(this._angle);}
}
