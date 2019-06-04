class BitmapText extends BitmapFill {
    constructor(textStyle, bd, centerInto = true) {
        super(bd, centerInto);
        this.bd = bd;
        this.centerInto = centerInto;
        this.styleType = "fillStyle";
        this.textStyle = textStyle;
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
        context.save();
        context.clip(target.path);
        context.scale(target.inverseW * this.scaleX, target.inverseH * this.scaleY);
        context.translate(target.xAxis, target.yAxis);
        context.rotate(this.rotation);
        if (this.centerInto)
            context.translate((target.width - bd.width) * 0.5, (target.height - bd.height) * 0.5);
        context.translate(this.x, this.y);
        this.textStyle.apply(context, null, target);
        super.apply(context, null, target);
        context.drawImage(bd, 0, 0);
        context.clip();
        context.fillText(path, this.textStyle.offsetX, this.textStyle.offsetY);
        context.restore();
    }
}
//# sourceMappingURL=BitmapText.js.map