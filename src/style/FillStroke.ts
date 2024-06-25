import { BitmapData } from "../bitmap/BitmapData";
import { Display2D } from "../display/Display2D";
import { Path } from "../graphics/Path";
import { RegisterableObject } from "../utils/RegisterableObject";
import { LineStyle } from "./LineStyle";
import { TextStyle } from "./TextStyle";
import { Filter } from "./filters/Filter";
import { FilterStack } from "./filters/FilterStack";
import { TextPath } from "./textstyles/TextPath";

export type Fillable = Path | TextPath;

export class FillStroke extends RegisterableObject {


  public fillPathRule: "nonzero" | "evenodd" = "nonzero";
  protected styleType: "fillStyle" | "strokeStyle";

  public alpha: number = 1;
  public lineStyle: LineStyle = null;
  public textStyle: TextStyle = null;
  //public filter:CssFilter = null;

  public filters: FilterStack | Filter = null;
  public needsUpdate: boolean = true;
  public static radian: number = Math.PI / 180;

  public offsetW: number = 0;
  public offsetH: number = 0;
  public dirty: boolean = true;


  protected _cacheAsBitmap: boolean = false;
  protected cacheDirty: boolean = false;
  protected cache: BitmapData = null;

  constructor() {
    super();
    //this._filters = new FilterStack();
  }

  //@ts-ignore
  public apply(context: CanvasRenderingContext2D, path: Fillable, target: Display2D): void {
    if (target.fillStrokeDrawable) context.globalAlpha = this.alpha * target.globalAlpha;


    let css: FilterStack | Filter = this.filters;
    if (css) {
      this.dirty = css.dirty;
      if (target.fillStrokeDrawable) context.filter = css.value;
      this.offsetW = css.boundOffsetW;
      this.offsetH = css.boundOffsetH;
    } else {
      context.filter = "none";
    }
  }

  public get cacheAsBitmap(): boolean { return this._cacheAsBitmap }
  public set cacheAsBitmap(b: boolean) {
    if (this._cacheAsBitmap != b) {
      this._cacheAsBitmap = b;
      if (b) this.cacheDirty = true;
    }
  }

  public get isFill(): boolean { return this.styleType == "fillStyle" }
  public get isStroke(): boolean { return this.styleType == "strokeStyle" }


  public get globalOffsetW(): number { return this.offsetW + this.lineWidth }
  public get globalOffsetH(): number { return this.offsetH + this.lineWidth }

  public get lineWidth(): number {
    if (null == this.lineStyle) return 0;
    return this.lineStyle.lineWidth;
  }



}
