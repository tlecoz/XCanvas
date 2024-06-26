import { MouseControler } from "../controlers/MouseControler";
import { Browser } from "../utils/Browser";
import { Group2D } from "./Group2D";

export class Stage2D extends Group2D {

  public static DRAW_BEGIN: string = "DRAW_BEGIN";
  public static DRAW_END: string = "DRAW_END";

  protected _canvas: HTMLCanvasElement;
  protected _output: HTMLCanvasElement;
  protected _outputContext: CanvasRenderingContext2D | any;
  protected _context: CanvasRenderingContext2D;
  protected _mouseControler: MouseControler;

  protected _frameId: number = 0;
  protected _started: boolean = false;

  public clearColor: string = "#000";
  public autoClear: boolean = true;



  constructor(w: number | HTMLCanvasElement, h: number = 0, appendOnBody: boolean = true) {
    super();
    this._stage = this;

    //console.log("Stage2D canUseOffscreenCanvas = ", Browser.canUseOffscreenCanvas)

    if (w instanceof HTMLCanvasElement) {
      appendOnBody = false;
      this._output = w;
      this._outputContext = w.getContext("2d");

      this._canvas = document.createElement("canvas");
      this._canvas.width = w.width;
      this._canvas.height = w.height;
      this._context = this._canvas.getContext("2d");

      //this._output.style.position = "absolute";
    } else {
      if (!Browser.canUseOffscreenCanvas) {

        this._canvas = document.createElement("canvas");
        this._output = this._canvas;
        this._output.style.position = "absolute";
        this._outputContext = this._output.getContext("2d");

      } else {

        this._canvas = new (window as any).OffscreenCanvas(w, h);
        this._output = document.createElement("canvas");
        this._output.style.position = "absolute";
        if (Browser.canUseImageBitmap) this._outputContext = this._output.getContext("bitmaprenderer");
        else this._outputContext = this._output.getContext("2d");

      }

      this._canvas.width = this._output.width = w;
      this._canvas.height = this._output.height = h;
      this._context = this._canvas.getContext("2d");

    }



    this._mouseControler = new MouseControler(this._output);

    console.log("new Stage2D ", w, h, appendOnBody)
    if (appendOnBody) document.body.appendChild(this._output);
  }

  public get dataString(): string {
    //this.width = this.canvas.width;
    //this.height = this.canvas.height;
    var o = super.dataString + "###" + this._canvas.width + "," + this._canvas.height;
    //this.width = this.height = 1;
    return o;
  }
  public static fromDataString(data: string): Stage2D {
    var t: string[] = data.split("###");
    var sizes: string[] = t[1].split(",");
    data = t[0];
    var t: string[] = data.split("#")[2].split(",");
    //console.log("stage data = ",data)
    //console.log(data);
    //console.log(sizes)
    var o: Stage2D = new Stage2D(Number(sizes[0]), Number(sizes[1]), true);
    Group2D.fromDataString(data, o);
    return o;
  }


  public get canvas(): HTMLCanvasElement { return this._canvas; }
  public get outputCanvas(): HTMLCanvasElement { return this._output; }
  public get context(): CanvasRenderingContext2D { return this._context; }
  public get mouseControler(): MouseControler { return this._mouseControler; }
  public get globalAlpha(): number { return this.alpha; }

  public get globalX(): number { return this.x };
  public get globalY(): number { return this.y };
  public get globalScaleX(): number { return this.scaleX };
  public get globalScaleY(): number { return this.scaleY };
  public get globalRotation(): number { return this.rotation };

  public get stageWidth(): number { return this._canvas.width }
  public get stageHeight(): number { return this._canvas.height }

  public get realWidth(): number {

    return this.stageWidth;
  }
  public get realHeight(): number {

    return this.stageHeight;
  }

  public get frameId(): number { return this._frameId }

  public clearElements(): void {
    const len = this.numChildren;
    for (let i = len - 1; i >= 0; i--) {
      const child = this.children[i];
      child.clearEvents();
      this.removeChild(child);
    }
  }
  public resetFrameId(): void {
    this._frameId = 0;
  }


  public clear() {
    this._context.fillStyle = this.clearColor
    this._context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }



  public drawElements(): void {
    if (this.children.length == 0) return;

    if (this.autoClear) this.clear();


    this.dispatchEvent(Stage2D.DRAW_BEGIN);

    super.update(this._context);



    if (Browser.canUseImageBitmap) {

      createImageBitmap(this._canvas).then((bmp) => this._outputContext.transferFromImageBitmap(bmp));
    } else {

      this._outputContext.drawImage(this._canvas, 0, 0);
    }


    this.dispatchEvent(Stage2D.DRAW_END);

    //console.log(this.waitingBound)
    if (this.waitingBound) {
      console.log("stage call updateBounds")
      this.updateBounds();
    }

    this._frameId++;



  }

}
