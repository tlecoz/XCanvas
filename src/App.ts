import { BitmapData } from "./bitmap/BitmapData";
import { GradientColor } from "./color/GradientColor";
import { SolidColor } from "./color/SolidColor";
import { Display2D } from "./display/Display2D";
import { Group2D } from "./display/Group2D";
import { RenderStack } from "./display/RenderStack";
import { Shape } from "./display/Shape";
import { Stage2D } from "./display/Stage2D";
import { Align } from "./geom/Align";
import { BitmapPath } from "./graphics/BitmapPath";
import { CirclePath } from "./graphics/primitives/CirclePath";
import { SquarePath } from "./graphics/primitives/SquarePath";
import { Img } from "./media/Img";
import { Video } from "./media/Video";
import { LineStyle } from "./style/LineStyle";
import { TextStyle } from "./style/TextStyle";
import { PatternFill } from "./style/fills/PatternFill";
import { SolidFill } from "./style/fills/SolidFill";
import { GlowFilter } from "./style/filters/GlowFilter";
import { GradientStroke } from "./style/strokes/GradientStroke";
import { TextPath } from "./style/textstyles/TextPath";
import { SolidTextStroke } from "./style/textstyles/strokes/SolidTextStroke";
//import { ObjectLibrary } from "./utils/ObjectLibrary";

//@ts-ignore
import { FilterStack } from "./style/filters/FilterStack";
//import { GradientTextFill } from "./style/textstyles/fills/GradientTextFill";
//import { PatternTextFill } from "./style/textstyles/fills/PatternTextFill";
import { SolidStroke } from "./style/strokes/SolidStroke";
import { RenderStackElement } from "./display/RenderStackElement";


export class App {


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
    var stage = new Stage2D(window.innerWidth, window.innerHeight);

    var contener = new Group2D();
    contener.x = 300;
    contener.y = 100;
    stage.appendChild(contener);

    //contener.rotation = -45
    var c0 = new SolidColor(0xcc0000);
    var gradient = new GradientColor([c0, new SolidColor(0xff0000)], null, true);
    //var gradient = new RadialGradientColor();
    //gradient.setColorStep([new SolidColor(0xff0000),new SolidColor(0x0000ff)]);

    var bd = new Img("assets/mire.jpg");
    //bd.loadImage("assets/mire.jpg",true,false)
    //bd.loadImage("assets/tile.jpg",true,true)

    var video = new Video(1920 * 0.5, 1080 * 0.5, "assets/video.webm")

    var stroke = new GradientStroke(gradient);
    var vectoLineStyle: LineStyle = new LineStyle(15)

    var alphaBd = new Img("assets/alpha.png");
    alphaBd.addEventListener(BitmapData.IMAGE_LOADED, function () {

      var bitmapPath = new BitmapPath(alphaBd);
      var vecto = new Display2D(400, 500);
      vecto.x = -200

      vecto.stack(bitmapPath);
      vecto.stack(new SolidStroke(c0, vectoLineStyle));
      vecto.stack(new GradientStroke(gradient, true, vectoLineStyle))
      vecto.stack(new PatternFill(video));



      //console.log("vecto = ",Path.fromDataString(bitmapPath.dataString));

      contener.appendChild(vecto);







    })


    //setTimeout(() => {
    //  ObjectLibrary.instance.save();
    //}, 5000)

    //alphaBd.loadImage(,true,false)

    //ObjectLibrary.instance.load("test.txt");

    //@ts-ignore
    var fill, textFill;
    var textStyle = new TextStyle("Arial", 100, "px");
    textStyle.lineStyle = new LineStyle(3);





    fill = new PatternFill(bd, true, false);
    //fill = new SolidFill("#000000");
    //fill = new GradientFill(gradient);
    //fill = new BitmapFill(bd,true);
    //fill.filter = new CssFilter().halo(25,"#ff0000")

    var glow = new GlowFilter(25, "#ff0000");
    var filters = new FilterStack().add(glow);
    fill.filters = filters;

    //textFill = new PatternTextFill(textStyle, bd);
    //textFill = new GradientTextFill(textStyle, gradient);
    textFill = new SolidTextStroke(textStyle, c0);

    //stroke = new SolidStroke("#0000ff");
    //stroke = new PatternStroke(bd,true);

    //stroke.filter = "blur(5px)"

    var lineOption = stroke.lineStyle = new LineStyle();
    lineOption.lineWidth = 10;
    lineOption.dashLineDist = 30;
    lineOption.dashHoleDist = 30;
    lineOption.cap = "round";
    lineOption.join = "round"



    //fill.x = 300
    //fill.scaleX = 4;
    //fill.rotation = Math.PI/4

    var redQuad = new RenderStack();
    redQuad.push(SquarePath.instance);
    redQuad.push(new SolidFill(c0));

    var shape = new Shape(50, 450, 50, 100, redQuad);


    var mcs = []
    var nbMc = 1
    var i;
    var alpha = 1;
    var textElement: RenderStackElement;
    for (i = 0; i < nbMc; i++) {

      var mc = new Display2D(400, 400);
      mcs[i] = mc;
      //mc.stack(SquarePath.instance);
      mc.stack(CirclePath.instance);
      mc.stack(fill);
      mc.stack(stroke);
      textElement = mc.stack(new TextPath("Hello Canvas !"));
      mc.stack(textFill);

      mc.stack(shape);

      mc.align(Align.CENTER);
      mc.x = 200 + i * 20;
      mc.y = 200;
      mc.rotation = 50 + (360 / nbMc) * i;
      //mc.scaleX = 2.5;
      contener.appendChild(mc);

      mc.alpha = alpha
      //mc.scaleX = 1.5;
      mc.addEventListener(Display2D.MOUSE_OVER, function (e) {
        console.log("over");
        mc.alpha = 0.5;//alpha - 0.25;

      })
      mc.addEventListener(Display2D.MOUSE_OUT, function (e) {
        //console.log("out");
        mc.alpha = alpha
      })
    }

    document.body.onclick = function () {
      for (i = 0; i < nbMc; i++) {
        mcs[i].cacheAsBitmap = !mcs[i].cacheAsBitmap;
      }

    }

    //ObjectLibrary.print();



    var a = 0
    function animate() {
      a += 0.01;
      console.log(textElement);
      const text = "Hello Canvas !";
      var pct = Math.sin(a * 2.5);
      (textElement as any).value.text = "Hello Canvas ! ".slice(0, Math.round(text.length * Math.abs(pct)));
      vectoLineStyle.lineWidth = Math.abs(Math.cos(a)) * 15;

      //stroke.lineStyle.dashOffset = (Math.sin(a*0.05))*300

      c0.g = 127 + Math.abs(pct * 100);
      c0.b = 255 - Math.abs(pct * 255);
      //mc.scaleX = mc.scaleY = 1 + (Math.sin(a*0.1))*0.5
      //mc.rotation += 1



      glow.radius = 25 + 50 * Math.sin(pct * Math.PI * 0.2);

      for (i = 0; i < nbMc; i++) {
        //mcs[i].rotation = -a*100;
        //mcs[i].scaleX = 1 + 1-(c0.g / 255)*(i+1)*(1/nbMc) ;
      }



      //lineOption.dashOffset = pct
      lineOption.dashLineDist = 25 + pct * 15;
      lineOption.dashHoleDist = 20 + (1 - pct) * 5;
      mc.x = 400 + Math.sin(a) * 150
      fill.rotation -= 0.0025;
      stroke.rotation += 0.01;
      //


      fill.scaleX = fill.scaleY = 1 + Math.abs(Math.sin(a) * .5);
      fill.x = Math.sin(a * Math.PI) * 100;
      //gradient.needsUpdate = true;

      stage.drawElements();

      //mc.updateCache()
      //mc.updateCacheWithoutRotation()

      //stage.context.beginPath()


      requestAnimationFrame(animate);
    }

    animate()
  }



}
