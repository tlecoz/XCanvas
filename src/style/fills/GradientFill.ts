import { GradientColor } from "../../color/GradientColor";
import { Display2D } from "../../display/Display2D";
import { Path } from "../../graphics/Path";
import { ObjectLibrary } from "../../utils/ObjectLibrary";
import { Gradient } from "../Gradient";

export class GradientFill extends Gradient {

  constructor(gradient: GradientColor) {
    super(gradient)
    this.styleType = "fillStyle";

  }
  public clone(): GradientFill {
    return new GradientFill(this.gradient.clone(true));
  }

  public get dataString(): string {
    return this.gradient.REGISTER_ID;
  }
  public static fromDataString(data: string): GradientFill {
    var t: string[] = data.split(",");
    return new GradientFill(ObjectLibrary.instance.getObjectByRegisterId(t[0]));
  }

  public apply(context: CanvasRenderingContext2D, path: Path, target: Display2D): void {

    super.apply(context, path, target);
    if (target.fillStrokeDrawable) context.fill(path.path, this.fillPathRule);

  }
}
