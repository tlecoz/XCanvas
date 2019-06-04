class SaturatetFilter extends Filter {
  constructor(intensity:number=3){
    super();
    this._intensity = intensity;
  }


  public get dataString():string{return ""+this._intensity}
  public static fromDataString(data:string):SaturatetFilter{return new SaturatetFilter(Number(data));}



  public get value():string{ return "saturate("+this._intensity+"+%)"}
  public clone():SaturatetFilter{return new SaturatetFilter(this._intensity)}
}
