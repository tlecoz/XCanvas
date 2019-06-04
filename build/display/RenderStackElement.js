class RenderStackElement extends RegisterableObject {
    constructor(element, mouseEnabled = true) {
        super();
        this.enabled = true;
        this.lastPath = null;
        this.lastFillStroke = null;
        this.value = element;
        this.mouseEnabled = mouseEnabled;
        this.isShape = this.value instanceof Shape;
        if (this.isShape)
            return;
        this.isPath = this.value instanceof Path;
        this.isTextPath = this.value instanceof TextPath;
        if (this.isPath || this.isTextPath)
            return;
        this.isPathFill = this.value instanceof SolidFill ||
            this.value instanceof GradientFill ||
            this.value instanceof PatternFill ||
            this.value instanceof BitmapFill || this.value instanceof BitmapCacheFill;
        this.isPathStroke = this.value instanceof SolidStroke ||
            this.value instanceof GradientStroke ||
            this.value instanceof PatternStroke;
        this.isTextFill = this.value instanceof SolidTextFill ||
            this.value instanceof GradientTextFill ||
            this.value instanceof PatternTextFill;
        this.isTextStroke = this.value instanceof SolidTextStroke ||
            this.value instanceof GradientTextStroke ||
            this.value instanceof PatternTextStroke;
        this.isTextFillStroke = this.value instanceof SolidTextFill ||
            this.value instanceof GradientTextFill ||
            this.value instanceof PatternTextFill ||
            this.value instanceof SolidTextStroke ||
            this.value instanceof GradientTextStroke ||
            this.value instanceof PatternTextStroke;
        this.isPathFillStroke = this.value instanceof SolidStroke ||
            this.value instanceof GradientStroke ||
            this.value instanceof PatternStroke ||
            this.value instanceof SolidFill ||
            this.value instanceof GradientFill ||
            this.value instanceof PatternFill ||
            this.value instanceof BitmapFill;
        this.isStroke = this.isTextStroke || this.isPathStroke;
    }
    get dataString() {
        var mouseEnabled = 0;
        var lastPath = "0";
        var lastFillStroke = "0";
        if (this.mouseEnabled)
            mouseEnabled = 1;
        if (this.lastPath)
            lastPath = this.lastPath.REGISTER_ID;
        if (this.lastFillStroke)
            lastFillStroke = this.lastFillStroke.REGISTER_ID;
        return [this.value.REGISTER_ID, mouseEnabled, lastPath, lastFillStroke, Number(this.enabled)].join(",");
    }
    static fromDataString(data) {
        var t = data.split(",");
        var r = new RenderStackElement(ObjectLibrary.instance.getObjectByRegisterId(t[0]), t[1] == "1");
        if (t[2] != "0")
            r.lastPath = ObjectLibrary.instance.getObjectByRegisterId(t[2]);
        if (t[3] != "0")
            r.lastFillStroke = ObjectLibrary.instance.getObjectByRegisterId(t[3]);
        r.enabled = t[4] == "1";
        return r;
    }
    clone() {
        var o = new RenderStackElement(this.value, this.mouseEnabled);
        o.init(this.lastPath, this.lastFillStroke);
        return o;
    }
    init(lastPath, lastFillStroke) {
        this.lastPath = lastPath;
        this.lastFillStroke = lastFillStroke;
    }
}
//# sourceMappingURL=RenderStackElement.js.map