import { Display2D } from "../display/Display2D";
import { EarCutting } from "../geom/EarCutting";
import { Rectangle2D } from "../geom/Rectangle2D";
import { Path } from "./Path";

export class Geometry {

  public static curvePointMax: number = 5;
  public static curvePointDistance: number = 10;

  private oldX: number;
  private oldY: number;
  private minX: number;
  private minY: number;
  private maxX: number;
  private maxY: number;

  //private bounds: Rectangle2D;

  protected _shapeBounds: { minX: number, minY: number, maxX: number, maxY: number }[];
  protected _boundPoints: DOMPoint[][];
  protected _shapePoints: DOMPoint[];
  protected _shapeXYs: number[][];
  protected _shapeXY: number[];
  protected _nbShape: number = 0;
  protected _nbBoundPoint: number = 0;
  protected _indexs: number[][];

  protected firstPoint: any;
  protected lastPoint: any;

  constructor(path: Path = null) {
    //this.bounds = new Rectangle2D();
    if (path) this.getPoints(path.pathDatas);
  }

  public get trianglePoints(): any { return this._boundPoints; }
  public get triangleIndexs(): any { return this._indexs; }

  public getBounds(target: Display2D, offsetW: number, offsetH: number): Rectangle2D {
    let p: any = this.firstPoint;
    let trans: DOMPoint;
    let tx: number, ty: number;
    let minX: number = 99999999;
    let minY: number = 99999999;
    let maxX: number = -99999999;
    let maxY: number = -99999999;



    let m: DOMMatrix = target.domMatrix;
    let ox: number = offsetW;
    let oy: number = offsetH;


    while (p) {
      trans = m.transformPoint(p);
      tx = trans.x;
      ty = trans.y;
      if (tx < minX) minX = tx;
      if (tx > maxX) maxX = tx;
      if (ty < minY) minY = ty;
      if (ty > maxY) maxY = ty;
      p = p.next;

    }

    return target.bounds.init(minX - ox, minY - oy, maxX + ox, maxY + oy);
  }


  public getPoints(pathDatas: number[]): void {
    this._boundPoints = [];
    this._shapeXYs = [];
    this._shapeBounds = [];
    this.oldX = 0;
    this.oldY = 0;

    let i: number = 0, len: number = pathDatas.length, type: number;

    while (i < len) {
      type = pathDatas[i++];

      switch (type) {
        case 0://moveTo
          this.moveTo(pathDatas[i++], pathDatas[i++]);
          break;
        case 1://lineTo
          this.lineTo(pathDatas[i++], pathDatas[i++]);
          break;
        case 2://circle
          this.circle(pathDatas[i++], pathDatas[i++], pathDatas[i++]);
          break;
        case 3://quadraticCurveTo
          this.quadraticCurveTo(pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++]);
          break;
        case 4://rect
          this.rect(pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++]);
          break;
        case 5://arc
          this.arc(pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++]);
          break;
        case 6://arcTo
          this.arcTo(pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++]);
          break;
        case 7://bezierCurveTo
          this.bezierCurveTo(pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++]);
          break;
      }
    }
  }

  public triangulate(): void {
    this._indexs = [];
    this.endProcess();

    this._indexs = [];
    var i: number, len = this._nbShape;
    for (i = 0; i < len; i++) this._indexs[i] = EarCutting.instance.computeTriangles(this._shapeXYs[i]);
  }




  public endProcess(): void {
    if (this._nbShape != 0) {

      this._shapeBounds[this._nbShape - 1] = { minX: this.minX, minY: this.minY, maxX: this.maxX, maxY: this.maxY }
    }
  }
  public defineNewShape(): void {
    this.endProcess();
    this.oldX = 0;
    this.oldY = 0;

    this._shapePoints = [];
    this._shapeXY = [];
    this._boundPoints[this._nbShape] = this._shapePoints;
    this._shapeXYs[this._nbShape] = this._shapeXY;
    this._nbShape++;
    //console.log(this._nbShape)
    this._nbBoundPoint = 0;
  }



  public registerPoint(px: number, py: number) {

    if (px < this.minX) this.minX = px;
    if (px > this.maxX) this.maxX = px;
    if (py < this.minY) this.minY = py;
    if (py > this.maxY) this.maxY = py;

    this.oldX = px;
    this.oldY = py;

    var p: any = this.lastPoint;

    this._shapeXY.push(px, py);
    this._shapePoints[this._nbBoundPoint++] = this.lastPoint = new DOMPoint(px, py, 0, 1);

    if (p) p.next = this.lastPoint;
    this.lastPoint.prev = p;

    if (!this.firstPoint) this.firstPoint = this.lastPoint;
  }

  public moveTo(px: number, py: number) {
    this.defineNewShape();
    this.registerPoint(px, py);
  }
  public lineTo(px: number, py: number) {
    this.registerPoint(px, py);
  }
  public arcTo(x1: number, y1: number, x2: number, y2: number, radius: number) {
    var x0: number = this.oldX;
    var y0: number = this.oldY;

    let dx: number = x1 - x0;
    let dy: number = y1 - y0;
    let a: number = Math.atan2(dy, dx);

    dx = x2 - x1;
    dy = y2 - y1;
    a = Math.atan2(dy, dx);

    let _x1: number = x1 + Math.cos(a) * radius;
    let _y1: number = y1 + Math.sin(a) * radius;

    this.quadraticCurveTo(x1, y1, _x1, _y1);
  }

  public arc(px: number, py: number, radius: number, startAngle: number, endAngle: number) {
    this.defineNewShape();

    let da: number = Math.abs(endAngle - startAngle);
    let pi4: number = Math.PI / 8;

    this.registerPoint(px + Math.cos(startAngle) * radius, py + Math.sin(startAngle) * radius);

    let n: number = 0;
    while (n + pi4 < da) {
      n += pi4;
      this.registerPoint(px + Math.cos(startAngle + n) * radius, py + Math.sin(startAngle + n) * radius);
    }

    this.registerPoint(px + Math.cos(startAngle + da) * radius, py + Math.sin(startAngle + da) * radius);
  }

  public circle(px: number, py: number, radius: number) {
    this.arc(px, py, radius, 0, Math.PI * 2);
  }

  public rect(x: number, y: number, w: number, h: number): void {
    this.defineNewShape();
    this.registerPoint(x, y);
    this.registerPoint(x + w, y);
    this.registerPoint(x + w, y + h);
    this.registerPoint(x, y + h);
  }

  public getQuadraticCurveLength(ax: number, ay: number, x1: number, y1: number) {
    var x0: number = this.oldX;
    var y0: number = this.oldY;
    let ox: number = x0;
    let oy: number = y0;
    let dx: number, dy: number;
    let dist: number = 0;
    let i: number, nb: number = 10;
    let px: number, py: number, t: number;
    for (i = 1; i < nb; i++) {
      t = i / nb;
      px = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * ax + t * t * x1;
      py = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * ay + t * t * y1;

      dx = px - ox;
      dy = py - oy;
      dist += Math.sqrt(dx * dx + dy * dy);

      ox = px;
      oy = py;
    }

    dx = x1 - ox;
    dy = y1 - oy;
    dist += Math.sqrt(dx * dx + dy * dy);

    return dist;
  }

  public quadraticCurveTo(ax: number, ay: number, x1: number, y1: number) {
    var x0: number = this.oldX;
    var y0: number = this.oldY;
    let n: number = Math.ceil(this.getQuadraticCurveLength(ax, ay, x1, y1) / Geometry.curvePointDistance);
    let i: number, nb: number = Math.max(Math.min(n, Geometry.curvePointMax), 4)//GraphicGeometryTriangulator.curvePointMax;
    let px: number, py: number, t: number;
    for (i = 1; i <= nb; i++) {
      t = i / nb;
      px = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * ax + t * t * x1;
      py = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * ay + t * t * y1;
      this.registerPoint(px, py);
    }
  }

  public getBezierCurveLength(ax0: number, ay0: number, ax1: number, ay1: number, x1: number, y1: number): number {
    var x0: number = this.oldX;
    var y0: number = this.oldY;
    let i: number, nb: number = 5;
    let px: number, py: number, t: number, cX: number, bX: number, aX: number, cY: number, bY: number, aY: number;

    let ox: number = x0;
    let oy: number = y0;
    let dx: number, dy: number, d: number = 0;

    for (i = 1; i < nb; i++) {
      t = i / nb;

      cX = 3 * (ax0 - x0);
      bX = 3 * (ax1 - ax0) - cX;
      aX = x1 - x0 - cX - bX;

      cY = 3 * (ay0 - y0);
      bY = 3 * (ay1 - ay0) - cY;
      aY = y1 - y0 - cY - bY;

      px = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + x0;
      py = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + y0;

      dx = px - ox;
      dy = py - oy;
      d += Math.sqrt(dx * dx + dy * dy);

      ox = px;
      oy = py;
    }

    dx = x1 - ox;
    dy = y1 - oy;
    d += Math.sqrt(dx * dx + dy * dy);

    return d;
  }

  public bezierCurveTo(ax0: number, ay0: number, ax1: number, ay1: number, x1: number, y1: number): void {
    var x0: number = this.oldX;
    var y0: number = this.oldY;
    var n: number = Math.ceil(this.getBezierCurveLength(ax0, ay0, ax1, ay1, x1, y1) / Geometry.curvePointDistance);
    var i: number, nb: number = n//Math.max(Math.min(n,GraphicGeometryTriangulator.curvePointMax),5)//GraphicGeometryTriangulator.curvePointMax;
    var px: number, py: number, t: number, cX: number, bX: number, aX: number, cY: number, bY: number, aY: number;

    for (i = 1; i <= nb; i++) {
      t = i / nb;

      cX = 3 * (ax0 - x0);
      bX = 3 * (ax1 - ax0) - cX;
      aX = x1 - x0 - cX - bX;

      cY = 3 * (ay0 - y0);
      bY = 3 * (ay1 - ay0) - cY;
      aY = y1 - y0 - cY - bY;

      px = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + x0;
      py = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + y0;

      this.registerPoint(px, py);
    }
  }
}
