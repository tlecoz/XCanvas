class SepiaFilter extends Filter {
    constructor(intensity = 3) {
        super();
        this._intensity = intensity;
    }
    get dataString() { return "" + this._intensity; }
    static fromDataString(data) { return new SepiaFilter(Number(data)); }
    get value() { return "sepia(" + this._intensity + "+%)"; }
    clone() { return new SepiaFilter(this._intensity); }
}
//# sourceMappingURL=SepiaFilter.js.map