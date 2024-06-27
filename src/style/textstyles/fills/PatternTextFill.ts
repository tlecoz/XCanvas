import { BitmapData } from "../../../bitmap/BitmapData";
import { Display2D } from "../../../display/Display2D";
import { ObjectLibrary } from "../../../utils/ObjectLibrary";
import { Pattern } from "../../Pattern";
import { TextStyle } from "../../TextStyle";
import { TextPath } from "../TextPath";

export class PatternTextFill extends Pattern {

  constructor(textStyle: TextStyle, bd: BitmapData, crop: boolean = true, applyTargetScale: boolean = false) {
    super(bd, crop, applyTargetScale)
    this.styleType = "fillStyle";
    this.textStyle = textStyle;

  }

  public clone(): PatternTextFill {
    return new PatternTextFill(this.textStyle.clone(), this.bitmapData.clone(), this.crop, this.applyTargetScale);
  }

  public get dataString(): string {
    var crop: number = 0;
    var targetScale: number = 0;
    if (this.crop) crop = 1;
    if (this.applyTargetScale) targetScale = 1;
    return this.textStyle.REGISTER_ID + "," + this.source.REGISTER_ID + "," + crop + "," + targetScale;
  }
  public static fromDataString(data: string): PatternTextFill {
    var t: string[] = data.split(",");
    return new PatternTextFill(ObjectLibrary.instance.getObjectByRegisterId(t[0]), ObjectLibrary.instance.getObjectByRegisterId(t[1]), t[2] == "1", t[3] == "1");
  }

  public apply(context: CanvasRenderingContext2D, path: TextPath, target: Display2D): void {

    this.textStyle.apply(context, path, target);
    super.apply(context, path, target);
    if (target.fillStrokeDrawable) context.fillText(path.text, this.textStyle.offsetX / target.width, this.textStyle.offsetY / target.height);

  }
}
