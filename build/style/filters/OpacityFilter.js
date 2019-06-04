class OpacityFilter extends Filter {
    constructor(intensity = 3) {
        super();
        this._intensity = intensity;
    }
    get dataString() { return "" + this._intensity; }
    static fromDataString(data) { return new OpacityFilter(Number(data)); }
    get value() { return "opacity(" + this._intensity + "+%)"; }
    clone() { return new OpacityFilter(this._intensity); }
}
//# sourceMappingURL=OpacityFilter.js.map