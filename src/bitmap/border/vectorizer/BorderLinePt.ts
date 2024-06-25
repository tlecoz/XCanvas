import { BorderPt } from "../BorderPt";

export class BorderLinePt {

  public p1: BorderPt;
  public p2: BorderPt;
  public id: number;
  public d: number;
  public a: number;
  public x: number;
  public y: number;

  constructor() {

  }
  public reset() {
    this.p1 = this.p2 = null;
    this.id = this.d = this.a = this.x = this.y = 0;
  }
}
