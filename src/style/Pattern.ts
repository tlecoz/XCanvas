import { BitmapData } from "../bitmap/BitmapData";
import { Display2D } from "../display/Display2D";
import { Matrix2D } from "../geom/Matrix2D";
import { Video } from "../media/Video";
import { FillStroke, Fillable } from "./FillStroke";

export class Pattern extends FillStroke {

  protected source: BitmapData;
  protected matrix: Matrix2D;

  public dirty: boolean = true;
  protected dirtyMatrix: boolean = true;
  protected patternCanvas: CanvasPattern;
  protected canvas: CanvasImageSource;

  protected center: boolean;
  protected targetW: number;
  protected targetH: number;
  protected imageBmp: ImageBitmap = null;
  protected rotationInDegree: number = 0;
  public onImageLoaded: Function;

  private _crop: boolean = true;
  private _applyTargetScale: boolean = false;

  //private videoUpdate: boolean = false;

  constructor(source: BitmapData, crop: boolean = true, applyTargetScale: boolean = false) {
    super()

    this.source = source;
    var th = this;

    //@ts-ignore
    this.onImageLoaded = function (e: BitmapData) {
      th.imageBmp = null;
      th.dirty = th.dirtyMatrix = true;
    }

    source.addEventListener(BitmapData.IMAGE_LOADED, this.onImageLoaded);
    this.canvas = source.htmlCanvas;


    this.matrix = new Matrix2D();

    this._crop = crop;
    this._applyTargetScale = applyTargetScale;
  }

  public get crop(): boolean { return this._crop; }
  public set crop(b: boolean) {
    if (this._crop != b) {
      this.dirty = this.dirtyMatrix = true;
      this._crop = b;
    }
  }

  public get applyTargetScale(): boolean { return this._applyTargetScale; }
  public set applyTargetScale(b: boolean) {
    if (this._applyTargetScale != b) {
      this.dirty = this.dirtyMatrix = true;
      this._crop = b;
    }
  }

  public clone(cloneMedia: boolean = false, cloneLineStyle: boolean = true, cloneTextStyle: boolean = true, cloneTextLineStyle: boolean = true): Pattern {
    var o: Pattern;
    if (!cloneMedia) o = new Pattern(this.source);
    else {
      if (this.source instanceof BitmapData) o = new Pattern(this.source.clone());
      else o = new Pattern(this.source);
    }
    o.mat.x = this.matrix.x;
    o.mat.y = this.matrix.y;
    o.mat.scaleX = this.matrix.scaleX;
    o.mat.scaleY = this.matrix.scaleY;
    o.mat.rotation = this.matrix.rotation;
    o.mat.width = this.matrix.width;
    o.mat.height = this.matrix.height;
    o.mat.setMatrixValue(this.matrix.toString());

    o.fillPathRule = this.fillPathRule;
    o.styleType = this.styleType;
    if (this.lineStyle) {
      if (cloneLineStyle) o.lineStyle = this.lineStyle.clone()
      else o.lineStyle = this.lineStyle;
    }
    if (this.textStyle) {
      if (cloneTextStyle) o.textStyle = this.textStyle.clone(cloneTextLineStyle)
      else o.textStyle = this.textStyle;
    }
    o.alpha = this.alpha;

    return o;
  }

  public get mat(): Matrix2D { return this.matrix }


  public get imageSource(): BitmapData | CanvasImageSource { return this.source; }
  public set bitmapData(n: BitmapData) {
    if (n != this.source) {
      if (this.source && this.source instanceof BitmapData) this.source.removeEventListener(BitmapData.IMAGE_LOADED, this.onImageLoaded);
      this.source = n;
      this.source.addEventListener(BitmapData.IMAGE_LOADED, this.onImageLoaded);
      this.canvas = this.source.htmlCanvas;
      this.dirty = true;
    }
  }

  public get centerInto(): boolean { return this.center; }
  public set centerInto(n: boolean) {
    if (n != this.center) {
      this.center = n;
      this.dirtyMatrix = true;
    }
  }

  public get targetWidth(): number { return this.targetW; }
  public set targetWidth(n: number) {
    if (n != this.targetW) {
      this.targetW = n;
      this.dirtyMatrix = true;
    }
  }
  public get targetHeight(): number { return this.targetW; }
  public set targetHeight(n: number) {
    if (n != this.targetH) {
      this.targetH = n;
      this.dirtyMatrix = true;
    }
  }

  public get x(): number { return this.matrix.x; }
  public set x(n: number) {
    if (this.x != n) {
      this.matrix.x = n;
      this.dirtyMatrix = true;
    }
  }

  public get y(): number { return this.matrix.y; }
  public set y(n: number) {
    if (this.y != n) {
      this.matrix.y = n;
      this.dirtyMatrix = true;
    }
  }


  public get scaleX(): number { return this.matrix.scaleX; }
  public set scaleX(n: number) {
    if (this.scaleX != n) {
      this.matrix.scaleX = n;
      this.dirtyMatrix = true;
    }
  }


  public get scaleY(): number { return this.matrix.scaleY; }
  public set scaleY(n: number) {
    if (this.scaleY != n) {
      this.matrix.scaleY = n;
      this.dirtyMatrix = true;
    }
  }


  public get rotation(): number { return this.matrix.rotation; }
  public set rotation(n: number) {
    if (this.rotation != n) {
      this.rotationInDegree = n;
      this.matrix.rotation = n;
      this.dirtyMatrix = true;
    }
  }

  /*


  - Display2D.stack -> ajouter parametre cacheAsBitmap=false,cacheAsBitmapFilter=false
                      => gestion du cachesource des FillStroke

                      ==> faire en sorte que le cache des FillStroke / Filter soit associé au Display2D
                          -> creer un id unique par FillStroke/Filter

                      ##>>>> créer un objet StyleStack associé à la renderStack
                             => on recréé une renderStack qui contiendra une liste d'objet permettant d'utiliser
                                soit un element de la renderStack source, soit un clone de l'objet source
                                => on garde la référence de la source
                                => c'est cet objet qui contiendra le cachesource du fillStroke/filter


                             ===> c'est l'objet qui sera utilisé pour générer le rendu final du Display2D


                             -> contient les cachesource des FillStroke/Filter


  */


  public apply(context: CanvasRenderingContext2D, path: Fillable, target: Display2D): void {

    let canvas: CanvasImageSource = this.canvas;
    if (this.source instanceof BitmapData) {
      canvas = this.source.htmlCanvas;
      if (this.source instanceof Video) {
        this.dirty = this.source.update();
      }
    } else {
      canvas = this.source;
    }


    if (this.dirty) {
      this.patternCanvas = context.createPattern(canvas as any, "repeat");
      this.dirty = false;
    }

    if (!this.patternCanvas) return;

    this.targetW = target.width;
    this.targetH = target.height;

    //-----------------------------------



    var w: number = canvas.width as number;
    var h: number = canvas.height as number;
    let tw: number = target.width * target.scaleX;
    let th: number = target.height * target.scaleY;




    if (this.dirtyMatrix) {
      this.matrix.identity();


      let stx: number = 1, sty: number = 1;
      if (this.applyTargetScale) {
        stx = target.scaleX;
        sty = target.scaleY;
      }

      //let cropRatio: number = 1;
      let sx = 1, sy = 1;
      if (this.crop) {


        let s = tw / w;
        w *= s;
        h *= s;
        if (h < th) {
          s = th / h;
          w *= s;
          h *= s;
        }


        sx = w / (canvas.width as number);
        sy = w / (canvas.width as number);



        this.matrix.scale(sx * target.inverseW / target.scaleX, sy * target.inverseH / target.scaleY);

        this.matrix.translate(-((w - tw) / sx) * 0.5, -((h - th) / sy) * 0.5);

        this.matrix.translate(((w) / sx) / 2, (h / sy) / 2);
        this.matrix.scale(this.scaleX * stx, this.scaleY * sty)



        this.matrix.rotate(this.rotation / FillStroke.radian)
        this.matrix.translate(-(w / sx) / 2, -(h / sy) / 2);

        this.matrix.translate(this.x, this.y);



      } else {

        this.matrix.scale(sx * stx * target.inverseW * this.scaleX, sy * sty * target.inverseH * this.scaleY);
        this.matrix.rotate(this.rotation / FillStroke.radian)
        this.matrix.translate(this.x, this.y);
      }


      this.dirtyMatrix = false;

    }


    super.apply(context, path, target);

    let pattern: CanvasPattern = this.patternCanvas;
    pattern.setTransform(this.matrix.domMatrix)
    context[this.styleType] = pattern;

  }


}
