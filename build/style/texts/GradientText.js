class GradientText extends Gradient {
    constructor(textStyle, gradient, isLinear = true) {
        super(gradient, isLinear);
        this.styleType = "fillStyle";
        this.textStyle = textStyle;
    }
    apply(context, path, target) {
        context.save();
        this.textStyle.apply(context, null, target);
        super.apply(context, SquarePath.path, target);
        context.fillText("youpi", this.textStyle.offsetX / target.width, this.textStyle.offsetY / target.height);
        context.restore();
    }
}
//# sourceMappingURL=GradientText.js.map