class SolidStroke extends Solid {
    constructor(r = "#000000", g = null, b = null, a = null) {
        super(r, g, b, a);
        this.styleType = "strokeStyle";
    }
    get dataString() {
        return this.color.REGISTER_ID;
    }
    static fromDataString(data) {
        return new SolidStroke(ObjectLibrary.instance.getObjectByRegisterId(data));
    }
    apply(context, path, target) {
        if (this.lineStyle)
            this.lineStyle.apply(context, path, target);
        super.apply(context, path, target);
        if (target.fillStrokeDrawable)
            context.stroke(path.path);
    }
}
//# sourceMappingURL=SolidStroke.js.map