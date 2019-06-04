class PatternFill extends Fill {
    constructor(bd, centerInto = true) {
        super();
        this.dirty = true;
        this.dirtyMatrix = true;
        this.bd = bd;
        var th = this;
        this.onImageLoaded = function (e) { th.dirty = th.dirtyMatrix = true; };
        bd.addEventListener(BitmapData.IMAGE_LOADED, this.onImageLoaded);
        this.matrix = new Matrix2D();
        this.canvas = bd.htmlCanvas;
        this.center = centerInto;
    }
    get bitmapData() { return this.bd; }
    set bitmapData(n) {
        if (n != this.bd) {
            if (this.bd)
                this.bd.removeEventListener(BitmapData.IMAGE_LOADED, this.onImageLoaded);
            this.bd = n;
            this.bd.addEventListener(BitmapData.IMAGE_LOADED, this.onImageLoaded);
            this.canvas = this.bd.htmlCanvas;
            this.dirty = true;
        }
    }
    get centerInto() { return this.center; }
    set centerInto(n) {
        if (n != this.center) {
            this.center = n;
            this.dirtyMatrix = true;
        }
    }
    get targetWidth() { return this.targetW; }
    set targetWidth(n) {
        if (n != this.targetW) {
            this.targetW = n;
            this.dirtyMatrix = true;
        }
    }
    get targetHeight() { return this.targetW; }
    set targetHeight(n) {
        if (n != this.targetH) {
            this.targetH = n;
            this.dirtyMatrix = true;
        }
    }
    get x() { return this.matrix.x; }
    set x(n) {
        if (this.x != n) {
            this.matrix.x = n;
            this.dirtyMatrix = true;
        }
    }
    get y() { return this.matrix.y; }
    set y(n) {
        if (this.y != n) {
            this.matrix.y = n;
            this.dirtyMatrix = true;
        }
    }
    get scaleX() { return this.matrix.scaleX; }
    set scaleX(n) {
        if (this.scaleX != n) {
            this.matrix.scaleX = n;
            this.dirtyMatrix = true;
        }
    }
    get scaleY() { return this.matrix.scaleY; }
    set scaleY(n) {
        if (this.scaleY != n) {
            this.matrix.scaleY = n;
            this.dirtyMatrix = true;
        }
    }
    get rotation() { return this.matrix.rotation; }
    set rotation(n) {
        if (this.rotation != n) {
            this.matrix.rotation = n;
            this.dirtyMatrix = true;
        }
    }
    apply(context, path, target) {
        const canvas = this.canvas;
        if (this.dirty) {
            this.patternCanvas = context.createPattern(canvas, "repeat");
            this.dirty = false;
        }
        this.targetW = target.width;
        this.targetH = target.height;
        if (this.dirtyMatrix) {
            this.matrix.identity();
            this.matrix.scale(this.scaleX * target.inverseW, this.scaleY * target.inverseH);
            this.matrix.translate(target.xAxis, target.yAxis);
            this.matrix.rotate(this.rotation);
            if (this.centerInto)
                this.matrix.translate((target.width - canvas.width) * 0.5, (target.height - canvas.height) * 0.5);
            this.matrix.translate(this.x, this.y);
            this.dirtyMatrix = false;
        }
        context.save();
        let pattern = this.patternCanvas;
        pattern.setTransform(this.matrix.domMatrix);
        context.fillStyle = pattern;
        context.fill(path, this.fillPathRule);
        context.restore();
    }
}
//# sourceMappingURL=PatternFill.js.map