import { RegisterableObject } from "../../utils/RegisterableObject";
import { PathCommands } from "./PathCommands";

export class BezierCurveToCommand extends RegisterableObject {

  public commandId: number = PathCommands.BEZIER_CURVE_TO;
  public commandLength: number = 6;

  private datas: number[];
  private id: number;

  constructor(startId: number, pathData: number[]) {
    super();
    this.id = startId;
    this.datas = pathData;
  }
  public clone(): BezierCurveToCommand {
    return new BezierCurveToCommand(this.id, this.datas);
  }
  public draw(ctx: CanvasRenderingContext2D, sx: number, sy: number, minScale: number): void {
    minScale;
    const id = this.id;
    const datas = this.datas;
    ctx.bezierCurveTo(datas[id] * sx, datas[id + 1] * sy, datas[id + 2] * sx, datas[id + 3] * sy, datas[id + 4] * sx, datas[id + 5] * sy);
  }

  public getPointAtPercent(pct: number): { x: number, y: number } {
    var x0: number = this.datas[this.id - 3];
    var y0: number = this.datas[this.id - 2];

    var ax0: number = this.datas[this.id];
    var ay0: number = this.datas[this.id + 1];

    var ax1: number = this.datas[this.id + 2];
    var ay1: number = this.datas[this.id + 3];

    var x1: number = this.datas[this.id + 4];
    var y1: number = this.datas[this.id + 5];

    const cX = 3 * (ax0 - x0);
    const bX = 3 * (ax1 - ax0) - cX;
    const aX = x1 - x0 - cX - bX;

    const cY = 3 * (ay0 - y0);
    const bY = 3 * (ay1 - ay0) - cY;
    const aY = y1 - y0 - cY - bY;

    return {
      x: (aX * Math.pow(pct, 3)) + (bX * Math.pow(pct, 2)) + (cX * pct) + x0,
      y: (aY * Math.pow(pct, 3)) + (bY * Math.pow(pct, 2)) + (cY * pct) + y0
    }
  }

  public getLength(precision: number = 10): number {

    let old: { x: number, y: number } = this.getPointAtPercent(0);
    let next: { x: number, y: number };
    let dx: number, dy: number;
    let dist: number = 0;
    for (let i = 1; i <= precision; i++) {
      next = this.getPointAtPercent(i / precision);
      dx = next.x - old.x;
      dy = next.y - old.y;
      dist += Math.sqrt(dx * dx + dy * dy);
      old = next;
    }
    return dist;
  }

  public get ax0(): number { return this.datas[this.id]; }
  public set ax0(n: number) { this.datas[this.id] = n; }

  public get ay0(): number { return this.datas[this.id + 1]; }
  public set ay0(n: number) { this.datas[this.id + 1] = n; }

  public get ax1(): number { return this.datas[this.id + 2]; }
  public set ax1(n: number) { this.datas[this.id + 2] = n; }

  public get ay1(): number { return this.datas[this.id + 3]; }
  public set ay1(n: number) { this.datas[this.id + 3] = n; }

  public get x1(): number { return this.datas[this.id + 4]; }
  public set x1(n: number) { this.datas[this.id + 4] = n; }

  public get y1(): number { return this.datas[this.id + 5]; }
  public set y1(n: number) { this.datas[this.id + 5] = n; }
}
