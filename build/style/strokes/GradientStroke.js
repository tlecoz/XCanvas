class GradientStroke extends Gradient {
    constructor(gradient, isLinear = true) {
        super(gradient, isLinear);
        this.styleType = "strokeStyle";
    }
    get dataString() {
        var linear = 0;
        if (this.isLinear)
            linear = 1;
        return this.gradient.REGISTER_ID + "," + linear;
    }
    static fromDataString(data) {
        var t = data.split(",");
        return new GradientStroke(ObjectLibrary.instance.getObjectByRegisterId(t[0]), t[1] == "1");
    }
    apply(context, path, target) {
        if (this.lineStyle)
            this.lineStyle.apply(context, path, target);
        super.apply(context, path, target);
        if (target.fillStrokeDrawable)
            context.stroke(path.path);
    }
}
//# sourceMappingURL=GradientStroke.js.map