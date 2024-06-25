import { SolidColor } from "../../color/SolidColor";
import { ObjectLibrary } from "../../utils/ObjectLibrary";
import { DropShadowFilter } from "./DropShadowFilter";

export class GlowFilter extends DropShadowFilter {
  constructor(radius: number, color: SolidColor | string) {
    super(0, 0, radius, color);
  }

  public get dataString(): string {
    return this.radius + "," + this.color.REGISTER_ID;
  }
  public static fromDataString(data: string): GlowFilter {
    var t: string[] = data.split(",")
    return new GlowFilter(Number(t[0]), ObjectLibrary.instance.getObjectByRegisterId(t[1]));
  }


  public clone(cloneColor: boolean = false): GlowFilter {
    if (cloneColor) return new GlowFilter(this._radius, this._color.clone());
    return new GlowFilter(this._radius, this._color);
  }
}
