class RenderStack extends RegisterableObject {
    constructor() {
        super();
        this.offsetW = 0;
        this.offsetH = 0;
        this._elements = [];
    }
    get dataString() {
        var s = "";
        var lastPath = "0";
        var lastFillStroke = "0";
        if (this.lastPath)
            lastPath = this.lastPath.REGISTER_ID;
        if (this.lastFillStroke)
            lastFillStroke = this.lastFillStroke.REGISTER_ID;
        s = lastPath + "," + lastFillStroke + "#";
        var i, len = this._elements.length;
        if (len == 0)
            return "";
        //console.log("renderStack.elements.length = ",len);
        for (i = 0; i < len; i++) {
            if (i > 0)
                s += ",";
            s += this._elements[i].REGISTER_ID;
        }
        return s;
    }
    static fromDataString(data) {
        var t2 = data.split("#");
        var t3 = t2[0].split(",");
        var t = t2[1].split(",");
        var i, len = t.length;
        var r = new RenderStack();
        for (i = 0; i < len; i++) {
            r.elements[i] = ObjectLibrary.instance.getObjectByRegisterId(t[i]);
        }
        if (t3[0] != "0")
            r.lastPath = ObjectLibrary.instance.getObjectByRegisterId(t3[0]);
        if (t3[1] != "0")
            r.lastFillStroke = ObjectLibrary.instance.getObjectByRegisterId(t3[1]);
        return r;
    }
    get elements() { return this._elements; }
    clone() {
        var o = new RenderStack();
        var i, len = this.elements.length;
        for (i = 0; i < len; i++)
            o.elements[i] = this.elements[i].clone();
        return o;
    }
    //##############
    //la renderStack ne peut pas etre une linked-list de telle manière qu'on puisse cloner le tableau contenant les objets sans cloner les objets
    //et de cloner un élément dans le tableau sans affecter tout le to
    //#################
    push(renderStackElement, mouseEnabled = true) {
        var o = new RenderStackElement(renderStackElement, mouseEnabled);
        this._elements.push(o);
        if (renderStackElement instanceof Path || renderStackElement instanceof TextPath)
            this.lastPath = renderStackElement;
        else if (renderStackElement instanceof FillStroke)
            this.lastFillStroke = renderStackElement;
        o.init(this.lastPath, this.lastFillStroke);
        return o;
    }
    updateWithHitTest(context, target, mouseX = Number.MAX_VALUE, mouseY = Number.MAX_VALUE, updateFromShape = false) {
        let o;
        let path;
        let hitTest = false;
        let fillStroke;
        let obj;
        let i, nb = this.elements.length;
        let b;
        for (i = 0; i < nb; i++) {
            o = this.elements[i];
            context.save();
            if (o.enabled) {
                if (o.isShape) {
                    b = o.value.apply(context, target, mouseX, mouseY);
                    if (!hitTest)
                        hitTest = b;
                }
                else {
                    if (o.isPath || o.isTextPath)
                        path = o.value;
                    else {
                        o.value.apply(context, path, target);
                        if (!hitTest && o.mouseEnabled && target.useComplexHitTest)
                            hitTest = path.isPointInside(context, mouseX, mouseY, o.isStroke);
                    }
                }
            }
            context.restore();
        }
        if (!updateFromShape && target.cacheAsBitmap) {
            this.updateBounds(target);
            target.bitmapCache.draw(context, this.offsetW, this.offsetH);
        }
        if (target.mouseIsOver == false && hitTest)
            target.onMouseOver();
        if (target.mouseIsOver && hitTest == false)
            target.onMouseOut();
        return hitTest;
    }
    update(context, target, updateFromShape = false) {
        let o;
        let path;
        let fillStroke;
        let obj;
        if (updateFromShape || target.cacheAsBitmap == false) {
            let i, nb = this.elements.length;
            for (i = 0; i < nb; i++) {
                o = this.elements[i];
                context.save();
                if (o.enabled) {
                    if (o.isPath || o.isTextPath)
                        path = o.value;
                    else
                        o.value.apply(context, path, target);
                }
                context.restore();
            }
        }
        else {
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
    updateBounds(target) {
        /*
        it's a copy of "update" without mouse handling, mouse events & rendering update
        */
        let o;
        let path;
        let text;
        let hitTest = false;
        let fillStroke;
        //target.resetBoundsOffsets();
        let offsetW = 0;
        let offsetH = 0;
        let lineW = 0;
        let i, nb = this.elements.length;
        for (i = 0; i < nb; i++) {
            o = this.elements[i];
            if (o.enabled) {
                if (o.isPath)
                    path = o.value;
                else if (o.isTextPath)
                    text = o.value;
                else {
                    fillStroke = o.value;
                    if (fillStroke.offsetW > offsetW)
                        offsetW = fillStroke.offsetW;
                    if (fillStroke.offsetH > offsetH)
                        offsetH = fillStroke.offsetH;
                    if (fillStroke.lineWidth > lineW)
                        lineW = fillStroke.lineWidth;
                }
            }
        }
        var r = path.geometry.getBounds(target, (offsetW + lineW) * Math.sqrt(2), (offsetH + lineW) * Math.sqrt(2));
        this.offsetW = lineW + (offsetW) * (Math.sqrt(2) + 1);
        this.offsetH = lineW + (offsetH) * (Math.sqrt(2) + 1);
        return r;
    }
    updateCache(context, target) {
        let o;
        let path;
        let text;
        let i, nb = this.elements.length;
        for (i = 0; i < nb; i++) {
            o = this.elements[i];
            context.save();
            if (o.enabled) {
                if (o.isPath)
                    path = o.value;
                else if (o.isTextPath)
                    text = o.value;
                else {
                    if (o.isTextFillStroke)
                        o.value.apply(context, text, target);
                    else
                        o.value.apply(context, path, target);
                }
            }
            context.restore();
        }
    }
}
//# sourceMappingURL=RenderStack.js.map