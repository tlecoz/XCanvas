class GlowFilter extends DropShadowFilter {
    constructor(radius, color) {
        super(0, 0, radius, color);
    }
    get dataString() {
        return this.radius + "," + this.color.REGISTER_ID;
    }
    static fromDataString(data) {
        var t = data.split(",");
        return new GlowFilter(Number(t[0]), ObjectLibrary.instance.getObjectByRegisterId(t[1]));
    }
    clone(cloneColor = false) {
        if (cloneColor)
            return new GlowFilter(this._radius, this._color.clone());
        return new GlowFilter(this._radius, this._color);
    }
}
//# sourceMappingURL=GlowFilter.js.map