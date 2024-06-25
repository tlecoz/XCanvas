import { IDirty } from "../../events/IDirty";
import { ObjectLibrary } from "../../utils/ObjectLibrary";
import { RegisterableObject } from "../../utils/RegisterableObject";
import { Filter } from "./Filter";

export class FilterStack extends RegisterableObject implements IDirty {

  protected first: Filter;
  protected last: Filter;
  protected _value: string;
  public dirty: boolean = true;
  public boundOffsetW: number = 0;
  public boundOffsetH: number = 0;


  //public cacheAsBitmap:boolean = false;


  constructor() {
    super()
  }

  public clear(): void {
    let f: Filter = this.first;
    while (f) {
      f.clear();
      f = f.next;
    }
  }

  public clone(cloneFilters: boolean = false): FilterStack {
    let f: any = this.first;
    const s: FilterStack = new FilterStack();
    while (f) {
      if (cloneFilters) s.add(f.clone())
      else s.add(f);
    }
    return s;
  }


  public get value(): string {

    if (this.dirty) {
      //console.log(this.dirty)
      let v: string = "";
      let f: Filter = this.first;
      let w: number = 0, h: number = 0;
      while (f) {
        v = v + f.value + " ";
        if (f.boundOffsetW > w) w = f.boundOffsetW;
        if (f.boundOffsetH > h) h = f.boundOffsetH;
        f = f.next;
      }
      this.boundOffsetW = w;
      this.boundOffsetH = h;
      this._value = v;
      this.dirty = false;
    }
    return this._value;
  }

  public get dataString(): string {
    var s: string = "";
    var o: Filter = this.first;
    var b = false;
    while (o) {
      if (b) s += ",";
      s += o.REGISTER_ID;
      b = true;
      o = o.next;
    }
    return s;
  }

  public static fromDataString(data: string): FilterStack {
    var t: string[] = data.split(",");
    var s: FilterStack = new FilterStack();
    var i: number, len: number = t.length;
    for (i = 0; i < len; i++) s.add(ObjectLibrary.instance.getObjectByRegisterId(t[i]));
    return s;
  }


  public add(filter: Filter): FilterStack {
    if (!this.first) this.first = filter;
    if (this.last) this.last.next = filter;
    this.last = filter;
    filter.addDirtyEventTarget(this);
    return this;
  }



}
