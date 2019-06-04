class SolidTextStroke extends Solid {
    constructor(textStyle, r = "#000000", g = null, b = null, a = null) {
        super(r, g, b, a);
        this.styleType = "strokeStyle";
        this.textStyle = textStyle;
    }
    get dataString() {
        return this.textStyle.REGISTER_ID + "," + this.color.REGISTER_ID;
    }
    static fromDataString(data) {
        var t = data.split(",");
        return new SolidTextStroke(ObjectLibrary.instance.getObjectByRegisterId(t[0]), ObjectLibrary.instance.getObjectByRegisterId(t[1]));
    }
    apply(context, path, target) {
        this.textStyle.apply(context, path, target);
        super.apply(context, path, target);
        if (target.fillStrokeDrawable)
            context.strokeText(path.text, this.textStyle.offsetX / target.width, this.textStyle.offsetY / target.height);
    }
}
//# sourceMappingURL=SolidTextStroke.js.map