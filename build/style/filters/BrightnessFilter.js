class BrightnessFilter extends Filter {
    constructor(intensity = 0) {
        super();
        this._intensity = intensity;
    }
    get dataString() { return "" + this._intensity; }
    static fromDataString(data) { return new BrightnessFilter(Number(data)); }
    clone() { return new BrightnessFilter(this._intensity); }
    get value() { return "brightness(" + this._intensity + "+%)"; }
}
//# sourceMappingURL=BrightnessFilter.js.map