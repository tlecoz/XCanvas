import { BitmapData } from "../bitmap/BitmapData";

export class Img extends BitmapData {



  private _img: HTMLImageElement;
  //private _w: number;
  //private _h: number;
  private _url: string = "";

  public onLoaded: (e?: any) => void;

  constructor(url: string = "") {
    super();


    var img = this._img = document.createElement("img");
    img.onload = () => {
      this.width = img.width;
      this.height = img.height;
      this.drawImage(img, 0, 0);
      if (this.onLoaded) this.onLoaded(img);
      this.dispatchEvent(Img.IMAGE_LOADED);
    }

    this.url = url;
  }

  public get dataString(): string { return this.url; }
  public static fromDataString(url: string): Img { return new Img(url); }

  public get htmlImage(): HTMLImageElement { return this._img }

  public get url(): string { return this._url }
  public set url(s: string) {
    if (s != this._url) {
      this._url = this._img.src = s;
    }
  }

}
