class Display2D extends Matrix2D {
    constructor(w, h, renderStack = null) {
        super();
        this._cacheAsBitmap = false;
        this.width = 1;
        this.height = 1;
        this.alpha = 1;
        this.inverseW = 1; //used for filling process;
        this.inverseH = 1; //used for filling process;
        this.mouseIsOver = false;
        this.mouseEnabled = true;
        this.useBasicHitTest = false;
        this._display2dName = "o" + (Display2D.display2dIndex++);
        this.width = w;
        this.height = h;
        if (!renderStack)
            this.renderStack = new RenderStack();
        else
            this.renderStack = renderStack;
        this._bounds = new Rectangle2D(0, 0, w, h);
        this.cache = new BitmapCache(this);
    }
    get dataString() {
        var datas = super.dataString;
        datas += "#";
        datas += [this.width, this.height, this.alpha, this.renderStack.REGISTER_ID].join(",");
        return datas;
    }
    static fromDataString(data, target = null) {
        var t = data.split("#")[2].split(",");
        console.log(t);
        var o;
        if (!target)
            o = new Display2D(Number(t[0]), Number(t[1]), ObjectLibrary.instance.getObjectByRegisterId(t[3]));
        else
            o = target;
        o.alpha = Number(t[2]);
        Matrix2D.fromDataString(data, o);
        return o;
    }
    /*
  
       bitmap to geometry
  
      //----------------
  
      faire en sorte qu'on puisse pusher une RenderStack dans une RenderStack
  
      gérer les stack de
        - globalCompositeOperation
        - pixel manipulation
  
      fx basé sur une renderstack
         - tint --> source + globalCompositeOperation +(SquarePath + Fill)
  
    */
    get fillStrokeDrawable() { return this._cacheAsBitmap == false || this.cache.needsUpdate == true; }
    get display2dName() { return this._display2dName; }
    get useComplexHitTest() { return this.useBasicHitTest == false && this.mouseEnabled; }
    setStage(stage) {
        this._stage = stage;
        if (stage)
            this.mouse = stage.mouseControler;
        else
            this.mouse = null;
    }
    get stage() { return this._stage; }
    align(displayAlign = Align.CENTER) {
        this.xAxis = this.width * displayAlign.x;
        this.yAxis = this.height * displayAlign.y;
    }
    stack(renderStackElement) {
        return this.renderStack.push(renderStackElement);
    }
    get cacheAsBitmap() { return this._cacheAsBitmap; }
    set cacheAsBitmap(b) {
        if (b != this._cacheAsBitmap) {
            this._cacheAsBitmap = b;
            if (b)
                this.cache.needsUpdate = true;
        }
    }
    get bitmapCache() { return this.cache; }
    get bounds() { return this._bounds; }
    get realAlpha() {
        if (!this.parent)
            console.log(this);
        return this.parent.realAlpha * this.alpha;
    }
    get realX() { return this.parent.realX + this.x; }
    ;
    get realY() { return this.parent.realY + this.y; }
    ;
    get realScaleX() { return this.parent.realScaleX * this.scaleX; }
    ;
    get realScaleY() { return this.parent.realScaleY * this.scaleY; }
    ;
    get realRotation() { return this.parent.realRotation + this.rotation; }
    ;
    onMouseOver() {
        this.mouseIsOver = true;
        this.dispatchEvent(Display2D.MOUSE_OVER);
    }
    onMouseOut() {
        this.mouseIsOver = false;
        this.dispatchEvent(Display2D.MOUSE_OUT);
    }
    resetBoundsOffsets() {
        this.offsetW = this.offsetH = 0;
    }
    update(context) {
        this.identity();
        this.inverseW = 1 / this.width;
        this.inverseH = 1 / this.height;
        context.save();
        if (this.parent)
            this.multiply(this.parent);
        let m = this.currentTransform = this.applyTransform();
        context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
        this.cache.updateCache();
        if (this.mouseEnabled && this.mouse)
            this.renderStack.updateWithHitTest(context, this, this.mouse.x, this.mouse.y);
        else
            this.renderStack.update(context, this);
        context.restore();
    }
}
Display2D.display2dIndex = 0;
Display2D.MOUSE_OVER = "MOUSE_OVER";
Display2D.MOUSE_OUT = "MOUSE_OUT";
Display2D.CLICK = "CLICK";
Display2D.pathManager = new Path();
//# sourceMappingURL=Display2D.js.map