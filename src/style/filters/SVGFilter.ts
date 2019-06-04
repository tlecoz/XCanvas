class SVGFilter extends Filter {

  protected _url:string;
  constructor(url:string){
    super();
    this._url = url;
  }


  public get dataString():string{return ""+this._url}
  public static fromDataString(data:string):SVGFilter{return new SVGFilter(data);}



  public get url():string{return this._url}
  public set url(n:string){
      if(n != this._url){
        this._url = n;
        this.applyDirty();
      }
  }
  public get value():string{ return "url("+this._url+"+)"}
  public clone():SVGFilter{return new SVGFilter(this._url)}
}
