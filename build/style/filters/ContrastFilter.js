class ContrastFilter extends Filter {
    constructor(intensity = 0) {
        super();
        this._intensity = intensity;
    }
    get dataString() { return "" + this._intensity; }
    static fromDataString(data) { return new ContrastFilter(Number(data)); }
    clone() { return new ContrastFilter(this._intensity); }
    get value() { return "contrast(" + this._intensity + "+%)"; }
}
//# sourceMappingURL=ContrastFilter.js.map