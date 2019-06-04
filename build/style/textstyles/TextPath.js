class TextPath extends RegisterableObject {
    constructor(text) {
        super();
        this.text = text;
    }
    get dataString() { return this.text; }
    static fromDataString(data) { return new TextPath(data); }
    isPointInside(context, px, py, isStroke, fillrule = "nonzero") {
        return false;
    }
    isPointInPath(context, px, py) {
        return false;
    }
    isPointInStroke(context, px, py) {
        return false;
    }
}
//# sourceMappingURL=TextPath.js.map