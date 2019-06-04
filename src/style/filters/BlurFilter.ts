class BlurFilter extends Filter {
  constructor(intensity:number=0){
    super();
    this.radius = intensity;
  }

  public get dataString():string{return ""+this.radius}
  public static fromDataString(data:string):BlurFilter{return new BlurFilter(Number(data));}

  
  public clone():BlurFilter{ return new BlurFilter(this.radius)}
  public get value():string{ return "blur("+this.radius+"+px)"}
}
