import { SolidColor } from "../../color/SolidColor";
import { Display2D } from "../../display/Display2D";
import { Path } from "../../graphics/Path";
import { ObjectLibrary } from "../../utils/ObjectLibrary";
import { LineStyle } from "../LineStyle";
import { Solid } from "../Solid";

export class SolidStroke extends Solid {



  constructor(r: number | SolidColor | string = "#000000", g: number | LineStyle = null, b: number = null, a: number = null, lineStyle: LineStyle = null) {

    if (g instanceof LineStyle) {
      lineStyle = g;
      g = null;
    }


    super(r, g as number, b, a);
    this.styleType = "strokeStyle";
    if (!lineStyle) this.lineStyle = new LineStyle(2);
    else this.lineStyle = lineStyle;
  }

  public get dataString(): string {
    return this.color.REGISTER_ID + "," + (this.lineStyle ? this.lineStyle.REGISTER_ID : "null");
  }
  public static fromDataString(data: string): SolidStroke {
    const t: string[] = data.split(",")
    return new SolidStroke(ObjectLibrary.instance.getObjectByRegisterId(t[0]), null, null, null, ObjectLibrary.instance.getObjectByRegisterId(t[1]));
  }

  public apply(context: CanvasRenderingContext2D, path: Path, target: Display2D): void {

    //console.log("SolidStroke.lineStyle = ", this.lineStyle)

    if (this.lineStyle) this.lineStyle.apply(context, path, target);
    super.apply(context, path, target);
    if (target.fillStrokeDrawable) context.stroke(path.path);

  }
}
