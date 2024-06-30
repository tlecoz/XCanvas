import { RegisterableObject } from "../../utils/RegisterableObject";
import { PathCommands } from "./PathCommands";

export class MoveToCommand extends RegisterableObject {

  public commandId: number = PathCommands.MOVE_TO;
  public commandLength: number = 2;

  private datas: number[];
  private id: number;

  constructor(startId: number, pathData: number[]) {
    super();
    this.id = startId;
    this.datas = pathData;
  }
  public clone(): MoveToCommand {
    return new MoveToCommand(this.id, this.datas);
  }

  public draw(ctx: CanvasRenderingContext2D, sx: number, sy: number, minScale: number): void {
    minScale;
    const id = this.id;
    const datas = this.datas;
    ctx.moveTo(datas[id] * sx, datas[id + 1] * sy);
  }

  public getLength(): number { return 0 };
  public getPointAtPercent(pct: number): { x: number, y: number } {
    pct;
    return { x: this.datas[this.id], y: this.datas[this.id + 1] }
  }

  public get x(): number { return this.datas[this.id]; }
  public set x(n: number) { this.datas[this.id] = n; }

  public get y(): number { return this.datas[this.id + 1]; }
  public set y(n: number) { this.datas[this.id + 1] = n; }

}
