class BitmapCacheFill extends FillStroke {
    constructor(bd, centerInto = true) {
        super();
        this.bd = bd;
        this.styleType = "fillStyle";
    }
    get width() { return this.bd.width; }
    get height() { return this.bd.height; }
    apply(context, path, target) {
        context.drawImage(this.bd.htmlCanvas, 0, 0);
    }
}
//# sourceMappingURL=BitmapCacheFill.js.map