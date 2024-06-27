import { BitmapData } from "../../bitmap/BitmapData";
import { Display2D } from "../../display/Display2D";
import { Path } from "../../graphics/Path";
import { ObjectLibrary } from "../../utils/ObjectLibrary";
import { LineStyle } from "../LineStyle";
import { Pattern } from "../Pattern";

export class PatternStroke extends Pattern {

  constructor(source: BitmapData, crop: boolean = true, applyTargetScale: boolean = false, lineStyle: LineStyle = null) {
    super(source, crop, applyTargetScale)
    this.styleType = "strokeStyle";
    this.lineStyle = lineStyle ? lineStyle : new LineStyle(2);

  }

  public clone(): PatternStroke {
    return new PatternStroke(this.bitmapData.clone(), this.crop, this.applyTargetScale, this.lineStyle.clone());
  }

  public get dataString(): string {
    var crop: number = 0;
    var targetScale: number = 0;
    if (this.crop) crop = 1;
    if (this.applyTargetScale) targetScale = 1;
    return this.source.REGISTER_ID + "," + crop + "," + targetScale + "," + (this.lineStyle.REGISTER_ID);
  }
  public static fromDataString(data: string): PatternStroke {
    var t: string[] = data.split(",");
    return new PatternStroke(ObjectLibrary.instance.getObjectByRegisterId(t[0]), t[1] == "1", t[2] == "1", ObjectLibrary.instance.getObjectByRegisterId(t[3]));
  }

  public apply(context: CanvasRenderingContext2D, path: Path, target: Display2D): void {

    if (this.lineStyle) this.lineStyle.apply(context, path, target);
    super.apply(context, path, target);
    if (target.fillStrokeDrawable) context.stroke(path.path);

  }
}
