import { GradientColor } from "../../color/GradientColor";
import { Display2D } from "../../display/Display2D";
import { Path } from "../../graphics/Path";
import { ObjectLibrary } from "../../utils/ObjectLibrary";
import { Gradient } from "../Gradient";
import { LineStyle } from "../LineStyle";

export class GradientStroke extends Gradient {

  constructor(gradient: GradientColor, isLinear: boolean = true, lineStyle: LineStyle = null) {
    super(gradient, isLinear)
    this.styleType = "strokeStyle";
    this.lineStyle = lineStyle ? lineStyle : new LineStyle(2);

  }
  public get dataString(): string {
    var linear: number = 0;
    if (this.isLinear) linear = 1;

    console.log("GradientStroke lineStyle = ", this.lineStyle)

    return this.gradient.REGISTER_ID + "," + linear + "," + (this.lineStyle ? this.lineStyle.REGISTER_ID : "null");
  }
  public static fromDataString(data: string): GradientStroke {
    var t: string[] = data.split(",");
    return new GradientStroke(ObjectLibrary.instance.getObjectByRegisterId(t[0]), t[1] == "1", ObjectLibrary.instance.getObjectByRegisterId(t[2]));
  }

  public apply(context: CanvasRenderingContext2D, path: Path, target: Display2D): void {


    if (this.lineStyle) this.lineStyle.apply(context, path, target);
    super.apply(context, path, target);
    if (target.fillStrokeDrawable) context.stroke(path.path);


  }
}
