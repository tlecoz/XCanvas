class ShadowFilter {
    constructor(solidColor, blur, offsetX, offsetY) {
        this.solidColor = solidColor;
        this.blur = blur;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
    apply(context2D) {
        context2D.shadowColor = this.solidColor.style;
        context2D.shadowBlur = this.blur;
        context2D.shadowOffsetX = this.offsetX;
        context2D.shadowOffsetY = this.offsetY;
    }
}
ShadowFilter.NO_SHADOW = new ShadowFilter(SolidColor.INVISIBLE_COLOR, 0, 0, 0);
//# sourceMappingURL=ShadowFilter.js.map