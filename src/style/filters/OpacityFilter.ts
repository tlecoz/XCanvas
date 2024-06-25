import { Filter } from "./Filter";

export class OpacityFilter extends Filter {
  constructor(intensity: number = 3) {
    super();
    this._intensity = intensity;
  }


  public get dataString(): string { return "" + this._intensity }
  public static fromDataString(data: string): OpacityFilter { return new OpacityFilter(Number(data)); }



  public get value(): string { return "opacity(" + this._intensity + "+%)" }
  public clone(): OpacityFilter { return new OpacityFilter(this._intensity) }
}
