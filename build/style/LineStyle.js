class LineStyle extends RegisterableObject {
    constructor(lineWidth = null) {
        super();
        this.cap = null;
        this.dashOffset = null;
        this.dashLineDist = null;
        this.dashHoleDist = null;
        this.join = null;
        this.lineWidth = null;
        this.miterLimit = null;
        this.allowScaleTransform = true;
        this.lineWidth = lineWidth;
    }
    get dataString() {
        return [this.lineWidth, this.cap, this.dashOffset, this.dashLineDist, this.dashHoleDist, this.join, this.miterLimit, Number(this.allowScaleTransform)].join(",");
    }
    static fromDataString(data) {
        var t = data.split(",");
        var o = new LineStyle(Number(t[0]));
        if (t[1] != "null")
            o.cap = t[1];
        if (t[2] != "null")
            o.dashOffset = Number(t[2]);
        if (t[3] != "null")
            o.dashLineDist = Number(t[3]);
        if (t[4] != "null")
            o.dashHoleDist = Number(t[4]);
        if (t[5] != "null")
            o.join = t[5];
        if (t[6] != "null")
            o.miterLimit = Number(t[6]);
        o.allowScaleTransform = t[7] == "1";
        return o;
    }
    clone() {
        var o = new LineStyle(this.lineWidth);
        o.cap = this.cap;
        o.dashOffset = this.dashOffset;
        o.dashHoleDist = this.dashHoleDist;
        o.dashLineDist = this.dashLineDist;
        o.join = this.join;
        o.miterLimit = this.miterLimit;
        return o;
    }
    apply(context, path, target) {
        if (this.cap)
            context.lineCap = this.cap;
        if (this.join)
            context.lineJoin = this.join;
        if (this.lineWidth)
            context.lineWidth = this.lineWidth;
        if (this.miterLimit)
            context.miterLimit = this.miterLimit;
        let sx = 1, sy = 1;
        if (this.allowScaleTransform) {
            sx = target.scaleX;
            sy = target.scaleY;
        }
        let s = Math.max(target.width / sx, target.height / sy);
        let s2 = Math.min(target.width, target.height);
        if (this.dashOffset)
            context.lineDashOffset = this.dashOffset;
        if (this.dashLineDist) {
            if (this.dashHoleDist)
                context.setLineDash([this.dashLineDist / s, this.dashHoleDist / s]);
            else
                context.setLineDash([this.dashLineDist / s]);
        }
        context.lineWidth = this.lineWidth / s2;
    }
}
//# sourceMappingURL=LineStyle.js.map