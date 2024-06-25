import { SolidColor } from "../../color/SolidColor";
import { ObjectLibrary } from "../../utils/ObjectLibrary";
import { Filter } from "./Filter";

export class DropShadowFilter extends Filter {
  constructor(offsetX: number, offsetY: number, radius: number, color: SolidColor | string) {
    super();
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.radius = radius;
    if (color instanceof SolidColor) this.color = color;
    else this.color = new SolidColor(color);

    //this.color.addEventListener(SolidColor.UPDATE_STYLE,this._updateColor)
  }


  public get dataString(): string {
    return [this.offsetX, this.offsetY, this.radius, this.color.REGISTER_ID].join(",");
  }
  public static fromDataString(data: string): DropShadowFilter {
    var t: string[] = data.split(",")
    return new DropShadowFilter(Number(t[0]), Number(t[1]), Number(t[2]), ObjectLibrary.instance.getObjectByRegisterId(t[3]));
  }



  public clone(cloneColor: boolean = false): DropShadowFilter {
    if (!cloneColor) return new DropShadowFilter(this._offsetX, this._offsetY, this._radius, this._color);
    return new DropShadowFilter(this._offsetX, this._offsetY, this._radius, this._color.clone());
  }
  public get value(): string { return "drop-shadow(" + this._offsetX + "px " + this._offsetY + "px " + this._radius + "px " + this._color.style + ") "; }

}
