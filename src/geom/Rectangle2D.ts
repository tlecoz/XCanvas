export class Rectangle2D {

  public minX: number = 999999;
  public minY: number = 999999;
  public maxX: number = -999999;
  public maxY: number = -999999;




  constructor(minX: number = 0, minY: number = 0, maxX: number = 0, maxY: number = 0) {
    this.init(minX, minY, maxX, maxY);
  }

  public init(minX: number = 0, minY: number = 0, maxX: number = 0, maxY: number = 0): Rectangle2D {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
    return this;
  }

  public add(r: Rectangle2D) {

    if (r.maxX > this.maxX) this.maxX = r.maxX;
    if (r.maxY > this.maxY) this.maxY = r.maxY;
    if (r.minX < this.minX) this.minX = r.minX;
    if (r.minY < this.minY) this.minY = r.minY;
  }

  public addPoint(pt: { x: number, y: number }) {
    if (pt.x > this.maxX) this.maxX = pt.x;
    if (pt.y > this.maxY) this.maxY = pt.y;
    if (pt.x < this.minX) this.minX = pt.x;
    if (pt.y < this.minY) this.minY = pt.y;
  }

  public get x(): number { return this.minX }
  public set x(n: number) { this.minX = n; }

  public get y(): number { return this.minY }
  public set y(n: number) { this.minY = n; }

  public get width(): number { return this.maxX - this.minX }
  public set width(n: number) { this.maxX = this.minX + n; }

  public get height(): number { return this.maxY - this.minY }
  public set height(n: number) { this.maxY = this.minY + n; }

  public clear(): void { this.x = this.y = this.width = this.height = 0 }

  public draw(context: CanvasRenderingContext2D): void {
    context.save();
    context.strokeStyle = "#000000";
    context.rect(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
    context.stroke();
    context.restore();
  }






}
