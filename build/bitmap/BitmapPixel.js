class BitmapPixel {
    constructor() {
        if (BitmapPixel._instance)
            throw new Error("You must use BitmapPixel.instance");
        BitmapPixel._instance = this;
    }
    static get instance() {
        if (!BitmapPixel._instance)
            new BitmapPixel();
        return BitmapPixel._instance;
    }
    init(pixelData, w, h) {
        this.w = w;
        this.h = h;
        this.pixelData = pixelData;
        return this;
    }
    getPixelObject(x, y) {
        this.id = (y * this.w + x) * 4;
        return this;
    }
    setRGB(x, y, r, g, b) {
        var id = (y * this.w + x) * 4;
        this.pixelData[id++] = r;
        this.pixelData[id++] = g;
        this.pixelData[id++] = b;
        this.pixelData[id++] = 255;
    }
    setRGBA(x, y, r, g, b, a) {
        var id = (y * this.w + x) * 4;
        this.pixelData[id++] = r;
        this.pixelData[id++] = g;
        this.pixelData[id++] = b;
        this.pixelData[id++] = a;
    }
    setSolidColorPixel(x, y, solidColor) {
        var id = (y * this.w + x) * 4;
        this.pixelData[id++] = solidColor.r;
        this.pixelData[id++] = solidColor.g;
        this.pixelData[id++] = solidColor.b;
        this.pixelData[id++] = solidColor.a;
    }
    copyIntoSolidColor(x, y, solidColor) {
        var id = (y * this.w + x) * 4;
        solidColor.r = this.pixelData[id++];
        solidColor.b = this.pixelData[id++];
        solidColor.g = this.pixelData[id++];
        solidColor.a = this.pixelData[id++];
    }
    get r() { return this.pixelData[this.id]; }
    get g() { return this.pixelData[this.id + 1]; }
    get b() { return this.pixelData[this.id + 2]; }
    get a() { return this.pixelData[this.id + 3]; }
    set r(n) { this.pixelData[this.id] = n; }
    set g(n) { this.pixelData[this.id + 1] = n; }
    set b(n) { this.pixelData[this.id + 2] = n; }
    set a(n) { this.pixelData[this.id + 3] = n; }
}
//# sourceMappingURL=BitmapPixel.js.map