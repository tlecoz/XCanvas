class GradientTextStroke extends Gradient {
    constructor(textStyle, gradient, isLinear = true) {
        super(gradient, isLinear);
        this.styleType = "strokeStyle";
        this.textStyle = textStyle;
    }
    get dataString() {
        var linear = 0;
        if (this.isLinear)
            linear = 1;
        return this.textStyle.REGISTER_ID + "," + this.gradient.REGISTER_ID + "," + linear;
    }
    static fromDataString(data) {
        var t = data.split(",");
        return new GradientTextStroke(ObjectLibrary.instance.getObjectByRegisterId(t[0]), ObjectLibrary.instance.getObjectByRegisterId(t[1]), t[2] == "1");
    }
    apply(context, path, target) {
        this.textStyle.apply(context, path, target);
        super.apply(context, path, target);
        if (target.fillStrokeDrawable)
            context.strokeText(path.text, this.textStyle.offsetX / target.width, this.textStyle.offsetY / target.height);
    }
}
//# sourceMappingURL=GradientTextStroke.js.map