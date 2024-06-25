import { ObjectLibrary } from "./ObjectLibrary";

export class RegisterableObject {

  protected ___ID: string;//classNameId_instanceId

  constructor() {

    this.___ID = ObjectLibrary.instance.registerObject(this.constructor.name, this);
  }

  public get REGISTER_ID(): string { return this.___ID };



  public get dataString(): string {
    return "";
  }
}
