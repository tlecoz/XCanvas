class DropShadowFilter extends Filter {
    constructor(offsetX, offsetY, radius, color) {
        super();
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.radius = radius;
        if (color instanceof SolidColor)
            this.color = color;
        else
            this.color = new SolidColor(color);
        //this.color.addEventListener(SolidColor.UPDATE_STYLE,this._updateColor)
    }
    get dataString() {
        return [this.offsetX, this.offsetY, this.radius, this.color.REGISTER_ID].join(",");
    }
    static fromDataString(data) {
        var t = data.split(",");
        return new DropShadowFilter(Number(t[0]), Number(t[1]), Number(t[2]), ObjectLibrary.instance.getObjectByRegisterId(t[3]));
    }
    clone(cloneColor = false) {
        if (!cloneColor)
            return new DropShadowFilter(this._offsetX, this._offsetY, this._radius, this._color);
        return new DropShadowFilter(this._offsetX, this._offsetY, this._radius, this._color.clone());
    }
    get value() { return "drop-shadow(" + this._offsetX + "px " + this._offsetY + "px " + this._radius + "px " + this._color.style + ") "; }
}
//# sourceMappingURL=DropShadowFilter.js.map