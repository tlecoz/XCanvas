import { RegisterableObject } from "../../utils/RegisterableObject";
import { PathCommands } from "./PathCommands";

export class QuadraticCurveToCommand extends RegisterableObject {

  public commandId: number = PathCommands.QUADRATIC_CURVE_TO;
  public commandLength: number = 4;

  private datas: number[];
  private id: number;

  constructor(startId: number, pathData: number[]) {
    super();
    this.id = startId;
    this.datas = pathData;
  }
  public clone(): QuadraticCurveToCommand {
    return new QuadraticCurveToCommand(this.id, this.datas);
  }
  public draw(ctx: CanvasRenderingContext2D, sx: number, sy: number, minScale: number): void {
    minScale;
    const id = this.id;
    const datas = this.datas;
    ctx.quadraticCurveTo(datas[id] * sx, datas[id + 1] * sy, datas[id + 2] * sx, datas[id + 3] * sy);
  }

  public static getPointAtPercent(x0: number, y0: number, ax: number, ay: number, x1: number, y1: number, t: number): { x: number, y: number } {

    return {
      x: (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * ax + t * t * x1,
      y: (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * ay + t * t * y1
    }
  }

  public getPointAtPercent(pct: number): { x: number, y: number } {
    return QuadraticCurveToCommand.getPointAtPercent(
      this.datas[this.id - 3],
      this.datas[this.id - 2],
      this.datas[this.id],
      this.datas[this.id + 1],
      this.datas[this.id + 2],
      this.datas[this.id + 3],
      pct
    );
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

  public get ax(): number { return this.datas[this.id]; }
  public set ax(n: number) { this.datas[this.id] = n; }

  public get ay(): number { return this.datas[this.id + 1]; }
  public set ay(n: number) { this.datas[this.id + 1] = n; }

  public get x1(): number { return this.datas[this.id + 2]; }
  public set x1(n: number) { this.datas[this.id + 2] = n; }

  public get y1(): number { return this.datas[this.id + 3]; }
  public set y1(n: number) { this.datas[this.id + 3] = n; }
}
