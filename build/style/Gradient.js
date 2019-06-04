class Gradient extends FillStroke {
    constructor(gradient, isLinear = true) {
        super();
        this._x = 0; //-> -0.999...+0.999
        this._y = 0; //-> -0.999...+0.999
        this._scaleX = 1;
        this._scaleY = 1;
        this._rotation = 0; // radian
        this._radialFlareX = 0; //-> -0.999...+0.999
        this._radialFlareY = 0; //-> -0.999...+0.999
        this._radialFlareStrength = 1;
        this.dirty = true;
        this._gradient = gradient;
        this._isLinear = isLinear;
    }
    clone(cloneGradient = false, cloneColors = false, cloneLineStyle = true, cloneTextStyle = true, cloneTextLineStyle = true) {
        var o;
        if (cloneGradient)
            o = new Gradient(this._gradient.clone(cloneColors));
        else
            o = new Gradient(this._gradient);
        o.fillPathRule = this.fillPathRule;
        o.styleType = this.styleType;
        o.x = this.x;
        o.y = this.y;
        o.scaleX = this.scaleX;
        o.scaleY = this.scaleY;
        o.rotation = this.rotation;
        o.radialFlareX = this.radialFlareX;
        o.radialFlareY = this.radialFlareY;
        o.radialFlareStrength = this.radialFlareStrength;
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
    get gradient() { return this._gradient; }
    set gradient(n) {
        this._gradient = n;
        this.dirty = true;
    }
    get isLinear() { return this._isLinear; }
    set isLinear(n) {
        this._isLinear = n;
        this.dirty = true;
    }
    get x() { return this._x; }
    set x(n) {
        this._x = n;
        this.dirty = true;
    }
    get y() { return this._x; }
    set y(n) {
        this._y = n;
        this.dirty = true;
    }
    get scaleX() { return this._scaleX; }
    set scaleX(n) {
        this._scaleX = n;
        this.dirty = true;
    }
    get scaleY() { return this._scaleY; }
    set scaleY(n) {
        this._scaleY = n;
        this.dirty = true;
    }
    get rotation() { return this._rotation; }
    set rotation(n) {
        this._rotation = n;
        this.dirty = true;
    }
    get radialFlareX() { return this._radialFlareX; }
    set radialFlareX(n) {
        this._radialFlareX = n;
        this.dirty = true;
    }
    get radialFlareY() { return this._radialFlareY; }
    set radialFlareY(n) {
        this._radialFlareY = n;
        this.dirty = true;
    }
    get radialFlareStrength() { return this._radialFlareStrength; }
    set radialFlareStrength(n) {
        this._radialFlareStrength = n;
        this.dirty = true;
    }
    apply(context, path, target) {
        if (this.dirty || this._gradient.dirty) {
            this._gradient.transformValues(this._x, this._y, this._scaleX, this._scaleY, this._rotation, this._radialFlareX, this._radialFlareY, this._radialFlareStrength);
            this.gradientCanvas = this._gradient.getGradientStyle(context, target);
            this.dirty = false;
        }
        super.apply(context, path, target);
        context[this.styleType] = this.gradientCanvas; //Gradient.gradients[this._name];
    }
}
//# sourceMappingURL=Gradient.js.map