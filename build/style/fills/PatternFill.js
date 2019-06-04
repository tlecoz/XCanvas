class PatternFill extends Pattern {
    constructor(source, crop = true, applyTargetScale = false) {
        super(source, crop, applyTargetScale);
        this.styleType = "fillStyle";
    }
    get dataString() {
        var crop = 0;
        var targetScale = 0;
        if (this.crop)
            crop = 1;
        if (this.applyTargetScale)
            targetScale = 1;
        return this.source.REGISTER_ID + "," + crop + "," + targetScale;
    }
    static fromDataString(data) {
        var t = data.split(",");
        return new PatternFill(ObjectLibrary.instance.getObjectByRegisterId(t[0]), t[1] == "1", t[1] == "1");
    }
    apply(context, path, target) {
        super.apply(context, path, target);
        if (target.fillStrokeDrawable)
            context.fill(path.path, this.fillPathRule);
    }
}
//# sourceMappingURL=PatternFill.js.map