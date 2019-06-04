class BitmapFill extends FillStroke {
    constructor(bd, centerInto = true) {
        super();
        this.centerInto = false;
        this.x = 0;
        this.y = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.bd = bd;
        this.centerInto = centerInto;
        this.styleType = "fillStyle";
    }
    get dataString() {
        var centerInto = 0;
        if (this.centerInto)
            centerInto = 1;
        return this.bd.REGISTER_ID + "," + centerInto;
    }
    static fromDataString(data) {
        var t = data.split(",");
        return new BitmapFill(ObjectLibrary.instance.getObjectByRegisterId(t[0]), t[1] == "1");
    }
    clone(cloneMedia = false, cloneLineStyle = true) {
        var o;
        if (cloneMedia)
            o = new BitmapFill(this.bd.clone());
        else
            o = new BitmapFill(this.bd);
        o.x = this.x;
        o.y = this.y;
        o.scaleX = this.scaleX;
        o.scaleY = this.scaleY;
        o.rotation = this.rotation;
        if (this.lineStyle) {
            if (cloneLineStyle)
                o.lineStyle = this.lineStyle.clone();
            else
                o.lineStyle = this.lineStyle;
        }
        return o;
    }
    apply(context, path, target) {
        const bd = this.bd.htmlCanvas;
        context.save(); // do not delete ! need it for mouseevent
        context.clip(path.path);
        context.scale(target.inverseW * this.scaleX, target.inverseH * this.scaleY);
        context.translate(target.xAxis, target.yAxis);
        context.rotate(this.rotation);
        if (this.centerInto)
            context.translate((target.width - bd.width) * 0.5, (target.height - bd.height) * 0.5);
        context.translate(this.x, this.y);
        super.apply(context, path, target);
        if (target.fillStrokeDrawable)
            context.drawImage(bd, 0, 0);
        context.restore(); // do not delete ! need it for mouseevent
    }
}
//# sourceMappingURL=BitmapFill.js.map