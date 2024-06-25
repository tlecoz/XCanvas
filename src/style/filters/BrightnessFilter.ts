import { Filter } from "./Filter";

export class BrightnessFilter extends Filter {
  constructor(intensity: number = 0) {
    super();
    this._intensity = intensity;
  }

  public get dataString(): string { return "" + this._intensity }
  public static fromDataString(data: string): BrightnessFilter { return new BrightnessFilter(Number(data)); }

  public clone(): BrightnessFilter { return new BrightnessFilter(this._intensity) }
  public get value(): string { return "brightness(" + this._intensity + "+%)" }

}
