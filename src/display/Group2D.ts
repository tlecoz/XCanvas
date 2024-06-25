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



  protected _numChildren: number = 0;
  protected _children: Display2D[];

  constructor() {
    super(1, 1);
    this._children = [];
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



  public setStage(stage: Stage2D | null) {
    super.setStage(stage);
    let i: number, nb: number = this._numChildren;
    for (i = 0; i < nb; i++) this._children[i].setStage(stage);
  }
  public appendChild(element: Display2D): Display2D {
    this._children[this._numChildren++] = element;
    element.parent = this;
    //console.log("Group.appendChild ", element, this.stage)
    element.setStage(this.stage);
    return element;
  }
  public removeChild(element: Display2D): Display2D {
    const id = this._children.lastIndexOf(element);
    if (id < 0) return null;
    this._children.splice(id, 1);
    this._numChildren--;
    element.parent = null;
    element.setStage(null);
    return element;
  }

  public get numChildren(): number { return this._numChildren; }
  public get children(): Display2D[] { return this._children; }

  public update(context: CanvasRenderingContext2D): DOMMatrix {

    //@ts-ignore
    let alpha: number = this.alpha;
    const parent: Group2D = this.parent;
    const children: Display2D[] = this.children;
    this.identity();
    if (parent) this.multiply(parent);

    const m: DOMMatrix = this.applyTransform();


    context.save();



    let i: number, nb: number = this._numChildren;
    for (i = 0; i < nb; i++) children[i].update(context);

    context.restore();

    return m;
  }

}
