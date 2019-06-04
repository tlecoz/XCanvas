class InvertFilter extends Filter {
    constructor(intensity = 0) {
        super();
        this._intensity = intensity;
    }
    get dataString() { return "" + this._intensity; }
    static fromDataString(data) { return new InvertFilter(Number(data)); }
    get value() { return "invert(" + this._intensity + "+%)"; }
    clone() { return new InvertFilter(this._intensity); }
}
//# sourceMappingURL=InvertFilter.js.map