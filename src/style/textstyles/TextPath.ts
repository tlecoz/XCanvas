import { RegisterableObject } from "../../utils/RegisterableObject";

export class TextPath extends RegisterableObject {

  public text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }

  public get dataString(): string { return this.text; }
  public static fromDataString(data: string) { return new TextPath(data); }


  //@ts-ignore
  public isPointInside(context, px: number, py: number, isStroke: boolean, fillrule = "nonzero"): boolean {
    return false;
  }
  //@ts-ignore
  public isPointInPath(context: CanvasRenderingContext2D, px: number, py: number): boolean {
    return false;
  }
  //@ts-ignore
  public isPointInStroke(context: CanvasRenderingContext2D, px: number, py: number): boolean {
    return false;
  }
}
