class SolidFill extends Fill {
    constructor(r = "#000000", g = null, b = null, a = null) {
        super();
        //r can contains these values :
        //-> 0...255 => as the red component
        //-> 0xrrggbb => RGB hex number
        //-> 0xaarrggbb
        //-> "#rrggbb"
        //--> "#aarrggbb"
        if (r instanceof SolidColor)
            this.color = r;
        else
            this.color = new SolidColor(r, g, b, a);
    }
    apply(context, path, target) {
        context.fillStyle = this.color.style;
        context.fill(path, this.fillPathRule);
    }
}
//# sourceMappingURL=SolidFill.js.map