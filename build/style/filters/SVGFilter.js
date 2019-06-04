class SVGFilter extends Filter {
    constructor(url) {
        super();
        this._url = url;
    }
    get dataString() { return "" + this._url; }
    static fromDataString(data) { return new SVGFilter(data); }
    get url() { return this._url; }
    set url(n) {
        if (n != this._url) {
            this._url = n;
            this.applyDirty();
        }
    }
    get value() { return "url(" + this._url + "+)"; }
    clone() { return new SVGFilter(this._url); }
}
//# sourceMappingURL=SVGFilter.js.map