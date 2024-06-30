import { BitmapData } from "../bitmap/BitmapData";
import { BorderFinder } from "../bitmap/border/BorderFinder";
import { BorderPt } from "../bitmap/border/BorderPt";
import { BorderVectorizer } from "../bitmap/border/vectorizer/BorderVectorizer";
import { FitCurve } from "../bitmap/border/vectorizer/FitCurve";
import { Rectangle2D } from "../geom/Rectangle2D";
import { Path } from "./Path";

export class BitmapPath extends Path {

  protected _outsideBitmap: BorderPt[] | null = null;
  protected _holeBitmap: BorderPt[][] | null = null;

  protected _outsideVector: BorderPt[] | null = null;
  protected _holeVector: BorderPt[][] | null = null;

  protected _outsideCurves: number[][][] | null = null;
  protected _holeCurves: number[][][][] | null = null;

  protected _bitmapBounds: Rectangle2D = new Rectangle2D();

  protected bd: BitmapData;
  protected precision: number;
  protected curveSmooth: number;

  constructor(bd: BitmapData, percentOfTheOriginal: number = 0.055, curveSmooth: number = 1) {
    super();
    this.bd = bd.clone();
    this.precision = percentOfTheOriginal;
    this.curveSmooth = curveSmooth;
    this.updateBitmapBorders();
    this.generatePath();
    console.log(this)
  }

  protected updateBitmapBounds(): void {
    this._bitmapBounds.init();
    this._outsideBitmap.forEach((pt) => this._bitmapBounds.addPoint(pt));
    this._bitmapBounds.minX = (this.bd.width - this._bitmapBounds.width) * 0.5;
    this._bitmapBounds.minY = (this.bd.height - this._bitmapBounds.height) * 0.5;
  }


  public updateBitmapBorders(): void {
    this.bd.saveData();
    this.bd.setPadding(1, 1, 1, 1);
    this._outsideBitmap = BorderFinder.instance.getBorderFromBitmapData(this.bd);
    this._holeBitmap = BorderFinder.instance.getHoleBorders(this.bd);
    for (var i: number = 0; i < this._holeBitmap.length; i++) this._holeBitmap[i] = this._holeBitmap[i].reverse();
    this.bd.restoreData();

    this.vectorize(this.precision);
    if (this.curveSmooth != 0) this.convertLinesToCurves(this.curveSmooth);

    this.updateBitmapBounds();
  }





  public vectorize(percentOfTheOriginal: number = 0.055): void {
    if (!this._outsideBitmap || !this._holeBitmap) return
    if (percentOfTheOriginal > 1) percentOfTheOriginal = 1;
    if (percentOfTheOriginal < 0.0001) percentOfTheOriginal = 0.0001;

    var precisionHole: number = percentOfTheOriginal * 2;
    //console.log("precision = ",percentOfTheOriginal,precisionHole)
    //console.log(this._outsideBitmap.length)

    this._outsideVector = BorderVectorizer.instance.init(this._outsideBitmap.length * percentOfTheOriginal >> 0, this._outsideBitmap);
    //console.log("vectorize : wanted ",(this._outsideBitmap.length*percentOfTheOriginal >> 0)," , got ",this._outsideVector.length)
    //console.log("vector = ",this._outsideVector.length+" VS ",this._outsideBitmap.length)
    this._holeVector = [];
    var i: number, len: number = this._holeBitmap.length;
    for (i = 0; i < len; i++) {
      this._holeVector[i] = BorderVectorizer.instance.init(this._holeBitmap[i].length * precisionHole >> 0, this._holeBitmap[i]);
    }

  }


  public convertLinesToCurves(smoothLevel: number = 1): void {
    if (!this._holeVector) return;
    //smoothLevel => a number between 0.1 and 1000
    if (smoothLevel < 0.1) smoothLevel = 0.1;

    if (!this.outsideVector) this.vectorize(0.065);

    //console.log("vectorLen ",this.outsideVector.length)
    this._outsideCurves = FitCurve.borderToCurve(this.outsideVector, smoothLevel);
    //console.log("curveLen ",this._outsideCurves.length);
    //console.log("vectorToCurveRatio = ",(this._outsideCurves.length / this.outsideVector.length))

    this._holeCurves = [];
    var i: number, len: number = this._holeVector.length;

    for (i = 0; i < len; i++) {
      this._holeCurves[i] = FitCurve.borderToCurve(this._holeVector[i], smoothLevel);
    }

  }

  /*
  public triangulateGeometry(shape:Shape2D,updateIfExist:boolean=false):void{
    //console.log("triangulate bitmap")
    var precision:number = this.precision;
    if(!this.trianglePoints || updateIfExist){
      var o:{trianglePoints:number[],
             triangleIndexs:number[],
             minX:number,
             minY:number,
             maxX:number,
             maxY:number} = BitmapGeometryTriangulator.instance.triangulateGeometry(this,precision);
      this.basicHitPoints = [];
      this.trianglePoints = [new Float32Array(o.trianglePoints)];
      this.transTrianglePoints = [new Float32Array(o.trianglePoints)];
      this.triangleIndexs = [new Int32Array(o.triangleIndexs)];
      var hp = [o.minX,o.minY,
                o.maxX,o.minY,
                o.minX,o.maxY,
                o.maxX,o.maxY]

      this.basicHitPoints[0] = new Float32Array(hp);
    }
  }
  */

  private generatePath(): void {


    //this.beginPath();
    let i: number, len: number;

    if (this.outsideCurves) {
      //console.log("updateGeometry - curves")
      this.drawCurves(this.outsideCurves);
      if (this.holeCurves && this.holeCurves.length) {
        len = this.holeCurves.length;
        for (i = 0; i < len; i++) this.drawCurves(this.holeCurves[i]);

      }
    } else if (this.outsideVector) {
      //console.log("updateGeometry - vector")
      this.drawLines(this.outsideVector);
      if (this.holeVector && this.holeVector.length) {
        len = this.holeVector.length;
        for (i = 0; i < len; i++) this.drawLines(this.holeVector[i]);
      }
    } else {
      //console.log("updateGeometry - bitmapBorder")
      this.drawLines(this.outsideBitmap);
      if (this.holeBitmap && this.holeBitmap.length) {
        len = this.holeBitmap.length;
        for (i = 0; i < len; i++) this.drawLines(this.holeBitmap[i]);
      }
    }

    this.computePath();
    console.log(this.datas)

  }

  private drawLines(path: BorderPt[]): void {
    if (!path) return;

    this.moveTo(path[0].x, path[0].y);
    let i: number, len: number = path.length;
    for (i = 1; i < len; i++) this.lineTo(path[i].x, path[i].y);

  }
  private drawCurves(path: number[][][]): void {
    if (!path) return;
    let i: number, len: number = path.length;
    let bezier: number[][];
    for (i = 0; i < len; i++) {
      bezier = path[i];

      if (i == 0) this.moveTo(bezier[0][0], bezier[0][1])
      this.bezierCurveTo(bezier[1][0], bezier[1][1],
        bezier[2][0], bezier[2][1],
        bezier[3][0], bezier[3][1]);

    }

  }

  public get bitmapBounds(): Rectangle2D { return this._bitmapBounds; }

  public get outsideBitmap(): BorderPt[] | null { return this._outsideBitmap }
  public get holeBitmap(): BorderPt[][] | null { return this._holeBitmap }

  public get outsideVector(): BorderPt[] | null { return this._outsideVector }
  public get holeVector(): BorderPt[][] | null { return this._holeVector }

  public get outsideCurves(): number[][][] | null { return this._outsideCurves }
  public get holeCurves(): number[][][][] | null { return this._holeCurves }

}
