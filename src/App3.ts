import { SolidColor } from "./color/SolidColor";
import { Display2D } from "./display/Display2D";
import { Group2D } from "./display/Group2D";
import { RenderStack } from "./display/RenderStack";
import { Stage2D } from "./display/Stage2D";
import { SquarePath } from "./graphics/primitives/SquarePath";
import { SolidFill } from "./style/fills/SolidFill";
import { ObjectLibrary } from "./utils/ObjectLibrary";

export class App3 {


  /*
  TODO : Shape -> getBounds / offsetW / offsetH

  BitmapPath.triangulate
  Path.triangulate

  Bibliotheque
               #colors :
               -> colors:SolidColor[]
               -> linearGradients
               -> radialGradients

               #paths
               -> path / bitmapPath

               #texts / textstyle



               #fills
               #strokes / linestyle
               #renderPath
               #Shape
               #Display2D
               #Group2D

               #media : image / video / mp3 / fonts

              #BitmapData




  */



  constructor() {
    var stage = new Stage2D(800, 600);


    var c0 = new SolidColor(0xff0000);
    var redQuad = new RenderStack();
    redQuad.push(SquarePath.instance);
    redQuad.push(new SolidFill(c0));

    var mc = new Display2D(200, 200, redQuad);
    mc.x = mc.y = 100

    var group = new Group2D();
    group.x = 200;
    group.appendChild(mc)

    stage.appendChild(group);
    stage.drawElements();
    ObjectLibrary.instance.save();
  }



}
