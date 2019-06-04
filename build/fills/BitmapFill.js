class BitmapFill extends Fill {
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
    }
    apply(context, path, target) {
        const bd = this.bd.htmlCanvas;
        context.save();
        context.clip(target.path);
        context.scale(target.inverseW * this.scaleX, target.inverseH * this.scaleY);
        context.translate(target.xAxis, target.yAxis);
        context.rotate(this.rotation);
        //context.translate(target.xAxis,target.yAxis);
        if (this.centerInto)
            context.translate((target.width - bd.width) * 0.5, (target.height - bd.height) * 0.5);
        context.translate(this.x, this.y);
        context.drawImage(bd, 0, 0);
        context.restore();
    }
}
//# sourceMappingURL=BitmapFill.js.map