class BitmapCacheFill extends FillStroke {
    constructor(bd, centerInto = true) {
        super();
        this.bd = bd;
        this.styleType = "fillStyle";
    }
    apply(context, path, target) {
        const bd = this.bd.htmlCanvas;
        context.save(); // do not delete ! need it for mouseevent
        context.scale(target.inverseW, target.inverseH);
        context.translate(target.xAxis, target.yAxis);
        super.apply(context, path, target);
        context.drawImage(bd, 0, 0);
        context.restore(); // do not delete ! need it for mouseevent
    }
}
//# sourceMappingURL=BitmapFillBasic.js.map