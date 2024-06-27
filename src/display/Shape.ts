import { ObjectLibrary } from "../utils/ObjectLibrary";
import { RegisterableObject } from "../utils/RegisterableObject";
import { Display2D } from "./Display2D";
import { RenderStack } from "./RenderStack";

export class Shape extends RegisterableObject {

  public x: number;
  public y: number;
  public w: number;
  public h: number;

  private renderStack: RenderStack;

  constructor(x: number, y: number, w: number, h: number, renderStack: RenderStack) {
    super();

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.renderStack = renderStack;
  }

  public get dataString(): string {
    return [this.x, this.y, this.w, this.h, this.renderStack.REGISTER_ID].join(",");
  }
  public static fromDataString(data: string): Shape {
    var t: string[] = data.split(",");
    return new Shape(Number(t[0]), Number(t[1]), Number(t[2]), Number(t[3]), ObjectLibrary.instance.getObjectByRegisterId(t[4]));
  }


  public apply(context: CanvasRenderingContext2D, target: Display2D, mouseX: number = Number.MAX_VALUE, mouseY: number = Number.MAX_VALUE): boolean {

    context.save()
    context.translate(this.x * target.inverseW, this.y * target.inverseH);
    context.scale(this.w / target.width, this.h / target.height);

    var b: boolean;

    //console.log(target instanceof Display2D)

    if (target.mouseEnabled) {
      b = this.renderStack.updateWithHitTest(context, target, mouseX, mouseY, true);
      console.log("hit = ", b)
    } else {


      b = this.renderStack.update(context, target, true);
    }
    context.restore();
    return b;
  }


}
