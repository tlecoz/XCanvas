class ContrastFilter extends Filter {
  constructor(intensity:number=0){
    super();
    this._intensity = intensity;
  }

  public get dataString():string{return ""+this._intensity}
  public static fromDataString(data:string):ContrastFilter{return new ContrastFilter(Number(data));}



  public clone():ContrastFilter{ return new ContrastFilter(this._intensity)}
  public get value():string{ return "contrast("+this._intensity+"+%)"}
}
