class HueRotateFilter extends Filter {
    constructor(angle = 0) {
        super();
        this._angle = angle;
    }
    get dataString() { return "" + this._angle; }
    static fromDataString(data) { return new HueRotateFilter(Number(data)); }
    get value() { return "hue-rotate(" + this._angle + "+%)"; }
    clone() { return new HueRotateFilter(this._angle); }
}
//# sourceMappingURL=HueRotateFilter.js.map