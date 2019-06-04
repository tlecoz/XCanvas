class PatternTextFill extends Pattern {
    constructor(textStyle, bd, crop = true, applyTargetScale = false) {
        super(bd, crop, applyTargetScale);
        this.styleType = "fillStyle";
        this.textStyle = textStyle;
    }
    get dataString() {
        var crop = 0;
        var targetScale = 0;
        if (this.crop)
            crop = 1;
        if (this.applyTargetScale)
            targetScale = 1;
        return this.textStyle.REGISTER_ID + "," + this.source.REGISTER_ID + "," + crop + "," + targetScale;
    }
    static fromDataString(data) {
        var t = data.split(",");
        return new PatternTextFill(ObjectLibrary.instance.getObjectByRegisterId(t[0]), ObjectLibrary.instance.getObjectByRegisterId(t[1]), t[2] == "1", t[3] == "1");
    }
    apply(context, path, target) {
        this.textStyle.apply(context, path, target);
        super.apply(context, path, target);
        if (target.fillStrokeDrawable)
            context.fillText(path.text, this.textStyle.offsetX / target.width, this.textStyle.offsetY / target.height);
    }
}
//# sourceMappingURL=PatternTextFill.js.map