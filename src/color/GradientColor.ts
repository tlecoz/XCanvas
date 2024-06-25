import { Display2D } from "../display/Display2D";
import { EventDispatcher } from "../events/EventDispatcher";
import { ObjectLibrary } from "../utils/ObjectLibrary";
//import { RegisterableObject } from "../utils/RegisterableObject";
import { SolidColor } from "./SolidColor";

export class GradientColor extends EventDispatcher {

  public static UPDATE_STYLE: string = "UPDATE_STYLE";

  protected colors: SolidColor[] | null = null;
  protected ratios: number[] | null = null;
  protected nbStep: number = 0;
  protected x0: number = 0;
  protected y0: number = 0;
  protected r0: number = 0;
  protected x1: number = 0;
  protected y1: number = 0;
  protected r1: number = 0;
  protected style: CanvasGradient | null = null;
  protected ctx: CanvasRenderingContext2D | null = null;
  protected onUpdateStyle: Function | null = null;

  public dirty: boolean = true;

  public isLinear: boolean;
  public scaleX: number = 1;
  public scaleY: number = 1;
  public x: number = 0; //-> -0.999...+0.999
  public y: number = 0; //-> -0.999...+0.999
  public rotation: number = 0// radian
  public radialFlareX: number = 0;//-> -0.999...+0.999
  public radialFlareY: number = 0;//-> -0.999...+0.999
  public radialFlareStrength: number = 1;


  public _scaleX: number = 1;
  public _scaleY: number = 1;
  public _x: number = 0; //-> -0.999...+0.999
  public _y: number = 0; //-> -0.999...+0.999
  public _rotation: number = 0// radian
  public _radialFlareX: number = 0;//-> -0.999...+0.999
  public _radialFlareY: number = 0;//-> -0.999...+0.999
  public _radialFlareStrength: number = 1;

  constructor(colors: SolidColor[] | null = null, ratios: number[] | null = null, isLinear: boolean = true) {
    super();

    //var th = this;
    //this.onUpdateStyle = function(){th.dirty = true;}

    if (colors) this.setColorStep(colors, ratios as number[]);
    else {
      this.colors = [];
      this.ratios = [];
    }
    this.isLinear = isLinear;

  }

  public get dataString(): string {
    if (!this.colors || !this.ratios) return "";

    let i: number, len: number = this.colors.length;
    let colors: string = "", ratios: string = "";
    for (i = 0; i < len; i++) {
      if (i != 0) {
        colors += ",";
        ratios += ",";
      }
      colors += this.colors[i].REGISTER_ID;
      ratios += this.ratios[i];
    }
    let b: number = 0;
    if (this.isLinear) b = 1;
    return colors + "|" + ratios + "|" + b;
  }

  public static fromDataString(data: string): GradientColor {
    let t: string[] = data.split("|");
    let c: string[] = t[0].split(",");
    let r: string[] = t[1].split(",");
    let linear: boolean = t[2] == "1";
    let i: number, len: number = c.length;
    let colors: SolidColor[] = [];
    let ratios: number[] = [];
    for (i = 0; i < len; i++) {
      colors[i] = ObjectLibrary.instance.getObjectByRegisterId(c[i]);
      ratios[i] = Number(r[i]);
    }
    return new GradientColor(colors, ratios, linear);
  }



  public clone(cloneColors: boolean = false): GradientColor | null {
    if (!this.colors || !this.ratios) return null;
    let c: SolidColor[];
    if (cloneColors) {
      c = [];
      let i: number, len: number = this.colors.length;
      for (i = 0; i < len; i++) c[i] = this.colors[i].clone();
      return new GradientColor(c, this.ratios.concat(), this.isLinear);
    } else {
      return new GradientColor(this.colors.concat(), this.ratios.concat(), this.isLinear);
    }

  }

  public transformValues(x: number = 0, y: number = 0, scaleX: number = 1, scaleY: number = 1, rotation: number = 0, flareX: number = 0, flareY: number = 0, flareStrength: number = 0) {
    this._x = x;
    this._y = y;
    this._scaleX = scaleX;
    this._scaleY = scaleY;
    this._rotation = rotation;
    this._radialFlareX = flareX;
    this._radialFlareY = flareY;
    this._radialFlareStrength = flareStrength;
    this.dirty = true;
  }

  public initFromPoints(x0: number, y0: number, x1: number, y1: number, r0: number = 0, r1: number = 0) {
    this.x0 = x0;
    this.y0 = y0;
    this.r0 = r0;
    this.x1 = x1;
    this.y1 = y1;
    this.r1 = r1;
    this.dirty = true;
  }
  public initLinearFromRect(x: number, y: number, w: number, h: number, angle: number) {
    const w2: number = w / 2;
    const h2: number = h / 2;
    const d: number = Math.sqrt(w2 * w2 + h2 * h2);
    const a1: number = angle + Math.PI;
    const a2: number = angle;

    x += w2;
    y += h2;

    this.x0 = x + Math.cos(a1) * d;
    this.y0 = y + Math.sin(a1) * d;
    this.x1 = x + Math.cos(a2) * d;
    this.y1 = y + Math.sin(a2) * d;
    this.dirty = true;
  }
  public initRadialFromRect(x: number, y: number, w: number, h: number, radialFlareX: number = 0, radialFlareY: number = 0, flareStrength: number = 1) {

    if (radialFlareX <= -1) radialFlareX = -0.999;
    if (radialFlareY <= -1) radialFlareY = -0.999;
    if (radialFlareX >= 1) radialFlareX = 0.999;
    if (radialFlareY >= 1) radialFlareY = 0.999;

    const w2: number = w / 2;
    const h2: number = h / 2;
    const radius: number = Math.sqrt(w2 * w2 + h2 * h2);
    x += w2;
    y += h2;

    const a: number = Math.atan2(radialFlareY, radialFlareX);
    const dx: number = Math.cos(a) * (radius * radialFlareX);
    const dy: number = Math.sin(a) * (radius * radialFlareY);
    const d: number = Math.sqrt(dx * dx + dy * dy);

    this.x0 = x + Math.cos(a) * d;
    this.x1 = x;
    this.y0 = y + Math.sin(a) * d;
    this.y1 = y;
    this.r0 = 0;
    this.r1 = radius * flareStrength;
    this.dirty = true;
  }
  public setColorStep(colors: SolidColor[], ratios?: number[]) {
    let i: number, nbStep: number, ratio: number, n: number;
    if (colors.length > 1) {
      if (ratios && colors.length <= ratios.length) {
        this.ratios = ratios;
        this.nbStep = colors.length;
        this.colors = colors;
      } else {
        this.nbStep = nbStep = colors.length;
        ratio = 0;
        n = 1 / (nbStep - 1);
        this.ratios = [];
        for (i = 0; i < nbStep; i++) {
          this.ratios[i] = ratio;
          ratio += n;
        }
      }
    } else {
      colors.push(colors[0]);
      this.nbStep = 2;
      this.ratios = [0, 1];
    }

    nbStep = this.nbStep;
    const updateCol = () => {

      this.dirty = true;
      if (this.ctx) this.getGradientStyle(this.ctx);
      this.onUpdateStyle?.();
    }
    for (i = 0; i < nbStep; i++) {
      if (this.colors && this.colors[i]) this.colors[i].removeEventListener(SolidColor.UPDATE_STYLE, updateCol)
      colors[i].addEventListener(SolidColor.UPDATE_STYLE, updateCol)
    }

    this.colors = colors;
    this.dirty = true;
  }

  public addColorStep(ratio: number, r: number | string = 0, g: number = 0, b: number = 0, a: number = 1): SolidColor | null {
    if (!this.colors || !this.ratios) return null;
    //var step:GradientStep = new GradientStep(this,ratio,r,g,b,a);
    var color: SolidColor = this.colors[this.nbStep] = new SolidColor(r, g, b, a);
    this.ratios[this.nbStep++] = ratio;
    return color;
  }

  public getColorById(id: number): SolidColor | null { return this.colors ? this.colors[id] : null }
  public setColorById(id: number, color: SolidColor) {
    if (!this.colors || !this.ratios) return "";

    if (this.colors[id] != null) {
      this.colors[id].removeEventListener(SolidColor.UPDATE_STYLE, this.onUpdateStyle as Function);
      this.colors[id] = color;
      color.addEventListener(SolidColor.UPDATE_STYLE, this.onUpdateStyle as Function);

    }
  }
  public getRatioById(id: number): number { return this.ratios ? this.ratios[id] : 0 }
  public setRatioById(id: number, ratio: number) {
    (this.ratios as number[])[id] = ratio;

  }

  //@ts-ignore
  public getGradientStyle(context2D: CanvasRenderingContext2D, target?: Display2D): CanvasGradient | null {
    if (!this.colors || !this.ratios) return null;
    let obj: CanvasGradient;




    if (this.dirty || this.ctx != context2D) {


      this.ctx = context2D;

      const x: number = this.x + this._x;
      const y: number = this.y + this._y;
      const scaleX: number = this.scaleX * this._scaleX;
      const scaleY: number = this.scaleY * this._scaleY;
      const rotation: number = this.rotation + this._rotation;
      const flareX: number = this.radialFlareX * this._radialFlareX;
      const flareY: number = this.radialFlareY * this._radialFlareY;
      const flareStrength: number = this.radialFlareStrength * this._radialFlareStrength;

      if (this.isLinear) {
        this.initLinearFromRect(x, y, scaleX, scaleY, rotation);
        obj = context2D.createLinearGradient(this.x0, this.y0, this.x1, this.y1);
      } else {
        this.initRadialFromRect(x, y, scaleX, scaleY, flareX, flareY, flareStrength);
        obj = context2D.createRadialGradient(this.x0, this.y0, this.r0, this.x1, this.y1, this.r1);
      }


      let i: number, nb: number = this.nbStep;
      const ratios: number[] = this.ratios;
      const colors: SolidColor[] = this.colors;
      for (i = 0; i < nb; i++) obj.addColorStop(ratios[i], colors[i].style as string);


      this.style = obj;
      this.dirty = false;
      this.dispatchEvent(GradientColor.UPDATE_STYLE);
    }

    return this.style;
  }

}
