class DropShadow extends Filter {
    constructor(offsetX, offsetY, radius, color) {
        super();
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._radius = radius;
        this._color = color;
        var th = this;
        this.updateColor = function () { th.dispatchEvent(Filter.UPDATE); };
        color.addEventListener(SolidColor.UPDATE_STYLE, this.updateColor);
    }
    clear() {
        this._offsetX = this._offsetY = this._radius = this._color = this.updateColor = null;
    }
    get color() { return this._color; }
    set color(c) {
        if (c != this._color) {
            this._color.removeEventListener(SolidColor.UPDATE_STYLE, this.updateColor);
            this._color = c;
            c.addEventListener(SolidColor.UPDATE_STYLE, this.updateColor);
            this.dispatchEvent(Filter.UPDATE);
        }
    }
    get offsetX() { return this._offsetX; }
    set offsetX(n) {
        if (n != this._offsetX) {
            this._offsetX = n;
            this.dispatchEvent(Filter.UPDATE);
        }
    }
    get offsetY() { return this._offsetX; }
    set offsetY(n) {
        if (n != this._offsetY) {
            this._offsetY = n;
            this.dispatchEvent(Filter.UPDATE);
        }
    }
    get radius() { return this._radius; }
    set radius(n) {
        if (n != this._radius) {
            this._radius = n;
            this.dispatchEvent(Filter.UPDATE);
        }
    }
}
//# sourceMappingURL=DropShadow.js.map