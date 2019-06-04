class Img extends BitmapData {



  private _img:HTMLImageElement;
  private _w:number;
  private _h:number;
  private _url:string="";

  public onLoaded:Function;

  constructor(url:string=""){
    super();


    var th = this;
    var img = this._img = document.createElement("img");
    img.onload = function(){
      th.width = img.width;
      th.height = img.height;
      th.drawImage(img,0,0);
      if(th.onLoaded) th.onLoaded(img);
      th.dispatchEvent(Img.IMAGE_LOADED);
    }

    this.url = url;
  }

  public get dataString():string{ return this.url;}
  public static fromDataString(url:string):Img{ return new Img(url);}

  public get htmlImage():HTMLImageElement{return this._img}

  public get url():string{return this._url}
  public set url(s:string){
    if(s != this._url){
      this._url = this._img.src = s;
    }
  }

}
