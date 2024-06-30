
import { MouseControler } from "../controlers/MouseControler";
import { Rectangle2D } from "../geom/Rectangle2D";
import { Path } from "../graphics/Path";
import { FillStroke } from "../style/FillStroke";
import { BitmapFill } from "../style/fills/BitmapFill";
import { GradientFill } from "../style/fills/GradientFill";
import { PatternFill } from "../style/fills/PatternFill";
import { SolidFill } from "../style/fills/SolidFill";
import { GradientStroke } from "../style/strokes/GradientStroke";
import { PatternStroke } from "../style/strokes/PatternStroke";
import { TextPath } from "../style/textstyles/TextPath";
import { GradientTextFill } from "../style/textstyles/fills/GradientTextFill";
import { PatternTextFill } from "../style/textstyles/fills/PatternTextFill";
import { SolidTextFill } from "../style/textstyles/fills/SolidTextFill";
import { GradientTextStroke } from "../style/textstyles/strokes/GradientTextStroke";
import { PatternTextStroke } from "../style/textstyles/strokes/PatternTextStroke";
import { SolidTextStroke } from "../style/textstyles/strokes/SolidTextStroke";
import { ObjectLibrary } from "../utils/ObjectLibrary";
import { RegisterableObject } from "../utils/RegisterableObject";
import { Display2D } from "./Display2D";
import { RenderStackElement } from "./RenderStackElement";
import { Shape } from "./Shape";

export type PathRenderable = SolidFill | GradientFill | GradientStroke | PatternFill | PatternStroke | BitmapFill;
export type TextRenderable = SolidTextFill | SolidTextStroke | GradientTextFill | GradientTextStroke | PatternTextFill | PatternTextStroke;
export type RenderStackable = PathRenderable | TextRenderable | Path | TextPath | Shape


export class RenderStack extends RegisterableObject {

  public lastPath: Path | TextPath;
  public lastFillStroke: FillStroke;


  protected _elements: RenderStackElement[];


  public offsetW: number = 0;
  public offsetH: number = 0;

  public mouse: MouseControler;

  public constructor(elements?: (Path | TextPath | FillStroke | Shape)[]) {
    super();
    this._elements = [];

    if (elements) elements.forEach((e) => { this.push(e) });

  }




  public filter(condition: (val) => boolean): any {
    const res = this.elements.filter(condition);

    const result = [];


    if (res.length) {


      res.forEach((val, id) => {
        result[id] = val.value;
      })
    }



    //console.log(result)

    return result;
  }


  public get dataString(): string {
    var s: string = "";
    var lastPath: string = "0";
    var lastFillStroke: string = "0";
    if (this.lastPath) lastPath = this.lastPath.REGISTER_ID;
    if (this.lastFillStroke) lastFillStroke = this.lastFillStroke.REGISTER_ID;
    s = lastPath + "," + lastFillStroke + "#";

    var i: number, len: number = this._elements.length;
    if (len == 0) return "";

    //console.log("renderStack.elements.length = ",len);
    for (i = 0; i < len; i++) {
      if (i > 0) s += ",";
      s += this._elements[i].REGISTER_ID;
    }
    return s;
  }

  public static fromDataString(data: string): RenderStack {
    var t2: string[] = data.split("#");
    var t3: string[] = t2[0].split(",");


    var t: string[] = t2[1].split(",");
    var i: number, len: number = t.length;
    var r: RenderStack = new RenderStack();
    for (i = 0; i < len; i++) {
      r.elements[i] = ObjectLibrary.instance.getObjectByRegisterId(t[i]);
    }

    if (t3[0] != "0") r.lastPath = ObjectLibrary.instance.getObjectByRegisterId(t3[0]);
    if (t3[1] != "0") r.lastFillStroke = ObjectLibrary.instance.getObjectByRegisterId(t3[1]);

    return r;
  }



  public get elements(): RenderStackElement[] { return this._elements; }

  public clone(): RenderStack {
    var o: RenderStack = new RenderStack();
    var i: number, len: number = this.elements.length;
    for (i = 0; i < len; i++) o.elements[i] = this.elements[i].clone();
    return o;
  }

  //##############
  //la renderStack ne peut pas etre une linked-list de telle manière qu'on puisse cloner le tableau contenant les objets sans cloner les objets
  //et de cloner un élément dans le tableau sans affecter tout le to
  //#################


  public push(renderStackElement: Path | TextPath | FillStroke | Shape | RenderStack, mouseEnabled: boolean = true): RenderStackElement | RenderStack {

    if (renderStackElement instanceof RenderStack) {

      renderStackElement.elements.forEach((val) => {
        this.elements.push(val);
      })


      return renderStackElement;
    } else {
      var o: RenderStackElement = new RenderStackElement(renderStackElement, mouseEnabled);
      this._elements.push(o);
      if (renderStackElement instanceof Path || renderStackElement instanceof TextPath) this.lastPath = renderStackElement;
      else if (renderStackElement instanceof FillStroke) this.lastFillStroke = renderStackElement;
      o.init(this.lastPath, this.lastFillStroke);
      return o;
    }

  }



  public updateWithHitTest(context: CanvasRenderingContext2D, target: Display2D, mouseX: number = Number.MAX_VALUE, mouseY: number = Number.MAX_VALUE, updateFromShape: boolean = false): boolean {
    let o: RenderStackElement;
    let path: Path | TextPath;
    let hitTest: boolean = false;



    let i: number, nb: number = this.elements.length;
    let b: boolean;
    for (i = 0; i < nb; i++) {
      o = this.elements[i];
      context.save();
      if (o.enabled) {

        if (o.isShape) {
          b = (o.value as Shape).apply(context, target, mouseX, mouseY);
          if (!hitTest) hitTest = b;
        } else {

          if (o.isPath || o.isTextPath) path = o.value as Path | TextPath
          else {
            (o.value as any).apply(context, path, target);
            if (!hitTest && o.mouseEnabled && target.useComplexHitTest) hitTest = path.isPointInside(context, mouseX, mouseY, o.isStroke);
          }

        }
      }
      context.restore();
    }

    if (!updateFromShape && target.cacheAsBitmap) {
      this.updateBounds(target);
      target.bitmapCache.draw(context, this.offsetW, this.offsetH);
    }

    if (target.mouseIsOver == false && hitTest) target.onMouseOver();
    if (target.mouseIsOver && hitTest == false) target.onMouseOut();

    return hitTest;
  }

  public update(context: CanvasRenderingContext2D, target: Display2D, updateFromShape: boolean = false): boolean {
    let o: RenderStackElement;
    let path: Path | TextPath;


    if (updateFromShape || target.cacheAsBitmap == false) {
      let i: number, nb: number = this.elements.length;
      for (i = 0; i < nb; i++) {
        o = this.elements[i];
        context.save();
        if (o.enabled) {
          if (o.isPath || o.isTextPath) path = o.value as Path | TextPath
          else (o.value as any).apply(context, path, target);
        }
        context.restore();
      }

    } else {
      this.updateBounds(target);
      target.bitmapCache.draw(context, this.offsetW, this.offsetH);
    }
    return false;
  }

  /*
  public update(context:CanvasRenderingContext2D,target:Display2D,mouseX:number=Number.MAX_VALUE,mouseY:number=Number.MAX_VALUE):void{
    let o:RenderStackElement;
    let path:Path;
    let text:TextPath;
    let hitTest:boolean = false;
    let fillStroke:FillStroke;



    let i:number,nb:number = this.elements.length;
    for(i=0;i<nb;i++){
      o = this.elements[i];


        //context.beginPath();
        context.save();
        if(o.enabled){
          if(o.isPath) path = o.value as Path
          else if(o.isTextPath) text = o.value as TextPath;
          else {


            if(o.isTextFillStroke){
              (o.value as TextRenderable).apply(context,text,target);
              if(!hitTest && o.mouseEnabled && target.useComplexHitTest) {
                   hitTest = (o.isTextFill && text.isPointInPath(context,mouseX,mouseY)) || (o.isTextStroke && text.isPointInStroke(context,mouseX,mouseY));
              }

            }else{

              fillStroke = o.value as FillStroke;
              (fillStroke as PathRenderable).apply(context,path,target);

               if(!hitTest && o.mouseEnabled && target.useComplexHitTest) {
                   hitTest = (o.isPathFill && path.isPointInPath(context,mouseX,mouseY,(o.value as FillStroke).fillPathRule)) || (o.isPathStroke && path.isPointInStroke(context,mouseX,mouseY));
               }
            }
          }
        }

        context.restore();
    }
    //console.log(this.offsetW,this.offsetH)


    if(target.cacheAsBitmap){
      this.updateBounds(target);
      target.bitmapCache.draw(context,this.offsetW,this.offsetH);
    }


    if(target.mouseIsOver == false && hitTest) target.onMouseOver();
    if(target.mouseIsOver && hitTest == false) target.onMouseOut();

  }
  */


  public updateBounds(target: Display2D): Rectangle2D {
    /*
    it's a copy of "update" without mouse handling, mouse events & rendering update
    */

    let o: RenderStackElement;
    let path: Path;

    //@ts-ignore
    let text: TextPath;
    let fillStroke: FillStroke;


    //target.resetBoundsOffsets();

    let offsetW: number = 0;
    let offsetH: number = 0;
    let lineW: number = 0;

    let i: number, nb: number = this.elements.length;
    for (i = 0; i < nb; i++) {
      o = this.elements[i];
      if (o.enabled) {
        if (o.isPath) path = o.value as Path
        else if (o.isTextPath) text = o.value as TextPath;
        else {
          fillStroke = o.value as FillStroke;
          if (fillStroke.offsetW > offsetW) offsetW = fillStroke.offsetW;
          if (fillStroke.offsetH > offsetH) offsetH = fillStroke.offsetH;
          if (fillStroke.lineWidth > lineW) lineW = fillStroke.lineWidth;
        }
      }

    }

    if (!path || !path.geometry) return undefined;


    var r: Rectangle2D = path.geometry.getBounds(target, (offsetW + lineW) * Math.sqrt(2), (offsetH + lineW) * Math.sqrt(2));
    //target.bounds.init(r.minX, r.minY, r.maxX, r.maxY);


    this.offsetW = lineW + (offsetW) * (Math.sqrt(2) + 1);
    this.offsetH = lineW + (offsetH) * (Math.sqrt(2) + 1);
    return r;
  }




  public updateCache(context: CanvasRenderingContext2D, target: Display2D): void {

    let o: RenderStackElement;
    let path: Path;
    let text: TextPath;
    let i: number, nb: number = this.elements.length;
    for (i = 0; i < nb; i++) {
      o = this.elements[i];

      context.save();
      if (o.enabled) {
        if (o.isPath) path = o.value as Path
        else if (o.isTextPath) text = o.value as TextPath;
        else {
          if (o.isTextFillStroke) (o.value as TextRenderable).apply(context, text, target);
          else (o.value as PathRenderable).apply(context, path, target);
        }
      }

      context.restore();
    }
  }


}
