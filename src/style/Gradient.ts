import { GradientColor } from "../color/GradientColor";
import { Display2D } from "../display/Display2D";
import { IDirty } from "../events/IDirty";
import { FillStroke, Fillable } from "./FillStroke";

export class Gradient extends FillStroke implements IDirty {


  protected _gradient: GradientColor;
  protected _isLinear: boolean;

  protected _x: number = 0; //-> -0.999...+0.999
  protected _y: number = 0; //-> -0.999...+0.999
  protected _scaleX: number = 1;
  protected _scaleY: number = 1;
  protected _rotation: number = 0// radian

  protected _radialFlareX: number = 0;//-> -0.999...+0.999
  protected _radialFlareY: number = 0;//-> -0.999...+0.999
  protected _radialFlareStrength: number = 1;

  public dirty: boolean = true;
  //@ts-ignore
  private _name: string;
  protected gradientCanvas: CanvasGradient;

  constructor(gradient: GradientColor, isLinear: boolean = true) {
    super();

    this._gradient = gradient;
    this._isLinear = isLinear;

    gradient.addEventListener(GradientColor.UPDATE_STYLE, () => {
      this.dirty = true;
    })
  }

  public clone(cloneGradient: boolean = false, cloneColors: boolean = false, cloneLineStyle: boolean = true, cloneTextStyle: boolean = true, cloneTextLineStyle: boolean = true): Gradient {
    var o: Gradient;
    if (cloneGradient) o = new Gradient(this._gradient.clone(cloneColors))
    else o = new Gradient(this._gradient)
    o.fillPathRule = this.fillPathRule;
    o.styleType = this.styleType;
    o.x = this.x;
    o.y = this.y;
    o.scaleX = this.scaleX;
    o.scaleY = this.scaleY;
    o.rotation = this.rotation;
    o.radialFlareX = this.radialFlareX;
    o.radialFlareY = this.radialFlareY;
    o.radialFlareStrength = this.radialFlareStrength;
    o.alpha = this.alpha;
    if (this.lineStyle) {
      if (cloneLineStyle) o.lineStyle = this.lineStyle.clone()
      else o.lineStyle = this.lineStyle;
    }
    if (this.textStyle) {
      if (cloneTextStyle) o.textStyle = this.textStyle.clone(cloneTextLineStyle)
      else o.textStyle = this.textStyle;
    }
    return o;
  }


  public get gradient(): GradientColor { return this._gradient; }
  public set gradient(n: GradientColor) {
    this._gradient = n;
    this.dirty = true;
  }

  public get isLinear(): boolean { return this._isLinear; }
  public set isLinear(n: boolean) {
    this._isLinear = n;
    this.dirty = true;
  }

  public get x(): number { return this._x; }
  public set x(n: number) {
    this._x = n;
    this.dirty = true;
  }

  public get y(): number { return this._x; }
  public set y(n: number) {
    this._y = n;
    this.dirty = true;
  }

  public get scaleX(): number { return this._scaleX; }
  public set scaleX(n: number) {
    this._scaleX = n;
    this.dirty = true;
  }

  public get scaleY(): number { return this._scaleY; }
  public set scaleY(n: number) {
    this._scaleY = n;
    this.dirty = true;
  }

  public get rotation(): number { return this._rotation; }
  public set rotation(n: number) {
    this._rotation = n;
    this.dirty = true;
  }

  public get radialFlareX(): number { return this._radialFlareX; }
  public set radialFlareX(n: number) {
    this._radialFlareX = n;
    this.dirty = true;
  }

  public get radialFlareY(): number { return this._radialFlareY; }
  public set radialFlareY(n: number) {
    this._radialFlareY = n;
    this.dirty = true;
  }

  public get radialFlareStrength(): number { return this._radialFlareStrength; }
  public set radialFlareStrength(n: number) {
    this._radialFlareStrength = n;
    this.dirty = true;
  }


  public apply(context: CanvasRenderingContext2D, path: Fillable, target: Display2D): void {

    if (this.dirty || this._gradient.dirty) {
      this._gradient.transformValues(this._x, this._y, this._scaleX, this._scaleY, this._rotation, this._radialFlareX, this._radialFlareY, this._radialFlareStrength)
      this.gradientCanvas = this._gradient.getGradientStyle(context, target);
      this.dirty = false;
    }

    super.apply(context, path, target);

    context[this.styleType] = this.gradientCanvas;//Gradient.gradients[this._name];

  }
}
