import { SolidColor } from "../../color/SolidColor";
import { DirtyEventDispatcher } from "../../events/DirtyEventDispatcher";


export class Filter extends DirtyEventDispatcher {

  public boundOffsetW: number = 0;
  public boundOffsetH: number = 0;
  public next: Filter = null;

  protected _updateColor: () => void;
  protected _color: SolidColor;
  protected _offsetX: number = 0;
  protected _offsetY: number = 0;
  protected _radius: number = 0;
  protected _intensity: number = 0;
  protected _angle: number = 0;

  constructor() {
    super();



    this._updateColor = () => {
      this.dirty = true;
      this.applyDirty();
    }
  }

  public get value(): string { return null }


  public get angle(): number { return this._angle }
  public set angle(n: number) {
    if (n != this._angle) {
      this._angle = n;
    }
  }

  public get color(): SolidColor { return this._color }
  public set color(c: SolidColor) {
    if (c != this._color) {
      if (this._color) this._color.removeEventListener(SolidColor.UPDATE_STYLE, this._updateColor);
      this._color = c;
      this._color.addEventListener(SolidColor.UPDATE_STYLE, this._updateColor);
      this.applyDirty();
    }
  }

  public get intensity(): number { return this._intensity }
  public set intensity(n: number) {
    if (n != this._intensity) {
      this._intensity = n;
      this.applyDirty();
    }
  }



  public get offsetX(): number { return this._offsetX }
  public set offsetX(n: number) {
    if (n != this._offsetX) {
      this._offsetX = n;
      this.boundOffsetW = Math.abs(n) + this.radius;
      this.applyDirty();
    }
  }

  public get offsetY(): number { return this._offsetX }
  public set offsetY(n: number) {
    if (n != this._offsetY) {
      this._offsetY = n;
      this.boundOffsetH = Math.abs(n) + this.radius;
      this.applyDirty();
    }
  }

  public get radius(): number { return this._radius }
  public set radius(n: number) {
    if (n != this._radius) {
      this._radius = n;
      this.boundOffsetW = Math.abs(this._offsetX) + n;
      this.boundOffsetH = Math.abs(this._offsetY) + n;
      this.applyDirty();
    }
  }
  public clear(): void {
    for (var z in this) this[z] = null;
  }
}
