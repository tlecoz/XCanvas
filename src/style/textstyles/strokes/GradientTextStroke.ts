import { GradientColor } from "../../../color/GradientColor";
import { Display2D } from "../../../display/Display2D";
import { ObjectLibrary } from "../../../utils/ObjectLibrary";
import { Gradient } from "../../Gradient";
import { TextStyle } from "../../TextStyle";
import { TextPath } from "../TextPath";

export class GradientTextStroke extends Gradient {

  constructor(textStyle: TextStyle, gradient: GradientColor, isLinear: boolean = true) {
    super(gradient, isLinear)
    this.styleType = "strokeStyle";
    this.textStyle = textStyle;

  }

  public clone(): GradientTextStroke {
    return new GradientTextStroke(this.textStyle.clone(true), this.gradient.clone(true), this.isLinear);
  }


  public get dataString(): string {
    var linear: number = 0;
    if (this.isLinear) linear = 1;
    return this.textStyle.REGISTER_ID + "," + this.gradient.REGISTER_ID + "," + linear;
  }
  public static fromDataString(data: string): GradientTextStroke {
    var t: string[] = data.split(",");
    return new GradientTextStroke(ObjectLibrary.instance.getObjectByRegisterId(t[0]), ObjectLibrary.instance.getObjectByRegisterId(t[1]), t[2] == "1");
  }



  public apply(context: CanvasRenderingContext2D, path: TextPath, target: Display2D): void {

    this.textStyle.apply(context, path, target);
    super.apply(context, path, target);
    if (target.fillStrokeDrawable) context.strokeText(path.text, this.textStyle.offsetX / target.width, this.textStyle.offsetY / target.height);

  }
}
