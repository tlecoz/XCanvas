import { GradientColor } from "../../color/GradientColor";
import { Display2D } from "../../display/Display2D";
import { Path } from "../../graphics/Path";
import { ObjectLibrary } from "../../utils/ObjectLibrary";
import { Gradient } from "../Gradient";

export class GradientFill extends Gradient {

  constructor(gradient: GradientColor, isLinear: boolean = true) {
    super(gradient, isLinear)
    this.styleType = "fillStyle";

  }

  public get dataString(): string {
    var linear: number = 0;
    if (this.isLinear) linear = 1;
    return this.gradient.REGISTER_ID + "," + linear;
  }
  public static fromDataString(data: string): GradientFill {
    var t: string[] = data.split(",");
    return new GradientFill(ObjectLibrary.instance.getObjectByRegisterId(t[0]), t[1] == "1");
  }

  public apply(context: CanvasRenderingContext2D, path: Path, target: Display2D): void {

    super.apply(context, path, target);
    if (target.fillStrokeDrawable) context.fill(path.path, this.fillPathRule);

  }
}
