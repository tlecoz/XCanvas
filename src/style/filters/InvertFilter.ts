import { Filter } from "./Filter";

export class InvertFilter extends Filter {
  constructor(intensity: number = 0) {
    super();
    this._intensity = intensity;
  }

  public get dataString(): string { return "" + this._intensity }
  public static fromDataString(data: string): InvertFilter { return new InvertFilter(Number(data)); }

  public get value(): string { return "invert(" + this._intensity + "+%)" }
  public clone(): InvertFilter { return new InvertFilter(this._intensity) }
}
