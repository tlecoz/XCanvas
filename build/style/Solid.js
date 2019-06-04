class Solid extends FillStroke {
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
    clone(cloneColor = false, cloneLineStyle = true, cloneTextStyle = true, cloneTextLineStyle = true) {
        var o;
        if (cloneColor)
            o = new Solid(this.color.clone());
        else
            o = new Solid(this.color);
        o.fillPathRule = this.fillPathRule;
        o.styleType = this.styleType;
        o.alpha = this.alpha;
        if (this.lineStyle) {
            if (cloneLineStyle)
                o.lineStyle = this.lineStyle.clone();
            else
                o.lineStyle = this.lineStyle;
        }
        if (this.textStyle) {
            if (cloneTextStyle)
                o.textStyle = this.textStyle.clone(cloneTextLineStyle);
            else
                o.textStyle = this.textStyle;
        }
        return o;
    }
    apply(context, path, target) {
        super.apply(context, path, target);
        context[this.styleType] = this.color.style;
    }
}
//# sourceMappingURL=Solid.js.map