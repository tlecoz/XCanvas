import { RegisterableObject } from "../../utils/RegisterableObject";
import { PathCommands } from "./PathCommands";
import { QuadraticCurveToCommand } from "./QuadraticCurveToCommand";

export class ArcToCommand extends RegisterableObject {

  public commandId: number = PathCommands.ARC_TO;
  public commandLength: number = 5;

  private datas: number[];
  private id: number;

  constructor(startId: number, pathData: number[]) {
    super();
    this.id = startId;
    this.datas = pathData;
  }

  public clone(): ArcToCommand {
    return new ArcToCommand(this.id, this.datas);
  }

  public draw(ctx: CanvasRenderingContext2D, sx: number, sy: number, minScale: number): void {
    minScale;
    const id = this.id;
    const datas = this.datas;
    ctx.arcTo(datas[id] * sx, datas[id + 1] * sy, datas[id + 2] * sx, datas[id + 3] * sy, datas[id + 4] * minScale);
  }


  public getPointAtPercent(pct: number): { x: number, y: number } {


    var x0: number = this.datas[this.id - 3];
    var y0: number = this.datas[this.id - 2];

    var x1: number = this.datas[this.id];
    var y1: number = this.datas[this.id + 1];

    var x2: number = this.datas[this.id + 2];
    var y2: number = this.datas[this.id + 3];

    var radius: number = this.datas[this.id + 4];

    let dx: number = x1 - x0;
    let dy: number = y1 - y0;
    let a: number = Math.atan2(dy, dx);

    dx = x2 - x1;
    dy = y2 - y1;
    a = Math.atan2(dy, dx);

    let _x1: number = x1 + Math.cos(a) * radius;
    let _y1: number = y1 + Math.sin(a) * radius;

    return QuadraticCurveToCommand.getPointAtPercent(x0, y0, x1, y1, _x1, _y1, pct);
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



  public get x0(): number { return this.datas[this.id]; }
  public set x0(n: number) { this.datas[this.id] = n; }

  public get y0(): number { return this.datas[this.id + 1]; }
  public set y0(n: number) { this.datas[this.id + 1] = n; }

  public get x1(): number { return this.datas[this.id + 2]; }
  public set x1(n: number) { this.datas[this.id + 2] = n; }

  public get y1(): number { return this.datas[this.id + 3]; }
  public set y1(n: number) { this.datas[this.id + 3] = n; }

  public get radius(): number { return this.datas[this.id + 4]; }
  public set radius(n: number) { this.datas[this.id + 4] = n; }

}
