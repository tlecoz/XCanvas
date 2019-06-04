class App3 {
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
        mc.x = mc.y = 100;
        var group = new Group2D();
        group.x = 200;
        group.appendChild(mc);
        stage.appendChild(group);
        stage.drawElements();
        ObjectLibrary.instance.save();
    }
}
//# sourceMappingURL=App3.js.map