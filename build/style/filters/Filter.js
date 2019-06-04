class Filter extends DirtyEventDispatcher {
    constructor() {
        super();
        this.boundOffsetW = 0;
        this.boundOffsetH = 0;
        this.next = null;
        this._offsetX = 0;
        this._offsetY = 0;
        this._radius = 0;
        this._intensity = 0;
        this._angle = 0;
        var th = this;
        this._updateColor = function () {
            th.dirty = true;
            th.applyDirty();
        };
    }
    get value() { return null; }
    get angle() { return this._angle; }
    set angle(n) {
        if (n != this._angle) {
            this._angle = n;
        }
    }
    get color() { return this._color; }
    set color(c) {
        if (c != this._color) {
            if (this._color)
                this._color.removeEventListener(SolidColor.UPDATE_STYLE, this._updateColor);
            this._color = c;
            this._color.addEventListener(SolidColor.UPDATE_STYLE, this._updateColor);
            this.applyDirty();
        }
    }
    get intensity() { return this._intensity; }
    set intensity(n) {
        if (n != this._intensity) {
            this._intensity = n;
            this.applyDirty();
        }
    }
    get offsetX() { return this._offsetX; }
    set offsetX(n) {
        if (n != this._offsetX) {
            this._offsetX = n;
            this.boundOffsetW = Math.abs(n) + this.radius;
            this.applyDirty();
        }
    }
    get offsetY() { return this._offsetX; }
    set offsetY(n) {
        if (n != this._offsetY) {
            this._offsetY = n;
            this.boundOffsetH = Math.abs(n) + this.radius;
            this.applyDirty();
        }
    }
    get radius() { return this._radius; }
    set radius(n) {
        if (n != this._radius) {
            this._radius = n;
            this.boundOffsetW = Math.abs(this._offsetX) + n;
            this.boundOffsetH = Math.abs(this._offsetY) + n;
            this.applyDirty();
        }
    }
    clear() {
        for (var z in this)
            this[z] = null;
    }
}
//# sourceMappingURL=Filter.js.map