class CirclePath extends Path {

  private static _instance:CirclePath;
  constructor(){
    super();
    if(!CirclePath._instance) CirclePath._instance = this;
    else throw new Error("CirclePath is a singleton. You must use CirclePath.instance.")

    this.circle(0.5,0.5,0.5);
    this.computePath();
  }
  public static get instance():CirclePath{
    if(!CirclePath._instance) new CirclePath();
    return CirclePath._instance;
  }
  public static get path():Path2D{ return CirclePath.instance.path}

}
