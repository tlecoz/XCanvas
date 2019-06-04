class PatternText extends Pattern {
    constructor(textStyle, bd, centerInto = true) {
        super(bd, centerInto);
        this.styleType = "fillStyle";
        this.textStyle = textStyle;
    }
    apply(context, path, target) {
        context.save();
        this.textStyle.apply(context, null, target);
        super.apply(context, null, target);
        context.fillText("youpi", this.textStyle.offsetX / target.width, this.textStyle.offsetY / target.height);
        context.restore();
    }
}
//# sourceMappingURL=PatternText.js.map