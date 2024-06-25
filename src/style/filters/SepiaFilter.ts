import { Filter } from "./Filter";

export class SepiaFilter extends Filter {
  constructor(intensity: number = 3) {
    super();
    this._intensity = intensity;
  }


  public get dataString(): string { return "" + this._intensity }
  public static fromDataString(data: string): SepiaFilter { return new SepiaFilter(Number(data)); }




  public get value(): string { return "sepia(" + this._intensity + "+%)" }
  public clone(): SepiaFilter { return new SepiaFilter(this._intensity) }
}
