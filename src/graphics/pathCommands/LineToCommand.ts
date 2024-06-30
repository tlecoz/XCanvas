import { RegisterableObject } from "../../utils/RegisterableObject";
import { PathCommands } from "./PathCommands";

export class LineToCommand extends RegisterableObject {

  public commandId: number = PathCommands.LINE_TO;
  public commandLength: number = 2;
  private datas: number[];
  private id: number;

  constructor(startId: number, pathData: number[]) {
    super();
    this.id = startId;
    this.datas = pathData;
  }

  public clone(): LineToCommand {
    return new LineToCommand(this.id, this.datas);
  }

  public draw(ctx: CanvasRenderingContext2D, sx: number, sy: number, minScale: number): void {
    minScale;
    const id = this.id;
    const datas = this.datas;
    ctx.lineTo(datas[id] * sx, datas[id + 1] * sy);
  }

  public getPointAtPercent(pct: number): { x: number, y: number } {
    const x0 = this.datas[this.id + 0];
    const y0 = this.datas[this.id + 1];
    const dx = x0 - this.datas[this.id - 3];
    const dy = y0 - this.datas[this.id - 2];
    const d = Math.sqrt(dx * dx + dy * dy);
    const a = Math.atan2(dy, dx);
    return {
      x: x0 + Math.cos(a) * d * pct,
      y: y0 + Math.sin(a) * d * pct,
    }
  }

  public getLength(): number {
    const x0 = this.datas[this.id + 0];
    const y0 = this.datas[this.id + 1];
    const dx = x0 - this.datas[this.id - 2];
    const dy = y0 - this.datas[this.id - 1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  public get x(): number { return this.datas[this.id]; }
  public set x(n: number) { this.datas[this.id] = n; }

  public get y(): number { return this.datas[this.id + 1]; }
  public set y(n: number) { this.datas[this.id + 1] = n; }

}
