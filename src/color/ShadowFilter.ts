import { SolidColor } from "./SolidColor";

export class ShadowFilter {

  public static NO_SHADOW: ShadowFilter = new ShadowFilter(SolidColor.INVISIBLE_COLOR, 0, 0, 0);

  public solidColor: SolidColor;
  public blur: number;
  public offsetX: number;
  public offsetY: number;

  constructor(solidColor: SolidColor, blur: number, offsetX: number, offsetY: number) {
    this.solidColor = solidColor;
    this.blur = blur;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  public apply(context2D: CanvasRenderingContext2D): void {
    context2D.shadowColor = this.solidColor.style as string;
    context2D.shadowBlur = this.blur;
    context2D.shadowOffsetX = this.offsetX;
    context2D.shadowOffsetY = this.offsetY;
  }
}
