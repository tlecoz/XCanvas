class FillStroke extends RegisterableObject {
    constructor() {
        super();
        this.fillPathRule = "nonzero";
        this.alpha = 1;
        this.lineStyle = null;
        this.textStyle = null;
        //public filter:CssFilter = null;
        this.filters = null;
        this.needsUpdate = true;
        this.offsetW = 0;
        this.offsetH = 0;
        this.dirty = true;
        this._cacheAsBitmap = false;
        this.cacheDirty = false;
        this.cache = null;
        //this._filters = new FilterStack();
    }
    apply(context, path, target) {
        if (target.fillStrokeDrawable)
            context.globalAlpha = this.alpha * target.realAlpha;
        let css = this.filters;
        if (css) {
            this.dirty = css.dirty;
            if (target.fillStrokeDrawable)
                context.filter = css.value;
            this.offsetW = css.boundOffsetW;
            this.offsetH = css.boundOffsetH;
        }
        else {
            context.filter = "none";
        }
    }
    get cacheAsBitmap() { return this._cacheAsBitmap; }
    set cacheAsBitmap(b) {
        if (this._cacheAsBitmap != b) {
            this._cacheAsBitmap = b;
            if (b)
                this.cacheDirty = true;
        }
    }
    get isFill() { return this.styleType == "fillStyle"; }
    get isStroke() { return this.styleType == "strokeStyle"; }
    get realOffsetW() { return this.offsetW + this.lineWidth; }
    get realOffsetH() { return this.offsetH + this.lineWidth; }
    get lineWidth() {
        if (null == this.lineStyle)
            return 0;
        return this.lineStyle.lineWidth;
    }
}
FillStroke.radian = Math.PI / 180;
//# sourceMappingURL=FillStroke.js.map