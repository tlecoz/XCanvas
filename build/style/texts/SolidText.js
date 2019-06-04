class SolidText extends Solid {
    constructor(textStyle, r = "#000000", g = null, b = null, a = null) {
        super(r, g, b, a);
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
//# sourceMappingURL=SolidText.js.map