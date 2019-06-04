class BlurFilter extends Filter {
    constructor(intensity = 0) {
        super();
        this.radius = intensity;
    }
    get dataString() { return "" + this.radius; }
    static fromDataString(data) { return new BlurFilter(Number(data)); }
    clone() { return new BlurFilter(this.radius); }
    get value() { return "blur(" + this.radius + "+px)"; }
}
//# sourceMappingURL=BlurFilter.js.map