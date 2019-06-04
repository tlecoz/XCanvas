class GrayscaleFilter extends Filter {
  constructor(intensity:number=0){
    super();
    this._intensity = intensity;
  }

  public get dataString():string{return ""+this._intensity}
  public static fromDataString(data:string):GrayscaleFilter{return new GrayscaleFilter(Number(data));}


  public clone():GrayscaleFilter{ return new GrayscaleFilter(this._intensity)}
  public get value():string{ return "grayscale("+this._intensity+"+%)"}
}
