class BitmapPixel {

  private static _instance:BitmapPixel;

  protected pixelData:Uint8ClampedArray;
  protected w:number;
  protected h:number;
  protected id:number;

  constructor(){
    if(BitmapPixel._instance) throw new Error("You must use BitmapPixel.instance")
    BitmapPixel._instance = this;
  }
  public static get instance():BitmapPixel{
    if(!BitmapPixel._instance) new BitmapPixel();
    return BitmapPixel._instance;
  }

  public init(pixelData:Uint8ClampedArray,w:number,h:number):BitmapPixel{
    this.w = w;
    this.h = h;
    this.pixelData = pixelData;
    return this;
  }
  public getPixelObject(x:number,y:number):BitmapPixel{
    this.id = (y * this.w + x) * 4;
    return this;
  }

  public setRGB(x:number,y:number,r:number,g:number,b:number):void{
    var id = (y * this.w + x) * 4;
    this.pixelData[id++] = r;
    this.pixelData[id++] = g;
    this.pixelData[id++] = b;
    this.pixelData[id++] = 255;
  }
  public setRGBA(x:number,y:number,r:number,g:number,b:number,a:number):void{
    var id = (y * this.w + x) * 4;
    this.pixelData[id++] = r;
    this.pixelData[id++] = g;
    this.pixelData[id++] = b;
    this.pixelData[id++] = a;
  }
  public setSolidColorPixel(x:number,y:number,solidColor:SolidColor){
    var id = (y * this.w + x) * 4;
    this.pixelData[id++] = solidColor.r;
    this.pixelData[id++] = solidColor.g;
    this.pixelData[id++] = solidColor.b;
    this.pixelData[id++] = solidColor.a;
  }

  public copyIntoSolidColor(x:number,y:number,solidColor:SolidColor):void{
    var id = (y * this.w + x) * 4;
    solidColor.r = this.pixelData[id++];
    solidColor.b = this.pixelData[id++];
    solidColor.g = this.pixelData[id++];
    solidColor.a = this.pixelData[id++];
  }

  public get r():number{return this.pixelData[this.id];}
  public get g():number{return this.pixelData[this.id+1];}
  public get b():number{return this.pixelData[this.id+2];}
  public get a():number{return this.pixelData[this.id+3];}

  public set r(n:number){this.pixelData[this.id] = n;}
  public set g(n:number){this.pixelData[this.id+1] = n;}
  public set b(n:number){this.pixelData[this.id+2] = n;}
  public set a(n:number){this.pixelData[this.id+3] = n;}
}
