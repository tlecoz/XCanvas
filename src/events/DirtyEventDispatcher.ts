import { RegisterableObject } from "../utils/RegisterableObject";
import { IDirty } from "./IDirty";

export class DirtyEventDispatcher extends RegisterableObject implements IDirty {

  private ____eventStack: IDirty[];
  public dirty: boolean = true;



  constructor() {
    super();
    this.____eventStack = [];
  }



  public addDirtyEventTarget(eventTarget: IDirty): void {
    if (this.____eventStack.lastIndexOf(eventTarget) == -1) this.____eventStack.push(eventTarget);
  }
  public removeDirtyEventTarget(eventTarget: IDirty): void {
    const id: number = this.____eventStack.lastIndexOf(eventTarget);
    if (id != -1) this.____eventStack.splice(id, 1);
  }
  public applyDirty(): void {
    let i: number, len: number = this.____eventStack.length;
    for (i = 0; i < len; i++) this.____eventStack[i].dirty = true;
  }
}
