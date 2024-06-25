import { Filter } from "./Filter";

export class SaturateFilter extends Filter {
  constructor(intensity: number = 3) {
    super();
    this._intensity = intensity;
  }


  public get dataString(): string { return "" + this._intensity }
  public static fromDataString(data: string): SaturateFilter { return new SaturateFilter(Number(data)); }



  public get value(): string { return "saturate(" + this._intensity + "+%)" }
  public clone(): SaturateFilter { return new SaturateFilter(this._intensity) }
}
