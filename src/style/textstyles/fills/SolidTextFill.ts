import { SolidColor } from "../../../color/SolidColor";
import { Display2D } from "../../../display/Display2D";
import { ObjectLibrary } from "../../../utils/ObjectLibrary";
import { Solid } from "../../Solid";
import { TextStyle } from "../../TextStyle";
import { TextPath } from "../TextPath";

export class SolidTextFill extends Solid {

  constructor(textStyle: TextStyle, r: number | SolidColor | string = "#000000", g: number = null, b: number = null, a: number = null) {
    super(r, g, b, a);
    this.styleType = "fillStyle";
    this.textStyle = textStyle;

  }

  public clone(): SolidTextFill {
    return new SolidTextFill(this.textStyle.clone(true), this.color.clone());
  }

  public get dataString(): string {
    return this.textStyle.REGISTER_ID + "," + this.color.REGISTER_ID;
  }
  public static fromDataString(data: string): SolidTextFill {
    var t: string[] = data.split(",");
    return new SolidTextFill(ObjectLibrary.instance.getObjectByRegisterId(t[0]), ObjectLibrary.instance.getObjectByRegisterId(t[1]));
  }
  public apply(context: CanvasRenderingContext2D, path: TextPath, target: Display2D): void {

    this.textStyle.apply(context, path, target);
    super.apply(context, path, target);
    if (target.fillStrokeDrawable) context.fillText(path.text, this.textStyle.offsetX / target.width, this.textStyle.offsetY / target.height);

  }
}
