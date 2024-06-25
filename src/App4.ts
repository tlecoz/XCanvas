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


export class App4 {



    constructor() {
        const stage = new Stage2D(window.innerWidth, window.innerHeight);
        //Stage2D represent the canvas. It's the top-level abstraction in XCanvas. 

        const contener = new Group2D();
        //a Group2D is a Display2D that can contains multiple Display2D 

        contener.x = 300;
        contener.y = 0;
        contener.rotation = 25
        stage.appendChild(contener);

        const solidColor = new SolidColor(0xcc0000);
        const gradient = new GradientColor([solidColor, new SolidColor(0xff0000)], null, true);

        const image = new Img("assets/mire.jpg");
        const video = new Video(1920 * 0.5, 1080 * 0.5, "assets/video.webm")
        const gradientStroke = new GradientStroke(gradient);

        const treeLineStyle: LineStyle = new LineStyle(15)
        const alphaBd = new Img("assets/alpha.png");
        alphaBd.addEventListener(BitmapData.IMAGE_LOADED, function () {

            //we convert a png with alpha background showing a tree into a Path2D   
            const bitmapPath = new BitmapPath(alphaBd);

            //we create a Display2D containing the renderStack  
            const tree = new Display2D(400, 500);
            tree.x = -200

            const isLinearGradient: boolean = false;
            const treeGradient = new GradientColor([new SolidColor(0x0000ff), solidColor, new SolidColor(0xff0000)], null, isLinearGradient);

            //we stack some RenderStackable items in it 
            tree.stack(bitmapPath);
            tree.stack(new SolidStroke(solidColor, treeLineStyle));
            tree.stack(new GradientStroke(treeGradient, isLinearGradient, treeLineStyle))
            tree.stack(new PatternFill(video));
            contener.appendChild(tree);
        })


        const textStyle = new TextStyle("Arial", 100, "px");
        textStyle.lineStyle = new LineStyle(3);
        const solidTextStroke = new SolidTextStroke(textStyle, solidColor);

        const glowFilter = new GlowFilter(25, "#ff0000");
        const filters = new FilterStack().add(glowFilter);

        const fill = new PatternFill(image, true, false);
        fill.filters = filters;


        const circleLinestyle = gradientStroke.lineStyle = new LineStyle();
        circleLinestyle.lineWidth = 10;
        circleLinestyle.dashLineDist = 30;
        circleLinestyle.dashHoleDist = 30;
        circleLinestyle.cap = "round";
        circleLinestyle.join = "round"

        const rectangle = new RenderStack();
        rectangle.push(SquarePath.instance);
        rectangle.push(new SolidFill(solidColor));

        const shape = new Shape(50, 450, 50, 100, rectangle);
        //a shape is a cheap Display2D. Shape doesn't extends Matrix2D 
        //and only contains the properties "x","y","width","height" and "renderStack".
        //a renderStack can contains multiple paths/fill/stroke and even multiple sub-renderStack

        const compositeObject = new Display2D(400, 400);
        compositeObject.stack(CirclePath.instance);
        compositeObject.stack(fill);
        compositeObject.stack(gradientStroke);
        const textElement: RenderStackElement = compositeObject.stack(new TextPath("Hello Canvas !"));
        compositeObject.stack(solidTextStroke);
        compositeObject.stack(shape);
        compositeObject.align(Align.CENTER);
        compositeObject.x = 200;
        compositeObject.y = 200;
        compositeObject.rotation = 50;
        contener.appendChild(compositeObject);


        compositeObject.addEventListener(Display2D.MOUSE_OVER, function (e) {
            e.alpha = 0.5;

        })
        compositeObject.addEventListener(Display2D.MOUSE_OUT, function (e) {
            e.alpha = 1
        })


        document.body.onclick = function () {
            //in order to inprove performance, you can store the result of a renderPass in a bitmapCache
            //(if you do it, the property cannot be updated anymore )
            //(you must set "cacheAsBitmap" to false if you want to update the stack)
            compositeObject.cacheAsBitmap = !compositeObject.cacheAsBitmap;

        }

        let a = 0
        const text = "Hello Canvas !";
        function animate() {
            a += 0.01;
            const pct = Math.sin(a * 2.5);

            //we animate the text
            (textElement as any).value.text = "Hello Canvas ! ".slice(0, Math.round(text.length * Math.abs(pct)));

            //we animate the stroke of the tree
            treeLineStyle.lineWidth = Math.abs(Math.cos(a)) * 15;

            //we update "solidColor" 
            //it will update every object that use "solidColor" in its renderStack
            solidColor.g = 127 + Math.abs(pct * 100);
            solidColor.b = 255 - Math.abs(pct * 255);

            //we update the radius of the glowFilter
            glowFilter.radius = 25 + 50 * Math.sin(pct * Math.PI * 0.2);

            //we update the dash configuration of the linestyle used with the circle path
            circleLinestyle.dashLineDist = 25 + pct * 15;
            circleLinestyle.dashHoleDist = 20 + (1 - pct) * 5;

            //we move our compositeObject along the x-axis
            compositeObject.x = 400 + Math.sin(a) * 150

            //we rotate the gradient used in the stroke
            gradientStroke.rotation += 0.01;

            //we rotate the picture used in the fill
            fill.rotation -= 0.0025;
            //we scale the picture used in the fill
            fill.scaleX = fill.scaleY = 1 + Math.abs(Math.sin(a) * .5);
            //we translate the picture used in the fill
            fill.x = Math.sin(a * Math.PI) * 100;

            //we draw everything on the stage
            stage.drawElements();

            requestAnimationFrame(animate);
        }

        animate()
    }



}
