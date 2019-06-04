class GradientFill extends Fill {
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
    static clearCacheGradients() {
        GradientFill.gradients = {};
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
    get y() { return this._y; }
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
        if (this.dirty || this._gradient.needsUpdate) {
            this._gradient.transformValues(this._x, this._y, this._scaleX, this._scaleY, this._rotation, this._radialFlareX, this._radialFlareY, this._radialFlareStrength);
            GradientFill.gradients[target.display2dName] = this._gradient.getGradientStyle(context, target);
            this.dirty = false;
        }
        context.save();
        context.fillStyle = GradientFill.gradients[target.display2dName];
        context.fill(path, this.fillPathRule);
        context.restore();
    }
}
GradientFill.gradients = {};
//# sourceMappingURL=GradientFill.js.map