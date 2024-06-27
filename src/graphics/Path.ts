import { RegisterableObject } from "../utils/RegisterableObject";
import { Geometry } from "./Geometry";

export class Path extends RegisterableObject {

  public static objByType: { count: number, func: (...arg) => void, endXY: number, countOffset: number, useRadius: boolean }[] =
    [
      { func: Path.moveTo, count: 2, endXY: 3, countOffset: 0, useRadius: false },
      { func: Path.lineTo, count: 2, endXY: 3, countOffset: 0, useRadius: false },
      { func: Path.arc, count: 3, endXY: 3, countOffset: 0, useRadius: true },
      { func: Path.quadraticCurveTo, count: 4, endXY: 5, countOffset: 0, useRadius: false },
      { func: Path.rect, count: 4, endXY: 3, countOffset: 0, useRadius: false },
      { func: Path.arc, count: 5, endXY: 3, countOffset: 2, useRadius: true },
      { func: Path.arcTo, count: 2, endXY: 3, countOffset: 2, useRadius: true },
      { func: Path.bezierCurveTo, count: 6, endXY: 7, countOffset: 0, useRadius: false }
    ];



  protected _path: Path2D;
  protected _originalW: number;
  protected _originalH: number;
  protected _originalX: number;
  protected _originalY: number;
  protected _geom: Geometry;

  protected datas: number[]
  protected bounds: { x: number, y: number, w: number, h: number } = { x: 0, y: 0, w: 0, h: 0 };



  constructor(pathData: number[] = null) {
    super();
    this._path = new Path2D();
    if (!pathData) this.datas = [];
    else {
      this.datas = pathData;
      this.computePath();
    }
  }

  public get dataString(): string { return this.datas.join(","); }

  public static fromDataString(data: string): Path {
    var t = data.split(",");
    var t2 = [];
    let i: number, len: number = t.length;
    for (i = 0; i < len; i++) t2[i] = Number(t[i]);
    return new Path(t2);
  }


  public newPath(): Path2D {
    this._path = new Path2D();
    return this._path;
  }

  public isPointInPath(context: CanvasRenderingContext2D, px: number, py: number, fillrule: CanvasFillRule = "nonzero"): boolean {

    return context.isPointInPath(this.path, px, py, fillrule);
  }
  public isPointInStroke(context: CanvasRenderingContext2D, px: number, py: number): boolean {
    return context.isPointInStroke(this.path, px, py);
  }

  public isPointInside(context, px: number, py: number, isStroke: boolean, fillrule = "nonzero"): boolean {
    if (isStroke) return context.isPointInStroke(this.path, px, py);
    return context.isPointInPath(this.path, px, py, fillrule);
  }


  public get originalW(): number { return this._originalW; }
  public get originalH(): number { return this._originalH; }
  public get originalX(): number { return this._originalX; }
  public get originalY(): number { return this._originalY; }

  public moveTo(x: number, y: number): void { this.datas.push(0, x, y); }//0
  public lineTo(x: number, y: number): void { this.datas.push(1, x, y); }//1
  public circle(x: number, y: number, radius: number): void {
    //console.log(x,y,radius);
    this.arc(x, y, radius)
  }//2
  public quadraticCurveTo(ax: number, ay: number, x: number, y: number): void { this.datas.push(3, ax, ay, x, y); }//3
  public rect(x: number, y: number, w: number, h: number): void { this.datas.push(4, x, y, w, h); }//4
  public arc(x: number, y: number, radius: number, startAngle: number = 0, endAngle: number = Math.PI * 2): void {
    //console.log(5,x,y,radius,startAngle,endAngle)
    this.datas.push(5, x, y, radius, startAngle, endAngle);
  }//5
  public arcTo(x0: number, y0: number, x1: number, y1: number, radius: number): void { this.datas.push(6, x0, y0, x1, y1, radius); }//6
  public bezierCurveTo(ax0: number, ay0: number, ax1: number, ay1: number, x1: number, y1: number): void { this.datas.push(7, ax0, ay0, ax1, ay1, x1, y1); }//7

  private static moveTo(path: Path2D, datas: number[], i: number): void {
    path.moveTo(datas[i + 1], datas[i + 2]);
  }
  private static lineTo(path: Path2D, datas: number[], i: number): void {
    path.lineTo(datas[i + 1], datas[i + 2]);
  }

  //@ts-ignore
  private static circle(path: Path2D, datas: number[], i: number): void {
    path.arc(datas[i + 1], datas[i + 2], datas[i + 3], 0, Math.PI * 2);
  }
  private static rect(path: Path2D, datas: number[], i: number): void {
    path.rect(datas[i + 1], datas[i + 2], datas[i + 3], datas[i + 4]);
  }
  private static quadraticCurveTo(path: Path2D, datas: number[], i: number): void {
    path.quadraticCurveTo(datas[i + 1], datas[i + 2], datas[i + 3], datas[i + 4]);
  }
  private static arc(path: Path2D, datas: number[], i: number): void {
    //console.log(datas[i+1],datas[i+2],datas[i+3],datas[i+4],datas[i+5])
    path.arc(datas[i + 1], datas[i + 2], datas[i + 3], datas[i + 4], datas[i + 5]);
  }
  private static arcTo(path: Path2D, datas: number[], i: number): void {
    path.arc(datas[i + 1], datas[i + 2], datas[i + 3], datas[i + 4], datas[i + 5]);
  }
  private static bezierCurveTo(path: Path2D, datas: number[], i: number): void {
    //console.log("bezierCurveTo ",datas[i+1],datas[i+2],datas[i+3],datas[i+4],datas[i+5],datas[i+6])
    path.bezierCurveTo(datas[i + 1], datas[i + 2], datas[i + 3], datas[i + 4], datas[i + 5], datas[i + 6]);
  }

  public get path(): Path2D { return this._path; }
  public get geometry(): Geometry { return this._geom; }
  public get pathDatas(): number[] { return this.datas; }



  public computePath(): Geometry {
    let i: number, j: number, type: number, minX: number = 9999999, minY: number = 9999999, maxX: number = -9999999, maxY: number = -9999999;
    //let a: number, b: number, c: number, d: number, e: number, f: number;
    let nb: number, start: number, val: number;
    let datas: number[] = this.datas;
    let func: (...arg) => void;
    let count: number, countOffset: number;
    let useRadius: boolean;
    let minRadius: number = 9999999, maxRadius: number = -999999;
    //let NB: number = 0;
    let o: { count: number, func: (...arg) => void, endXY: number, countOffset: number, useRadius: boolean };
    const len: number = datas.length;
    const objByType = Path.objByType;
    //const normalizeData:number[] = datas.concat();
    //datas = normalizeData;

    for (i = 0; i < len; i += (count + 1)) {
      type = datas[i];
      o = objByType[type];
      //console.log(i," type = ",type )
      count = o.count;//countByType[type];
      countOffset = o.countOffset;
      useRadius = o.useRadius;

      start = i + 1;

      nb = count - countOffset;
      nb += start;

      if (useRadius) nb--;


      for (j = start; j < nb; j++) {
        val = datas[j];

        if (val < minX) minX = val;
        if (val < minY) minY = val;
        if (val > maxX) maxX = val;
        if (val > maxY) maxY = val;
      }

      if (useRadius) {
        val = datas[nb];

        if (val < minRadius) minRadius = val;
        if (val > maxRadius) maxRadius = val;
      }
    }

    //if(useRadius) nb++

    let dx = maxX - minX;
    let dy = maxY - minY;
    //let distRadius = 0;
    if (useRadius) {
      dx = 1//minRadius;
      dy = 1//minRadius;
      minX = minY = 0;
      //distRadius = 1 + maxRadius - minRadius;
    }


    this._originalW = Math.abs(dx);
    this._originalH = Math.abs(dy);
    this._originalX = minX;
    this._originalY = minY;

    //const dist = Math.sqrt(dx * dx + dy * dy);

    //console.log("distRadius => ",distRadius+" = "+maxRadius+" - "+minRadius)
    const path: Path2D = this._path;

    //let endXY: number;
    //let isXY: boolean;
    for (i = 0; i < len; i += (count + 1)) {
      type = datas[i];
      o = objByType[type];
      func = o.func;//funcByType[type];
      count = o.count;//countByType[type];
      countOffset = o.countOffset;
      useRadius = o.useRadius;
      //endXY = o.endXY;
      start = i + 1;




      nb = start + count - countOffset;
      //console.log(datas);
      //console.log(minX,minY,dx,dy);
      if (useRadius) nb--;

      for (j = start; j < nb; j++) {
        val = datas[j];

        //isXY = j < endXY;

        if (j % 2 == 0) {
          val -= minX;
          val /= dx;
        } else {
          val -= minY;
          val /= dy;
        }
        //console.log("datas["+j+"] = ",val);
        datas[j] = val;
      }

      if (useRadius) {
        val = datas[nb];

        //val -= minRadius;
        //val /= (distRadius);
        //console.log("val ",nb," = ",val)
        datas[nb] = val;
        //console.log("datas["+nb+"] = ",val+" ### "+distRadius);
      }

      func(path, datas, start - 1);
    }
    //console.log(this.datas);
    this._geom = new Geometry(this);

    return this._geom;

  }




}
