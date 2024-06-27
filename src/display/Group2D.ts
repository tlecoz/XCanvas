import { Align } from "../geom/Align";
import { Pt2D } from "../geom/Pt2D";
import { Rectangle2D } from "../geom/Rectangle2D";
import { ObjectLibrary } from "../utils/ObjectLibrary";
import { Display2D } from "./Display2D";
import { Stage2D } from "./Stage2D";

export class Group2D extends Display2D {


  /*
  TODO : faire marcher la sauvegarde
         => gerer le chargement en deux temps
            => d'abord on créé tout les objets, on les appendChild ou les association avec d'autre objets dans un second temps
               ==> trouver un moyen de créer les objets sans utiliser les références d'objets de manière synchrone

       - correction du cacheAsBitmap & bounds de Shape

       - triangulation

  */

  public static CHILD_ADDED: string = "CHILD_ADDED";
  public static CHILD_REMOVED: string = "CHILD_REMOVED";

  protected _numChildren: number = 0;
  protected _children: Display2D[];

  constructor() {
    super(1, 1);
    this._children = [];
    this.axis = Align.TOP_LEFT.clone();

    const onChildListChange = () => {
      //console.log("onChildListChange ", this, !!this.stage)
      if (!this.stage || this.stage.frameId == 0 || !this.axis) this.waitingBound = true;
      else this.updateBounds();
    }
    this.addEventListener(Group2D.CHILD_ADDED, onChildListChange);
    this.addEventListener(Group2D.CHILD_REMOVED, onChildListChange);
  }

  public get dataString(): string {
    var data: string = super.dataString;
    data += "#";

    var i: number, len: number = this._children.length;
    for (i = 0; i < len; i++) {
      if (i > 0) data += ",";
      data += this._children[i].REGISTER_ID;
    }
    return data;
  }

  public static fromDataString(data: string, target?: Group2D): Group2D {

    var params = data.split("#");
    //console.log("params = ",params);
    var t: string[] = params[3].split(",");
    var o: Group2D;
    if (!target) o = new Group2D();
    else o = target;
    Display2D.fromDataString(data, o);
    var i: number, len: number = t.length;
    for (i = 0; i < len; i++) o.appendChild(ObjectLibrary.instance.getObjectByRegisterId(t[i]));
    return o;
  }

  public align(displayAlign: Pt2D = Align.CENTER): void {
    //const frameId = this.stage.frameId;
    //if (!this.stage.started || this.boundFrameId == frameId) return;
    //this.boundFrameId = frameId;

    //this.updateBounds();
    //console.log("group bounds = ", this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height)

    this.axis = displayAlign.clone();






  }

  public updateBounds(): Rectangle2D {
    const frameId = this.stage.frameId;

    if (this.children.length == 0) {
      this.waitingBound = true;
      return this._bounds;
    }

    if (this.boundFrameId == frameId || !this.axis) {
      this.waitingBound = true;
      return this._bounds;
    }

    for (let i = 0; i < this.children.length; i++) {
      if (!this.children[i].axis) {
        this.waitingBound = true;
        return this._bounds;
      }
    }




    //console.log("frameId = ", frameId, this.boundFrameId)


    this.boundFrameId = frameId;
    //console.log("UB")
    if (!this._bounds) this._bounds = new Rectangle2D(9999999, 9999999, -9999999, -9999999)
    else this._bounds.init(9999999, 9999999, -9999999, -9999999);

    for (let i = 0; i < this.children.length; i++) {
      const b = this.children[i].updateBounds()

      if (b) {
        //console.log(b)
        this._bounds.add(b);
      } else {
        this._bounds = undefined;
        this.waitingBound = true;
        return;
      }
    }



    if (!this.currentTransform) this.currentTransform = this.applyTransform();
    const pt = this.currentTransform.transformPoint(new DOMPoint(0, 0));

    //console.log(pt);


    this._bounds.minX -= pt.x;
    this._bounds.minY -= pt.y;
    this._bounds.maxX -= pt.x;
    this._bounds.maxY -= pt.y;

    this.waitingBound = this._bounds.width == 1 && this._bounds.height == 1;

    return this._bounds;
  }


  public setStage(stage: Stage2D | null) {
    super.setStage(stage);
    let i: number, nb: number = this._numChildren;
    for (i = 0; i < nb; i++) this._children[i].setStage(stage);
  }
  public appendChild(element: Display2D): Display2D {
    this._children[this._numChildren++] = element;
    element.parent = this;
    element.dispatchEvent(Display2D.ADDED);

    //console.log("Group.appendChild ", element, this.stage)
    element.setStage(this.stage);

    this.dispatchEvent(Group2D.CHILD_ADDED);

    this.updateBounds();
    return element;
  }
  public removeChild(element: Display2D): Display2D {
    const id = this._children.lastIndexOf(element);
    if (id < 0) return null;
    this._children.splice(id, 1);
    this._numChildren--;
    element.parent = null;
    element.dispatchEvent(Display2D.REMOVED);
    element.setStage(null);
    this.dispatchEvent(Group2D.CHILD_REMOVED);
    return element;
  }

  public get numChildren(): number { return this._numChildren; }
  public get children(): Display2D[] { return this._children; }

  public update(context: CanvasRenderingContext2D): DOMMatrix {

    if (this.children.length == 0) return;

    //@ts-ignore
    let alpha: number = this.alpha;
    const parent: Group2D = this.parent;
    const children: Display2D[] = this.children;
    this.identity();
    if (parent) this.multiply(parent);


    if (this.waitingBound) {
      this.updateBounds();
    }

    if (this.axis && this.bounds) {

      //if (this.constructor.name == "Group2D") console.log("b=", this.bounds)

      this.xAxis = this.bounds.width * this.axis.x / this.scaleX;
      this.yAxis = this.bounds.height * this.axis.y / this.scaleY;

    }

    //if (this.constructor.name == "Group2D") console.log("display ", this.axis.x, this.xAxis, this.yAxis)

    const m: DOMMatrix = this.applyTransform();

    //console.log("bounds = ", this.constructor.name, this.bounds)

    context.save();



    let i: number, nb: number = this._numChildren;
    for (i = 0; i < nb; i++) {
      //children[i].renderStack
      children[i].update(context);
    }



    context.restore();

    return m;
  }

}