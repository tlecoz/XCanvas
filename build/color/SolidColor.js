class SolidColor extends EventDispatcher {
    constructor(r, g = null, b = null, a = 1) {
        super();
        this.useAlpha = false;
        //r can contains these values :
        //-> 0...255 => as the red component
        //-> 0xrrggbb => RGB hex number
        //-> 0xaarrggbb
        //-> "#rrggbb"
        //--> "#aarrggbb"
        console.warn("new SolidColor ", r, g, b, a);
        var red;
        if (g == null) {
            if (typeof (r) == "string") {
                var s = r.split("#").join("0x");
                //console.log(s);
                r = Number(s);
            }
            var color = r;
            if (r > 0xffffff) { //useAlpha
                a = color >>> 24;
                red = color >>> 16 & 0xFF;
                g = color >>> 8 & 0xFF;
                b = color & 0xFF;
            }
            else {
                red = color >> 16;
                g = color >> 8 & 0xFF;
                b = color & 0xFF;
                a = 1;
                console.log("aaa ", red, g, b);
            }
        }
        if (isNaN(red))
            red = r;
        this._r = red;
        this._g = g;
        this._b = b;
        this._a = a;
        this.updateStyle();
    }
    clone() { return new SolidColor(this._r, this._g, this._b, this._a); }
    get dataString() {
        return this._r + "," + this._g + "," + this._b + "," + this._a;
    }
    static fromDataString(data) {
        const t = data.split(",");
        return new SolidColor(Number(t[0]), Number(t[1]), Number(t[2]), Number(t[3]));
    }
    get r() { return this._r; }
    set r(n) {
        if (this._r != n) {
            this._r = n;
            this.updateStyle();
        }
    }
    get g() { return this._g; }
    set g(n) {
        if (this._g != n) {
            this._g = n;
            this.updateStyle();
        }
    }
    get b() { return this._b; }
    set b(n) {
        if (this._b != n) {
            this._b = n;
            this.updateStyle();
        }
    }
    get a() { return this._a; }
    set a(n) {
        if (this._a != n) {
            this._a = n;
            this.updateStyle();
        }
    }
    setRGB(r, g, b) {
        this.useAlpha = false;
        this._r = r;
        this._g = g;
        this._b = b;
        this.updateStyle();
    }
    setRGBA(r, g, b, a) {
        this.useAlpha = true;
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
        this.updateStyle();
    }
    createBrighterColor(pct) {
        var r = this._r + (255 - this._r) * pct;
        var g = this._g + (255 - this._g) * pct;
        var b = this._b + (255 - this._b) * pct;
        return new SolidColor(r, g, b);
    }
    createDarkerColor(pct) {
        var r = this._r * (1 - pct);
        var g = this._g * (1 - pct);
        var b = this._b * (1 - pct);
        return new SolidColor(r, g, b);
    }
    updateStyle(dispatchEvent = true) {
        if (this.useAlpha)
            this._style = "rgba(" + this._r + "," + this._g + "," + this._b + "," + this._a + ")";
        else
            this._style = "rgb(" + this._r + "," + this._g + "," + this._b + ")";
        //console.log(this.style)
        if (dispatchEvent)
            this.dispatchEvent(SolidColor.UPDATE_STYLE);
    }
    get style() { return this._style; }
}
SolidColor.UPDATE_STYLE = "UPDATE_STYLE";
SolidColor.INVISIBLE_COLOR = new SolidColor(0, 0, 0, 0);
//# sourceMappingURL=SolidColor.js.map