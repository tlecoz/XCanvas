class SaturatetFilter extends Filter {
    constructor(intensity = 3) {
        super();
        this._intensity = intensity;
    }
    get dataString() { return "" + this._intensity; }
    static fromDataString(data) { return new SaturatetFilter(Number(data)); }
    get value() { return "saturate(" + this._intensity + "+%)"; }
    clone() { return new SaturatetFilter(this._intensity); }
}
//# sourceMappingURL=SaturateFilter.js.map