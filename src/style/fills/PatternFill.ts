import { BitmapData } from "../../bitmap/BitmapData";
import { Display2D } from "../../display/Display2D";
import { Path } from "../../graphics/Path";
import { ObjectLibrary } from "../../utils/ObjectLibrary";
import { Pattern } from "../Pattern";

export class PatternFill extends Pattern {

  constructor(source: BitmapData, crop: boolean = true, applyTargetScale: boolean = false) {
    super(source, crop, applyTargetScale)
    this.styleType = "fillStyle";

  }

  public clone(): PatternFill {
    return new PatternFill(this.bitmapData.clone(), this.crop, this.applyTargetScale);
  }

  public get dataString(): string {
    var crop: number = 0;
    var targetScale: number = 0;
    if (this.crop) crop = 1;
    if (this.applyTargetScale) targetScale = 1;
    return this.source.REGISTER_ID + "," + crop + "," + targetScale;
  }
  public static fromDataString(data: string): PatternFill {
    var t: string[] = data.split(",");
    return new PatternFill(ObjectLibrary.instance.getObjectByRegisterId(t[0]), t[1] == "1", t[1] == "1");
  }

  public apply(context: CanvasRenderingContext2D, path: Path, target: Display2D): void {

    super.apply(context, path, target);
    if (target.fillStrokeDrawable) context.fill(path.path, this.fillPathRule);

  }
}
