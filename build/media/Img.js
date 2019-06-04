class Img extends BitmapData {
    constructor(url = "") {
        super();
        this._url = "";
        var th = this;
        var img = this._img = document.createElement("img");
        img.onload = function () {
            th.width = img.width;
            th.height = img.height;
            th.drawImage(img, 0, 0);
            if (th.onLoaded)
                th.onLoaded(img);
            th.dispatchEvent(Img.IMAGE_LOADED);
        };
        this.url = url;
    }
    get dataString() { return this.url; }
    static fromDataString(url) { return new Img(url); }
    get htmlImage() { return this._img; }
    get url() { return this._url; }
    set url(s) {
        if (s != this._url) {
            this._url = this._img.src = s;
        }
    }
}
//# sourceMappingURL=Img.js.map