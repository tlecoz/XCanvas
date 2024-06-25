import { Display2D } from "../display/Display2D";
import { ObjectLibrary } from "../utils/ObjectLibrary";
import { RegisterableObject } from "../utils/RegisterableObject";
import { LineStyle } from "./LineStyle";
import { TextPath } from "./textstyles/TextPath";

export class TextStyle extends RegisterableObject {


  public fontName: string;
  public fontSize: number;
  public sizeMeasure: string = "px";
  public offsetX: number = 0;
  public offsetY: number = 0;
  public lineStyle: LineStyle | null = null;
  public allowScaleTransform: boolean = false;
  constructor(fontName: string, fontSize: number, sizeMeasure: string = "px", offsetX: number = 0, offsetY: number = 0, allowScaleTransform: boolean = false, lineStyle: LineStyle = null) {
    super();


    this.fontName = fontName;
    this.fontSize = fontSize;
    this.sizeMeasure = sizeMeasure;
    this.offsetX = offsetX + fontSize * 0.2;
    this.offsetY = offsetY + fontSize * 0.85;
    this.allowScaleTransform = allowScaleTransform;
    this.lineStyle = lineStyle;
  }

  public get dataString(): string {
    return [this.fontName, this.fontSize, this.sizeMeasure, this.offsetX, this.offsetY, Number(this.allowScaleTransform), this.lineStyle ? this.lineStyle.REGISTER_ID : "null"].join(",");
  }
  public static fromDataString(data: string): TextStyle {
    let t: string[] = data.split(",");
    let o: TextStyle = new TextStyle(t[0], Number(t[1]), t[2], Number(t[3]), Number(t[4]), t[5] == "1", ObjectLibrary.instance.getObjectByRegisterId(t[6]));
    return o;
  }


  public clone(cloneTextLineStyle: boolean = true): TextStyle {
    let t: LineStyle = null;
    if (this.lineStyle) {
      if (cloneTextLineStyle) t = this.lineStyle.clone();
      else t = this.lineStyle;
    }
    let s: TextStyle = new TextStyle(this.fontName, this.fontSize, this.sizeMeasure, this.offsetX, this.offsetY);
    s.lineStyle = t;
    return s;
  }
  public apply(context: CanvasRenderingContext2D, path: TextPath, target: Display2D): void {
    var s = Math.max(target.width, target.height);
    if (this.lineStyle) this.lineStyle.apply(context, path, target);
    context.font = (this.fontSize / s) + this.sizeMeasure + " " + this.fontName;
    if (this.allowScaleTransform == false) context.scale(1 / target.scaleX, 1 / target.scaleY);
  }


}
