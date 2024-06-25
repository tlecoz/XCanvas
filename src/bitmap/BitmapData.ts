
import { Display2D } from "../display/Display2D";
import { EventDispatcher } from "../events/EventDispatcher";
import { Rectangle2D } from "../geom/Rectangle2D";
import { Browser } from "../utils/Browser";
import { BitmapPixel } from "./BitmapPixel";

export class BitmapData extends EventDispatcher {



  public static IMAGE_LOADED: string = "IMAGE_LOADED";

  //private static nameIndex: number = 0;
  private static abstractCanvas: HTMLCanvasElement = document.createElement("canvas");
  private static abstractContext: CanvasRenderingContext2D = BitmapData.abstractCanvas.getContext("2d", { willReadFrequently: true });
  //private static _defaultImageBitmap: ImageBitmap;




  public offsetX: number = 0;
  public offsetY: number = 0;
  public pixel: BitmapPixel;
  public needsUpdate: boolean = false; // can be used from an external class

  protected _maskTemp: BitmapData = null;
  protected _filterTemp: any = null;
  protected _imageData: ImageData = null;
  protected pixels: Uint8ClampedArray;
  protected pixelDataDirty: boolean = true;
  protected useAlphaChannel: boolean;

  protected sourceUrl: string = null;
  protected _savedData: { data: ImageData, w: number, h: number };
  protected ctx: CanvasRenderingContext2D;
  protected canvas: HTMLCanvasElement;



  constructor(w: number = 1, h: number = 1, cssColor: string = null) {
    super();



    if (!Browser.canUseOffscreenCanvas) this.canvas = document.createElement("canvas");
    else this.canvas = new (window as any).OffscreenCanvas(w, h);

    //console.warn("createBitmapData ", w, h)

    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });

    this.pixel = BitmapPixel.instance;

    if (cssColor) {
      this.ctx.fillStyle = cssColor;
      this.ctx.fillRect(0, 0, w, h);
    }
  }
  public get htmlCanvas(): HTMLCanvasElement | ImageBitmap { return this.canvas; }
  public get context(): CanvasRenderingContext2D { return this.ctx; }




  public saveData(): void {
    var o: { data: ImageData, w: number, h: number } = {
      data: this.ctx.getImageData(0, 0, this.width, this.height),
      w: this.width,
      h: this.height
    }
    this._savedData = o;
  }
  public restoreData(clearSavedData: boolean = true): void {
    if (!this._savedData) return;
    this.canvas.width = this._savedData.w;
    this.canvas.height = this._savedData.h;
    this.putImageData(this._savedData.data, 0, 0);
    if (clearSavedData) this._savedData = null;
  }

  public setPadding(left: number = 0, right: number = 0, top: number = 0, bottom: number = 0): void {
    var abstract: HTMLCanvasElement = BitmapData.abstractCanvas;
    var ctx: CanvasRenderingContext2D = BitmapData.abstractContext;
    abstract.width = this.width;
    abstract.height = this.height;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.drawImage(this.htmlCanvas, 0, 0);

    this.canvas.width = this.width + left + right;
    this.canvas.height = this.height + top + bottom;
    this.drawImage(abstract, left, top);
  }

  public createImageBitmap(): Promise<ImageBitmap> {
    return createImageBitmap(this.htmlCanvas, 0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
  }


  public get width(): number { return this.canvas.width }
  public set width(n: number) { this.canvas.width = n; }

  public get height(): number { return this.canvas.height }
  public set height(n: number) { this.canvas.height = n }

  public getImageData(x: number, y: number, w: number, h: number): ImageData {
    this._imageData = this.ctx.getImageData(x, y, w, h);
    return this._imageData;
  }

  public putImageData(data: ImageData, x: number, y: number): void {
    this.ctx.putImageData(data, x, y);
  }

  public drawDisplayElement(displayElement: Display2D, matrix: DOMMatrix = null): void {
    this.context.save();
    if (matrix) (this.context as any).setTransform(matrix)
    displayElement.renderStack.updateCache(this.context, displayElement);
    this.context.restore();
  }


  public drawHtmlCode(htmlCodeSource: string, x: number, y: number, w: number, h: number) {
    /*
    Example :
    var bd = new BitmapData(800,600);
    bd.drawHtmlCode("<div>BLABLABLA</div>",200,20,0,0);
     */


    var data = "<svg xmlns='http://www.w3.org/2000/svg' width='" + w + "' height='" + h + "'>" +
      "<foreignObject width='100%' height='100%'>" +
      "<div xmlns='http://www.w3.org/1999/xhtml'>" +
      htmlCodeSource +
      "</div>" +
      "</foreignObject>" +
      "</svg>";
    var DOMURL: any = self.URL || self;
    var img = new Image();
    var svg = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
    var url = DOMURL.createObjectURL(svg);
    var context = this.context;
    img.onload = function () {
      context.drawImage(img, x, y);
      DOMURL.revokeObjectURL(url);
    };
    img.src = url;
  }
  /*
  public loadImage(url:string,useImageSize:boolean=true,centerInto:boolean=false):Img{


    var image = new Img(url);
    var img = image.htmlImage;
    var th = this;
    var px:number = 0,py:number = 0;

    image.addEventListener(Img.IMAGE_LOADED,function(){
      //console.log("img loaded")
      image.clearEvents();
      th.context.clearRect(0,0,th.width,th.height);

      if(useImageSize){
        th.width = img.width;
        th.height = img.height;
        th.context.drawImage(img,0,0);
      }else{

        if(centerInto){
          let w = img.width,h = img.height;
          let s = th.width / img.width;
          w *= s;
          h *= s;
          if(h > th.height){
            s = th.height / img.height;
            w *= s;
            h *= s;
          }
          px = (th.width - w) * 0.5;
          py = (th.height - h) * 0.5;

        }
        th.context.drawImage(img,0,0,img.width,img.height,px,py,th.width,th.height)
      }

      th.dispatchEvent(BitmapData.IMAGE_LOADED);
    })
    return image;

  }
  */






  public clone(): BitmapData {
    var bd = new BitmapData(this.width, this.height);
    bd.context.drawImage(this.htmlCanvas, 0, 0, this.width, this.height);
    return bd;
  }

  public resize(w: number, h: number, resultBd: BitmapData = null): BitmapData {
    if (!resultBd) resultBd = this;

    //var oldW: number = resultBd.width;
    //var oldH: number = resultBd.height;

    var abstract: HTMLCanvasElement = BitmapData.abstractCanvas;
    var ctx: CanvasRenderingContext2D = BitmapData.abstractContext;
    abstract.width = w;
    abstract.height = h;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(this.htmlCanvas, 0, 0, this.width, this.height, 0, 0, w, h);

    resultBd.width = w;
    resultBd.height = h;
    resultBd.clear();
    resultBd.context.drawImage(abstract, 0, 0, w, h);
    return resultBd;
  }

  public resizeWithAntialazing(w: number, h: number, resultBd: BitmapData): BitmapData {
    if (!resultBd) resultBd = this;
    if (w >= resultBd.width && h >= resultBd.height) return this.resize(w, h, resultBd);

    var oldW = resultBd.width;
    var oldH = resultBd.height;

    var abstract = BitmapData.abstractCanvas;
    var ctx = BitmapData.abstractContext;

    ctx.clearRect(0, 0, abstract.width, abstract.height);
    abstract.width = oldW;
    abstract.height = oldH;
    ctx.drawImage(this.htmlCanvas, 0, 0);

    var nbPass = 0;

    while (oldW / 2 > w || oldH / 2 > h) {
      if (oldW / 2 > w) oldW /= 2;
      if (oldH / 2 > h) oldH /= 2;

      ctx.clearRect(0, 0, abstract.width, abstract.height);
      abstract.width = oldW;
      abstract.height = oldH;
      if (nbPass++ == 0) ctx.drawImage(this.htmlCanvas, 0, 0, this.width, this.height, 0, 0, oldW, oldH);
      else ctx.drawImage(resultBd.htmlCanvas, 0, 0, this.width, this.height, 0, 0, oldW, oldH);

      resultBd.clear();
      resultBd.width = oldW;
      resultBd.height = oldH;
      resultBd.context.drawImage(abstract, 0, 0);

    }

    if (w != oldW || h != oldH) {
      resultBd.clear();
      resultBd.width = w;
      resultBd.height = h;
      resultBd.context.drawImage(abstract, 0, 0, abstract.width, abstract.height, 0, 0, w, h);
    }

    return resultBd;
  }
  /*
  public applyBitmapDataAsFilter(bitmap:Bitmap,compositeOperation:string="destination-out"):void{
    if(this._filterTemp == null) this._filterTemp = this.clone();

    this.context.save();
    this.clear();

    bitmap.updateAsFilter(this.context);
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.globalCompositeOperation = compositeOperation;
    this.context.drawImage(this._filterTemp.htmlCanvas,0,0);
    this.context.restore();
  }
  */

  public get pixelView(): BitmapPixel {
    if (!this._imageData) this._imageData = this.context.getImageData(0, 0, this.width, this.height);
    return this.pixel.init(this._imageData.data, this.width, this.height);
  }

  public tint(r: number, g: number, b: number, a: number = 1): void {
    var temp: HTMLCanvasElement = BitmapData.abstractCanvas;
    var tempCtx: CanvasRenderingContext2D = BitmapData.abstractContext;
    if (temp.width != this.width || temp.height != this.height) {
      temp.width = this.width;
      temp.height = this.height;
    } else {
      tempCtx.clearRect(0, 0, this.width, this.height);
    }

    tempCtx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")"
    tempCtx.fillRect(0, 0, this.width, this.height);
    tempCtx.globalCompositeOperation = "destination-atop";
    tempCtx.drawImage(this.htmlCanvas, 0, 0);


    this.context.clearRect(0, 0, this.width, this.height);
    this.context.drawImage(temp, 0, 0);
  }

  public fillRect(x: number, y: number, w: number, h: number, cssColor: string): void {
    this.context.fillStyle = cssColor;
    this.context.fillRect(x, y, w, h);
    this.pixelDataDirty = true;
  }


  public get pixelData(): Uint8ClampedArray {
    if (!this._imageData || this.pixelDataDirty) this._imageData = this.context.getImageData(0, 0, this.width, this.height);
    this.pixelDataDirty = false;
    this.pixels = this._imageData.data;
    return this.pixels;
  }

  public getPixels(x: number, y: number, w: number, h: number): Uint8ClampedArray {
    return this.context.getImageData(x, y, w, h).data;
  }

  public getPixel(x: number, y: number): { r: number, g: number, b: number, a: number } {
    var id: number = (this.width * y + x) * 4;
    var p: Uint8ClampedArray = this.pixelData;
    var o: { r: number, g: number, b: number, a: number } = this.pixel;
    o.r = p[id];
    o.g = p[id + 1];
    o.b = p[id + 2];
    o.a = p[id + 3];
    return o
  }


  public getPixelRGBIntColor(x: number, y: number): number {
    var id: number = (this.width * y + x) * 4;
    var p: Uint8ClampedArray = this.pixelData;
    return (p[id] << 16) | (p[id + 1] << 8) | p[id + 2];
  }

  public getPixelRGBAIntColor(x: number, y: number): number {
    var id: number = (this.width * y + x) * 4;
    var p: Uint8ClampedArray = this.pixelData;
    return p[id + 3] << 24 | p[id] << 16 | p[id + 1] << 8 | p[id + 2];
  }

  public getPixelRed(x: number, y: number): number { return this.pixelData[(this.width * y + x) * 4]; }
  public getPixelGreen(x: number, y: number): number { return this.pixelData[(this.width * y + x) * 4 + 1]; }
  public getPixelBlue(x: number, y: number): number { return this.pixelData[(this.width * y + x) * 4 + 2]; }
  public getPixelAlpha(x: number, y: number): number { return this.pixelData[(this.width * y + x) * 4 + 3]; }

  public clear(): void { this.context.clearRect(0, 0, this.width, this.height); }
  public applyFilter(cssFilterStr: string) {
    (this.context as any).filter = cssFilterStr;
    this.context.drawImage(this.htmlCanvas, 0, 0);
    (this.context as any).filter = "";
  }

  public drawImage(img: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap, srcX: number = 0, srcY: number = 0, srcW: number = -1, srcH: number = -1, destX: number = 0, destY: number = 0, destW: number = -1, destH: number = -1) {
    if (srcW == -1) {
      srcW = img.width;
      srcH = img.height;
    }
    if (destW == -1) {
      destW = srcW;
      destH = srcH;
    }
    this.context.drawImage(img, srcX, srcY, srcW, srcH, destX, destY, destW, destH);
    this.pixelDataDirty = true;
  }

  public setImageData(imgData: ImageData, x: number, y: number): void {
    this._imageData = imgData;
    this.context.putImageData(imgData, x, y);
    this.pixelDataDirty = false;
  }
  public applyImageData(): void {
    this.context.putImageData(this._imageData, 0, 0);
    this.pixelDataDirty = false;
  }

  //-------------FLOOD FILL ------------------------------------------------
  public floodFillRGBAandReturnOutputCanvas(x: number, y: number, fillR: number, fillG: number, fillB: number, fillA: number = 255): BitmapData {

    let outputCanvas: BitmapData = new BitmapData(this.width, this.height, 'rgba(0,0,0,0)');
    let outputDatas: Uint8ClampedArray = outputCanvas.pixelData;

    let data: Uint8ClampedArray = this.pixelData;

    var borderLen: number = 0;
    var borders: { x: number, y: number }[][] = [];
    borders[0] = [{ x: x, y: y }];

    let currentBorder: { x: number, y: number }[] = borders[0];
    let nextBorder: { x: number, y: number }[] = currentBorder;
    let working: boolean = true;

    let i: number, nbPixel: number;
    let px: number, py: number, k: number;
    let bmpW: number = this.width;
    let minX: number = 9999999, minY: number = 9999999, maxX: number = 0, maxY: number = 0;


    let id: number = (bmpW * y + x) * 4;

    let r: number = data[id];
    let g: number = data[id + 1];
    let b: number = data[id + 2];
    let a: number = data[id + 3];

    data[id] = fillR;
    data[id + 1] = fillG;
    data[id + 2] = fillB;
    data[id + 3] = fillA;

    var w = this.width;
    var h = this.height;
    while (working) {
      currentBorder = nextBorder;
      borders[borderLen++] = nextBorder = [];
      nbPixel = currentBorder.length;
      k = 0;

      if (0 == nbPixel) working = false;

      for (i = 0; i < nbPixel; i++) {

        x = currentBorder[i].x;
        y = currentBorder[i].y;

        if (x < 0 || y < 0 || x >= w || y >= h) continue

        if (x > maxX) maxX = x;
        if (x < minX) minX = x;
        if (y > maxY) maxY = y;
        if (y < minY) minY = y;

        //if(x<0 || y<0) console.log("error = ",x,y);


        //topLeft
        px = x - 1;
        py = y - 1;

        //if(px >=0 && py >=0){
        id = (bmpW * py + px) * 4;

        if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
          data[id] = outputDatas[id] = fillR;
          data[id + 1] = outputDatas[id + 1] = fillG;
          data[id + 2] = outputDatas[id + 2] = fillB;
          data[id + 3] = outputDatas[id + 3] = fillA;
          nextBorder[k++] = { x: px, y: py };
        }
        //}

        //top
        px = x;
        py = y - 1;

        //if(py >=0){
        id = (bmpW * py + px) * 4;

        if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
          data[id] = outputDatas[id] = fillR;
          data[id + 1] = outputDatas[id + 1] = fillG;
          data[id + 2] = outputDatas[id + 2] = fillB;
          data[id + 3] = outputDatas[id + 3] = fillA;
          nextBorder[k++] = { x: px, y: py };
        }
        //}

        //topRight
        px = x + 1;
        py = y - 1;

        //if(py >=0 && px<=bmpW){
        id = (bmpW * py + px) * 4;

        if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
          data[id] = outputDatas[id] = fillR;
          data[id + 1] = outputDatas[id + 1] = fillG;
          data[id + 2] = outputDatas[id + 2] = fillB;
          data[id + 3] = outputDatas[id + 3] = fillA;
          nextBorder[k++] = { x: px, y: py };
        }
        //}

        //right
        px = x + 1;
        py = y;

        //if(px <= bmpW){
        id = (bmpW * py + px) * 4;

        if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
          data[id] = outputDatas[id] = fillR;
          data[id + 1] = outputDatas[id + 1] = fillG;
          data[id + 2] = outputDatas[id + 2] = fillB;
          data[id + 3] = outputDatas[id + 3] = fillA;
          nextBorder[k++] = { x: px, y: py };
        }
        //}

        //bottom right
        px = x + 1;
        py = y + 1;

        //if(px <= bmpW && py <= bmpH){
        id = (bmpW * py + px) * 4;
        if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
          data[id] = outputDatas[id] = fillR;
          data[id + 1] = outputDatas[id + 1] = fillG;
          data[id + 2] = outputDatas[id + 2] = fillB;
          data[id + 3] = outputDatas[id + 3] = fillA;
          nextBorder[k++] = { x: px, y: py };
        }
        //}

        //bottom
        px = x;
        py = y + 1;

        id = (bmpW * py + px) * 4;

        if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
          data[id] = outputDatas[id] = fillR;
          data[id + 1] = outputDatas[id + 1] = fillG;
          data[id + 2] = outputDatas[id + 2] = fillB;
          data[id + 3] = outputDatas[id + 3] = fillA;
          nextBorder[k++] = { x: px, y: py };
        }
        //}

        //bottomLeft
        px = x - 1;
        py = y + 1;

        id = (bmpW * py + px) * 4;

        if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
          data[id] = outputDatas[id] = fillR;
          data[id + 1] = outputDatas[id + 1] = fillG;
          data[id + 2] = outputDatas[id + 2] = fillB;
          data[id + 3] = outputDatas[id + 3] = fillA;
          nextBorder[k++] = { x: px, y: py };
        }
        //}

        //left
        px = x - 1;
        py = y;

        id = (bmpW * py + px) * 4;

        if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
          data[id] = outputDatas[id] = fillR;
          data[id + 1] = outputDatas[id + 1] = fillG;
          data[id + 2] = outputDatas[id + 2] = fillB;
          data[id + 3] = outputDatas[id + 3] = fillA;
          nextBorder[k++] = { x: px, y: py };
        }
        //}
      }
    }

    this.applyImageData();
    outputCanvas.applyImageData();



    var w = maxX - minX;
    var h = maxY - minY;

    BitmapData.abstractCanvas.width = w;
    BitmapData.abstractCanvas.height = h;

    BitmapData.abstractContext.drawImage(outputCanvas.htmlCanvas, -minX, -minY);

    outputCanvas.width = w;
    outputCanvas.height = h;

    outputCanvas.context.drawImage(BitmapData.abstractCanvas, 0, 0);



    outputCanvas.offsetX = minX;
    outputCanvas.offsetY = minY;


    return outputCanvas;

  }


  public floodFillRGBA(x: number, y: number, fillR: number, fillG: number, fillB: number, fillA: number = 255): {
    pixels: { x: number, y: number }[][],
    bounds: Rectangle2D
  } {

    let data: Uint8ClampedArray = this.pixelData;
    var borderLen: number = 0;
    var borders: { x: number, y: number }[][] = [];
    borders[0] = [{ x: x, y: y }];

    let currentBorder: { x: number, y: number }[] = borders[0];
    let nextBorder: { x: number, y: number }[] = currentBorder;
    let working: boolean = true;

    let i: number, nbPixel: number;
    let px: number, py: number, k: number;
    let bmpW: number = this.width;

    let minX: number = 9999999, minY: number = 9999999, maxX: number = 0, maxY: number = 0;

    let id = (bmpW * y + x) * 4;

    let r: number = data[id];
    let g: number = data[id + 1];
    let b: number = data[id + 2];
    let a: number = data[id + 3];

    data[id] = fillR;
    data[id + 1] = fillG;
    data[id + 2] = fillB;
    data[id + 3] = fillA;


    while (working) {
      currentBorder = nextBorder;
      borders[borderLen++] = nextBorder = [];
      nbPixel = currentBorder.length;
      k = 0;

      if (0 == nbPixel) working = false;

      for (i = 0; i < nbPixel; i++) {

        x = currentBorder[i].x;
        y = currentBorder[i].y;

        if (x > maxX) maxX = x;
        if (x < minX) minX = x;
        if (y > maxY) maxY = y;
        if (y < minY) minY = y;

        //topLeft
        px = x - 1;
        py = y - 1;
        //if(px >=0 && py >=0){
        id = (bmpW * py + px) * 4;
        if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
          data[id] = fillR;
          data[id + 1] = fillG;
          data[id + 2] = fillB;
          data[id + 3] = fillA;
          nextBorder[k++] = { x: px, y: py };
        }
        //}

        //top
        px = x;
        py = y - 1;
        //if(py >=0){
        id = (bmpW * py + px) * 4;
        if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
          data[id] = fillR;
          data[id + 1] = fillG;
          data[id + 2] = fillB;
          data[id + 3] = fillA;
          nextBorder[k++] = { x: px, y: py };
        }
        //}

        //topRight
        px = x + 1;
        py = y - 1;
        //if(py >=0 && px<=bmpW){
        id = (bmpW * py + px) * 4;
        if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
          data[id] = fillR;
          data[id + 1] = fillG;
          data[id + 2] = fillB;
          data[id + 3] = fillA;
          nextBorder[k++] = { x: px, y: py };
        }
        //}

        //right
        px = x + 1;
        py = y;
        //if(px <= bmpW){
        id = (bmpW * py + px) * 4;
        if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
          data[id] = fillR;
          data[id + 1] = fillG;
          data[id + 2] = fillB;
          data[id + 3] = fillA;
          nextBorder[k++] = { x: px, y: py };
        }
        //}

        //bottom right
        px = x + 1;
        py = y + 1;
        //if(px <= bmpW && py <= bmpH){
        id = (bmpW * py + px) * 4;
        if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
          data[id] = fillR;
          data[id + 1] = fillG;
          data[id + 2] = fillB;
          data[id + 3] = fillA;
          nextBorder[k++] = { x: px, y: py };
        }
        //}

        //bottom
        px = x;
        py = y + 1;
        //if(py <= bmpH){
        id = (bmpW * py + px) * 4;
        if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
          data[id] = fillR;
          data[id + 1] = fillG;
          data[id + 2] = fillB;
          data[id + 3] = fillA;
          nextBorder[k++] = { x: px, y: py };
        }
        //}

        //bottomLeft
        px = x - 1;
        py = y + 1;
        //if(px >= 0 && py <= bmpH){
        id = (bmpW * py + px) * 4;
        if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
          data[id] = fillR;
          data[id + 1] = fillG;
          data[id + 2] = fillB;
          data[id + 3] = fillA;
          nextBorder[k++] = { x: px, y: py };
        }
        //}

        //left
        px = x - 1;
        py = y;
        //if(px >= 0 && py <= bmpH){
        id = (bmpW * py + px) * 4;
        if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
          data[id] = fillR;
          data[id + 1] = fillG;
          data[id + 2] = fillB;
          data[id + 3] = fillA;
          nextBorder[k++] = { x: px, y: py };
        }
        //}
      }
    }

    this.context.putImageData(this._imageData, 0, 0)
    this.pixelDataDirty = false;



    return { pixels: borders, bounds: new Rectangle2D(minX, minY, maxX, maxY) }
  }


  public matchColor(x: number, y: number, r: number, g: number, b: number, a: number) {
    let data: Uint8ClampedArray = this.pixelData;
    let id: number = (this.width * y + x) * 4;
    return r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3];
  }

  public matchRed(x: number, y: number, value: number) { return value == this.pixelData[(this.width * y + x) * 4]; }
  public matchGreen(x: number, y: number, value: number) { return value == this.pixelData[(this.width * y + x) * 4 + 1]; }
  public matchBlue(x: number, y: number, value: number) { return value == this.pixelData[(this.width * y + x) * 4 + 2]; }
  public matchAlpha(x: number, y: number, value: number) {
    //var v:number = this.pixelData[(this.w * y + x)*4+3];
    //if(v != 0 && v != 255) console.log(v);
    return value == this.pixelData[(this.width * y + x) * 4 + 3];
  }

  public isOpaque(x: number, y: number) { return 255 == this.pixelData[(this.width * y + x) * 4 + 3]; }


  //---------- COLOR BOUND RECT --------------------------------

  public getColorBoundRect(areaX: number, areaY: number, areaW: number, areaH: number, r: number, g: number, b: number, a: number, tolerance: number = 0, toleranceG: number = null, toleranceB: number = null, toleranceA: number = null): { x: number, y: number, w: number, h: number } {
    let minX: number = 9999999, minY: number = 9999999, maxX: number = -99999999, maxY: number = -99999999;
    let p: Uint8ClampedArray = this.getPixels(areaX, areaY, areaW, areaH);
    let i: number, len: number = p.length;
    let cr: number, cg: number, cb: number, ca: number, x: number, y: number, n: number;

    if (toleranceG == null) toleranceG = toleranceB = toleranceA = tolerance;
    else if (toleranceB == null) {
      toleranceB = tolerance;
      toleranceA = toleranceG;
    } else if (toleranceA == null) toleranceA = tolerance;

    for (i = 0; i < len; i += 4) {
      cr = p[i];
      cg = p[i + 1];
      cb = p[i + 2];
      ca = p[i + 3];
      if (cr >= r - tolerance && cr <= r + tolerance && cg >= g - toleranceG && cg <= g + toleranceG && cb >= b - toleranceB && cb <= b + toleranceB && ca >= a - toleranceA && ca <= a + toleranceA) {
        n = i * 0.25;
        x = i % areaW;
        y = (n / areaW) >> 0; // (val >> 0) ==> Math.floor
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    if (minX == 9999999) return null;
    return { x: minX, y: minY, w: (maxX - minX), h: (maxY - minY) }
  }


  public getRedChannelBoundRect(areaX: number, areaY: number, areaW: number, areaH: number, channelMin: number, channelMax: number): { x: number, y: number, w: number, h: number } {
    return this.getChannelBoundRect(areaX, areaY, areaW, areaH, channelMin, channelMax, 0);
  }
  public getGreenChannelBoundRect(areaX: number, areaY: number, areaW: number, areaH: number, channelMin: number, channelMax: number): { x: number, y: number, w: number, h: number } {
    return this.getChannelBoundRect(areaX, areaY, areaW, areaH, channelMin, channelMax, 1);
  }
  public getBlueChannelBoundRect(areaX: number, areaY: number, areaW: number, areaH: number, channelMin: number, channelMax: number): { x: number, y: number, w: number, h: number } {
    return this.getChannelBoundRect(areaX, areaY, areaW, areaH, channelMin, channelMax, 2);
  }
  public getAlphaChannelBoundRect(areaX: number, areaY: number, areaW: number, areaH: number, channelMin: number, channelMax: number): { x: number, y: number, w: number, h: number } {
    return this.getChannelBoundRect(areaX, areaY, areaW, areaH, channelMin, channelMax, 3);
  }

  public getChannelBoundRect(areaX: number, areaY: number, areaW: number, areaH: number, channelMin: number, channelMax: number, channelId: number = 3): { x: number, y: number, w: number, h: number } {
    let minX: number = 9999999, minY: number = 9999999, maxX: number = -99999999, maxY: number = -99999999;
    let p: Uint8ClampedArray = this.getPixels(areaX, areaY, areaW, areaH);
    let i: number, len: number = p.length;
    let c: number, x: number, y: number, n: number;
    //let debug: string = "";
    for (i = 0; i < len; i += 4) {
      c = p[i + channelId];

      if (c >= channelMin && c <= channelMax) {
        n = i * 0.25;
        y = (n / areaW) >> 0; // (val >> 0) ==> Math.floor
        x = n % areaW;

        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }

    if (minX == 9999999 || (maxX - minX) == 0 || (maxY - minY) == 0) return null;

    return { x: minX, y: minY, w: (maxX - minX + 1), h: (maxY - minY + 1) }
  }




}
