class TextStyle extends RegisterableObject {
    constructor(fontName, fontSize, sizeMeasure = "px", offsetX = 0, offsetY = 0, allowScaleTransform = false) {
        super();
        this.sizeMeasure = "px";
        this.offsetX = 0;
        this.offsetY = 0;
        this.lineStyle = null;
        this.allowScaleTransform = false;
        this.fontName = fontName;
        this.fontSize = fontSize;
        this.sizeMeasure = sizeMeasure;
        this.offsetX = offsetX + fontSize * 0.2;
        this.offsetY = offsetY + fontSize * 0.85;
        this.allowScaleTransform = allowScaleTransform;
    }
    get dataString() {
        return [this.fontName, this.fontSize, this.sizeMeasure, this.offsetX, this.offsetY, Number(this.allowScaleTransform)].join(",");
    }
    static fromDataString(data) {
        let t = data.split(",");
        let o = new TextStyle(t[0], Number(t[1]), t[2], Number(t[3]), Number(t[4]), t[5] == "1");
        return o;
    }
    clone(cloneTextLineStyle = true) {
        let t = null;
        if (this.lineStyle) {
            if (cloneTextLineStyle)
                t = this.lineStyle.clone();
            else
                t = this.lineStyle;
        }
        let s = new TextStyle(this.fontName, this.fontSize, this.sizeMeasure, this.offsetX, this.offsetY);
        s.lineStyle = t;
        return s;
    }
    apply(context, path, target) {
        var s = Math.max(target.width, target.height);
        if (this.lineStyle)
            this.lineStyle.apply(context, path, target);
        context.font = (this.fontSize / s) + this.sizeMeasure + " " + this.fontName;
        if (this.allowScaleTransform == false)
            context.scale(1 / target.scaleX, 1 / target.scaleY);
    }
}
//# sourceMappingURL=TextStyle.js.map