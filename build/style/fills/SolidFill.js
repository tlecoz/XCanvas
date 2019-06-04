class SolidFill extends Solid {
    constructor(r = "#000000", g = null, b = null, a = null) {
        super(r, g, b, a);
        this.styleType = "fillStyle";
    }
    get dataString() {
        return this.color.REGISTER_ID;
    }
    static fromDataString(data) {
        return new SolidFill(ObjectLibrary.instance.getObjectByRegisterId(data));
    }
    apply(context, path, target) {
        super.apply(context, path, target);
        if (target.fillStrokeDrawable)
            context.fill(path.path, this.fillPathRule);
    }
}
//# sourceMappingURL=SolidFill.js.map