class GradientFill extends Gradient {
    constructor(gradient, isLinear = true) {
        super(gradient, isLinear);
        this.styleType = "fillStyle";
    }
    get dataString() {
        var linear = 0;
        if (this.isLinear)
            linear = 1;
        return this.gradient.REGISTER_ID + "," + linear;
    }
    static fromDataString(data) {
        var t = data.split(",");
        return new GradientFill(ObjectLibrary.instance.getObjectByRegisterId(t[0]), t[1] == "1");
    }
    apply(context, path, target) {
        super.apply(context, path, target);
        if (target.fillStrokeDrawable)
            context.fill(path.path, this.fillPathRule);
    }
}
//# sourceMappingURL=GradientFill.js.map