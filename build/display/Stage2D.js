class Stage2D extends Group2D {
    constructor(w, h, appendOnBody = true) {
        super();
        this._stage = this;
        if (!Browser.canUseOffscreenCanvas) {
            this._canvas = document.createElement("canvas");
            this._output = this._canvas;
            this._output.style.position = "absolute";
            this._outputContext = this._output.getContext("2d");
        }
        else {
            this._canvas = new window.OffscreenCanvas(w, h);
            this._output = document.createElement("canvas");
            this._output.style.position = "absolute";
            if (Browser.canUseImageBitmap)
                this._outputContext = this._output.getContext("bitmaprenderer");
            else
                this._outputContext = this._output.getContext("2d");
        }
        this._canvas.width = this._output.width = w;
        this._canvas.height = this._output.height = h;
        this._context = this._canvas.getContext("2d");
        this._mouseControler = new MouseControler(this._output);
        //console.log("new Stage2D ",w,h,appendOnBody)
        if (appendOnBody)
            document.body.appendChild(this._output);
    }
    get dataString() {
        //this.width = this.canvas.width;
        //this.height = this.canvas.height;
        var o = super.dataString + "###" + this._canvas.width + "," + this._canvas.height;
        //this.width = this.height = 1;
        return o;
    }
    static fromDataString(data) {
        var t = data.split("###");
        var sizes = t[1].split(",");
        data = t[0];
        var t = data.split("#")[2].split(",");
        //console.log("stage data = ",data)
        console.log(data);
        console.log(sizes);
        var o = new Stage2D(Number(sizes[0]), Number(sizes[1]), true);
        Group2D.fromDataString(data, o);
        return o;
    }
    get canvas() { return this._canvas; }
    get context() { return this._context; }
    get mouseControler() { return this._mouseControler; }
    get realAlpha() { return this.alpha; }
    get realX() { return this.x; }
    ;
    get realY() { return this.y; }
    ;
    get realScaleX() { return this.scaleX; }
    ;
    get realScaleY() { return this.scaleY; }
    ;
    get realRotation() { return this.rotation; }
    ;
    drawElements() {
        this._canvas.width = this._canvas.width;
        super.update(this._context);
        if (Browser.canUseImageBitmap) {
            //console.log("drawElements ",this._outputContext)
            createImageBitmap(this._canvas).then((bmp) => this._outputContext.transferFromImageBitmap(bmp));
        }
        else {
            this._outputContext.drawImage(this._canvas, 0, 0);
        }
    }
}
//# sourceMappingURL=Stage2D.js.map