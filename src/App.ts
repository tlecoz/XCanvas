class App {


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



  constructor(){
    var stage = new Stage2D(window.innerWidth,window.innerHeight);

    var contener = new Group2D();
    contener.x = 300;
    contener.y = 100;
    stage.appendChild(contener);

    //contener.rotation = -45
    var c0 = new SolidColor(0xff0000);
    var gradient = new GradientColor([c0,new SolidColor(0x0000ff)],null,true);
    //var gradient = new RadialGradientColor();
    //gradient.setColorStep([new SolidColor(0xff0000),new SolidColor(0x0000ff)]);

    var bd = new Img("assets/mire.jpg");
    //bd.loadImage("assets/mire.jpg",true,false)
    //bd.loadImage("assets/tile.jpg",true,true)

    var video = new Video(192*4,108*4,"assets/video2.mp4")


    var alphaBd = new Img("assets/alpha.png");
    alphaBd.addEventListener(BitmapData.IMAGE_LOADED,function(){

      var bitmapPath = new BitmapPath(alphaBd);
      var vecto = new Display2D(400,500);
      vecto.x = -200

      vecto.stack(bitmapPath);
      vecto.stack(new PatternFill(video));


      //console.log("vecto = ",Path.fromDataString(bitmapPath.dataString));

      contener.appendChild(vecto);




      ObjectLibrary.instance.save();


    })
    //alphaBd.loadImage(,true,false)

    //ObjectLibrary.instance.load("test.txt");


    var fill,stroke,textFill,textStroke;
    var textStyle = new TextStyle("Arial",100,"px");
    textStyle.lineStyle = new LineStyle(3);
    var solid = new SolidFill("#000000");




    fill = new PatternFill(bd,true,false);
    //fill = new GradientFill(gradient);
    //fill = new BitmapFill(bd,true);
    //fill.filter = new CssFilter().halo(25,"#ff0000")

    var glow = new GlowFilter(25,"#ff0000");
    var filters = new FilterStack().add(glow);
    fill.filters = glow;//filters;

    //textFill = new PatternText(textStyle,bd);
    //textFill = new GradientText(textStyle,gradient);
    textFill = new SolidTextStroke(textStyle,c0);

    //stroke = new SolidStroke("#0000ff");
    //stroke = new PatternStroke(bd,true);
    stroke = new GradientStroke(gradient);
    //stroke.filter = "blur(5px)"

    var lineOption = stroke.lineStyle = new LineStyle();
    lineOption.lineWidth = 15;
    //lineOption.dashLineDist = 10;
    //lineOption.dashHoleDist = 10;
    lineOption.cap = "round";
    lineOption.join = "round"



    //fill.x = 300
    //fill.scaleX = 4;
    //fill.rotation = Math.PI/4

    var redQuad = new RenderStack();
    redQuad.push(SquarePath.instance);
    redQuad.push(new SolidFill(c0));

    var shape = new Shape(50,450,50,100,redQuad);


    var mcs = []
    var nbMc = 1
    var i;
    var alpha = 1;
    for(i=0;i<nbMc;i++){

      var mc = new Display2D(400,400);
        mcs[i] = mc;
        //mc.stack(SquarePath.instance);
        mc.stack(CirclePath.instance);
        mc.stack(fill);
        mc.stack(stroke);
        mc.stack(new TextPath("Youpi !"));
        mc.stack(textFill);
        mc.stack(shape);

        mc.align(Align.CENTER);
        mc.x = 200 + i* 20;
        mc.y = 200 ;
        mc.rotation =  50 + (360/nbMc)*i;
        //mc.scaleX = 2.5;
        contener.appendChild(mc);

        mc.alpha = alpha
        //mc.scaleX = 1.5;
        mc.addEventListener(Display2D.MOUSE_OVER,function(e){
          //console.log("over");
          e.alpha = 0.5;//alpha - 0.25;

        })
        mc.addEventListener(Display2D.MOUSE_OUT,function(e){
          //console.log("out");
          e.alpha = alpha
        })
    }

    document.body.onclick = function(){
      for(i=0;i<nbMc;i++){
        mcs[i].cacheAsBitmap = !mcs[i].cacheAsBitmap;
      }

    }

    //ObjectLibrary.print();



    var a = 0
    function animate(){
      a+=0.01;



      //stroke.lineStyle.dashOffset = (Math.sin(a*0.05))*300
      var pct =Math.sin(a*5) ;
      c0.g = Math.abs(pct*255) ;
      //mc.scaleX = mc.scaleY = 1 + (Math.sin(a*0.1))*0.5
      //mc.rotation += 1

      //glow.radius = 10 + 25 * pct;

      for(i=0;i<nbMc;i++){
        //mcs[i].rotation = -a*100;
        //mcs[i].scaleX = 1 + 1-(c0.g / 255)*(i+1)*(1/nbMc) ;
      }



      //lineOption.dashOffset=pct
      //lineOption.dashLineDist = 5+pct*100;
      //lineOption.dashHoleDist = 10+pct*100;
      //mc.x = 500 + Math.sin(a*0.05)*300
      //fill.rotation -= 0.1;
      stroke.rotation += 0.01;
      //

      //fill.rotation -= 0.01;

      //fill.scaleX = fill.scaleY = 0.5+Math.abs(Math.sin(a)*1.5);
      //fill.x= Math.sin(a * Math.PI/180);
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
