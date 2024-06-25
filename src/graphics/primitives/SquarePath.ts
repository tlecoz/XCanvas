import { Path } from "../Path";

export class SquarePath extends Path {

  private static _instance: SquarePath;
  constructor() {
    super();
    if (!SquarePath._instance) SquarePath._instance = this;
    else throw new Error("SquarePath is a singleton. You must use SquarePath.instance.")

    this.rect(0, 0, 1, 1);
    this.computePath();
  }
  public static get instance(): SquarePath {
    if (!SquarePath._instance) new SquarePath();
    return SquarePath._instance;
  }
  public static get path(): Path2D { return SquarePath.instance.path }

}
