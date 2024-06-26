import { MouseControler } from "../controlers/MouseControler";
import { Align } from "../geom/Align";
import { Matrix2D } from "../geom/Matrix2D";
import { Pt2D } from "../geom/Pt2D";
import { Rectangle2D } from "../geom/Rectangle2D";
import { Path } from "../graphics/Path";
import { ObjectLibrary } from "../utils/ObjectLibrary";
import { BitmapCache } from "./BitmapCache";
import { Group2D } from "./Group2D";
import { RenderStack, RenderStackable } from "./RenderStack";
import { RenderStackElement } from "./RenderStackElement";
import { Stage2D } from "./Stage2D";

export type FillType = string | CanvasGradient | CanvasPattern;

export class Display2D extends Matrix2D {



  public static MOUSE_OVER: string = "MOUSE_OVER";
  public static MOUSE_OUT: string = "MOUSE_OUT";
  public static CLICK: string = "CLICK";


  public static ADDED: string = "ADDED";
  public static REMOVED: string = "REMOVED";
  public static ADDED_TO_STAGE: string = "ADDED_TO_STAGE";
  public static REMOVED_FROM_STAGE: string = "REMOVED_FROM_STAGE";


  private static display2dIndex: number = 0;
  public static pathManager: Path = new Path();

  protected cache: BitmapCache;
  protected _stage: Stage2D | null = null;
  protected _cacheAsBitmap: boolean = false;


  public renderStack: RenderStack;

  public width: number = 1;
  public height: number = 1;
  public alpha: number = 1;

  public inverseW: number = 1;//used for filling process;
  public inverseH: number = 1;//used for filling process;

  protected mouse: MouseControler | null = null;
  public mouseIsOver: boolean = false;
  public mouseEnabled: boolean = true;
  public useBasicHitTest: boolean = false;


  public parent: Group2D | null = null;
  protected render: Function | null = null;

  public currentTransform: DOMMatrix | null = null;

  protected _bounds: Rectangle2D;
  private _display2dName: string


  protected boundFrameId: number = -1;

  public axis: Pt2D = Align.TOP_LEFT;

  protected waitingBound: boolean = false;

  constructor(w: number, h: number, renderStack?: RenderStack) {
    super();
    this._display2dName = "o" + (Display2D.display2dIndex++);
    this.width = w;
    this.height = h;


    if (!renderStack) this.renderStack = new RenderStack();
    else this.renderStack = renderStack;

    this._bounds = new Rectangle2D(0, 0, w, h);
    this.cache = new BitmapCache(this);

    this.addEventListener(Display2D.ADDED_TO_STAGE, () => {
      this.updateBounds();
    })

  }

  public get dataString(): string {
    var datas: string = super.dataString;
    datas += "#";
    datas += [this.width, this.height, this.alpha, this.renderStack.REGISTER_ID].join(",");
    return datas;
  }
  public static fromDataString(data: string, target?: Display2D): Display2D {
    var t: string[] = data.split("#")[2].split(",");
    //console.log(t);
    var o: Display2D;
    if (!target) o = new Display2D(Number(t[0]), Number(t[1]), ObjectLibrary.instance.getObjectByRegisterId(t[3]));
    else o = target;

    o.alpha = Number(t[2]);
    Matrix2D.fromDataString(data, o);
    return o;
  }


  /*

     bitmap to geometry

    //----------------

    faire en sorte qu'on puisse pusher une RenderStack dans une RenderStack

    gérer les stack de
      - globalCompositeOperation
      - pixel manipulation

    fx basé sur une renderstack
       - tint --> source + globalCompositeOperation +(SquarePath + Fill)

  */

  public get fillStrokeDrawable(): boolean { return this._cacheAsBitmap == false || this.cache.needsUpdate == true }

  public get display2dName(): string { return this._display2dName }
  public get useComplexHitTest(): boolean { return this.useBasicHitTest == false && this.mouseEnabled }

  public setStage(stage: Stage2D | null) {
    this._stage = stage;
    if (stage) {
      this.dispatchEvent(Display2D.ADDED_TO_STAGE);
      this.mouse = stage.mouseControler;
    } else {
      this.dispatchEvent(Display2D.REMOVED_FROM_STAGE);
      this.mouse = null;
    }

  }
  public get stage(): Stage2D | null { return this._stage; }

  public align(displayAlign: Pt2D = Align.CENTER): void {
    this.axis = displayAlign.clone();

    //this.renderStack.updateBounds(this);
  }

  public updateBounds(): Rectangle2D {
    const frameId = this.stage.frameId;
    if (this.boundFrameId == frameId) return this._bounds;

    this.boundFrameId = frameId;
    return this.renderStack.updateBounds(this);
  }


  public stack(renderStackElement: RenderStackable): RenderStackElement {
    return this.renderStack.push(renderStackElement);
  }

  public get cacheAsBitmap(): boolean { return this._cacheAsBitmap; }
  public set cacheAsBitmap(b: boolean) {
    if (b != this._cacheAsBitmap) {
      this._cacheAsBitmap = b;
      if (b) this.cache.needsUpdate = true;
    }


  }
  public get bitmapCache(): BitmapCache { return this.cache; }





  public get bounds(): Rectangle2D { return this._bounds; }

  public get globalAlpha(): number {
    if (!this.parent) return this.alpha;
    return this.parent.globalAlpha * this.alpha;
  }
  public get globalX(): number { return this.parent ? this.parent.globalX + this.x : this.x };
  public get globalY(): number { return this.parent ? this.parent.globalY + this.y : this.y };
  public get globalScaleX(): number { return this.parent ? this.parent.globalScaleX * this.scaleX : this.scaleX };
  public get globalScaleY(): number { return this.parent ? this.parent.globalScaleY * this.scaleY : this.scaleY };
  public get globalRotation(): number { return this.parent ? this.parent.globalRotation + this.rotation : this.rotation };



  public onMouseOver(): void {
    this.mouseIsOver = true;
    this.dispatchEvent(Display2D.MOUSE_OVER);
  }
  public onMouseOut(): void {
    this.mouseIsOver = false;
    this.dispatchEvent(Display2D.MOUSE_OUT);
  }

  public resetBoundsOffsets(): void {
    this.offsetW = this.offsetH = 0;
  }



  public update(context: CanvasRenderingContext2D): void {
    this.identity();

    this.xAxis = this.bounds.width * this.axis.x / this.scaleX;
    this.yAxis = this.bounds.height * this.axis.y / this.scaleY;

    //if (this.constructor.name == "Group2D") console.log("display ", this.axis.x, this.xAxis, this.yAxis)

    this.inverseW = 1 / this.width;
    this.inverseH = 1 / this.height;

    context.save();
    if (this.parent) this.multiply(this.parent);

    let m: DOMMatrix = this.currentTransform = this.applyTransform();
    (context as any).setTransform(m.a, m.b, m.c, m.d, m.e, m.f);

    this.cache.updateCache();

    if (this.mouseEnabled && this.mouse) this.renderStack.updateWithHitTest(context, this, this.mouse.x, this.mouse.y);
    else this.renderStack.update(context, this);

    context.restore();
  }

}