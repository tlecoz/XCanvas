class GrayscaleFilter extends Filter {
    constructor(intensity = 0) {
        super();
        this._intensity = intensity;
    }
    get dataString() { return "" + this._intensity; }
    static fromDataString(data) { return new GrayscaleFilter(Number(data)); }
    clone() { return new GrayscaleFilter(this._intensity); }
    get value() { return "grayscale(" + this._intensity + "+%)"; }
}
//# sourceMappingURL=GrayscaleFilter.js.map