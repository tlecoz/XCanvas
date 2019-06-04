class Pattern extends FillStroke {
    constructor(source, crop = true, applyTargetScale = false) {
        super();
        this.dirty = true;
        this.dirtyMatrix = true;
        this.imageBmp = null;
        this.rotationInDegree = 0;
        this._crop = true;
        this._applyTargetScale = false;
        this.videoUpdate = false;
        this.source = source;
        var th = this;
        this.onImageLoaded = function (e) {
            th.imageBmp = null;
            th.dirty = th.dirtyMatrix = true;
        };
        source.addEventListener(BitmapData.IMAGE_LOADED, this.onImageLoaded);
        this.canvas = source.htmlCanvas;
        this.matrix = new Matrix2D();
        this._crop = crop;
        this._applyTargetScale = applyTargetScale;
    }
    get crop() { return this._crop; }
    set crop(b) {
        if (this._crop != b) {
            this.dirty = this.dirtyMatrix = true;
            this._crop = b;
        }
    }
    get applyTargetScale() { return this._applyTargetScale; }
    set applyTargetScale(b) {
        if (this._applyTargetScale != b) {
            this.dirty = this.dirtyMatrix = true;
            this._crop = b;
        }
    }
    clone(cloneMedia = false, cloneLineStyle = true, cloneTextStyle = true, cloneTextLineStyle = true) {
        var o;
        if (!cloneMedia)
            o = new Pattern(this.source);
        else {
            if (this.source instanceof BitmapData)
                o = new Pattern(this.source.clone());
            else
                o = new Pattern(this.source);
        }
        o.mat.x = this.matrix.x;
        o.mat.y = this.matrix.y;
        o.mat.scaleX = this.matrix.scaleX;
        o.mat.scaleY = this.matrix.scaleY;
        o.mat.rotation = this.matrix.rotation;
        o.mat.width = this.matrix.width;
        o.mat.height = this.matrix.height;
        o.mat.setMatrixValue(this.matrix.toString());
        o.fillPathRule = this.fillPathRule;
        o.styleType = this.styleType;
        if (this.lineStyle) {
            if (cloneLineStyle)
                o.lineStyle = this.lineStyle.clone();
            else
                o.lineStyle = this.lineStyle;
        }
        if (this.textStyle) {
            if (cloneTextStyle)
                o.textStyle = this.textStyle.clone(cloneTextLineStyle);
            else
                o.textStyle = this.textStyle;
        }
        o.alpha = this.alpha;
        return o;
    }
    get mat() { return this.matrix; }
    get imageSource() { return this.source; }
    set bitmapData(n) {
        if (n != this.source) {
            if (this.source && this.source instanceof BitmapData)
                this.source.removeEventListener(BitmapData.IMAGE_LOADED, this.onImageLoaded);
            this.source = n;
            this.source.addEventListener(BitmapData.IMAGE_LOADED, this.onImageLoaded);
            this.canvas = this.source.htmlCanvas;
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
            this.rotationInDegree = n;
            this.matrix.rotation = n;
            this.dirtyMatrix = true;
        }
    }
    /*
  
  
    - Display2D.stack -> ajouter parametre cacheAsBitmap=false,cacheAsBitmapFilter=false
                        => gestion du cachesource des FillStroke
  
                        ==> faire en sorte que le cache des FillStroke / Filter soit associé au Display2D
                            -> creer un id unique par FillStroke/Filter
  
                        ##>>>> créer un objet StyleStack associé à la renderStack
                               => on recréé une renderStack qui contiendra une liste d'objet permettant d'utiliser
                                  soit un element de la renderStack source, soit un clone de l'objet source
                                  => on garde la référence de la source
                                  => c'est cet objet qui contiendra le cachesource du fillStroke/filter
  
  
                               ===> c'est l'objet qui sera utilisé pour générer le rendu final du Display2D
  
  
                               -> contient les cachesource des FillStroke/Filter
  
  
    */
    apply(context, path, target) {
        let canvas = this.canvas;
        if (this.source instanceof BitmapData) {
            canvas = this.source.htmlCanvas;
            if (this.source instanceof Video) {
                this.dirty = this.source.update();
            }
        }
        else {
            canvas = this.source;
        }
        if (this.dirty) {
            this.patternCanvas = context.createPattern(canvas, "repeat");
            this.dirty = false;
        }
        if (!this.patternCanvas)
            return;
        this.targetW = target.width;
        this.targetH = target.height;
        //-----------------------------------
        var w = canvas.width;
        var h = canvas.height;
        let tw = target.width * target.scaleX;
        let th = target.height * target.scaleY;
        if (this.dirtyMatrix) {
            this.matrix.identity();
            let stx = 1, sty = 1;
            if (this.applyTargetScale) {
                stx = target.scaleX;
                sty = target.scaleY;
            }
            let cropRatio = 1;
            let sx = 1, sy = 1;
            if (this.crop) {
                let s = tw / w;
                w *= s;
                h *= s;
                if (h < th) {
                    s = th / h;
                    w *= s;
                    h *= s;
                }
                sx = w / canvas.width;
                sy = w / canvas.width;
                this.matrix.scale(sx * target.inverseW / target.scaleX, sy * target.inverseH / target.scaleY);
                this.matrix.translate(-((w - tw) / sx) * 0.5, -((h - th) / sy) * 0.5);
                this.matrix.translate(((w) / sx) / 2, (h / sy) / 2);
                this.matrix.scale(this.scaleX * stx, this.scaleY * sty);
                this.matrix.rotate(this.rotation / FillStroke.radian);
                this.matrix.translate(-(w / sx) / 2, -(h / sy) / 2);
                this.matrix.translate(this.x, this.y);
            }
            else {
                this.matrix.scale(sx * stx * target.inverseW * this.scaleX, sy * sty * target.inverseH * this.scaleY);
                this.matrix.rotate(this.rotation / FillStroke.radian);
                this.matrix.translate(this.x, this.y);
            }
            this.dirtyMatrix = false;
        }
        super.apply(context, path, target);
        let pattern = this.patternCanvas;
        pattern.setTransform(this.matrix.domMatrix);
        context[this.styleType] = pattern;
    }
}
//# sourceMappingURL=Pattern.js.map