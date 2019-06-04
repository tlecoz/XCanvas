class GradientColor extends RegisterableObject {
    constructor(colors = null, ratios = null, isLinear = true) {
        super();
        this.x0 = 0;
        this.y0 = 0;
        this.r0 = 0;
        this.x1 = 0;
        this.y1 = 0;
        this.r1 = 0;
        this.style = null;
        this.ctx = null;
        this.dirty = true;
        this.scaleX = 1;
        this.scaleY = 1;
        this.x = 0; //-> -0.999...+0.999
        this.y = 0; //-> -0.999...+0.999
        this.rotation = 0; // radian
        this.radialFlareX = 0; //-> -0.999...+0.999
        this.radialFlareY = 0; //-> -0.999...+0.999
        this.radialFlareStrength = 1;
        this._scaleX = 1;
        this._scaleY = 1;
        this._x = 0; //-> -0.999...+0.999
        this._y = 0; //-> -0.999...+0.999
        this._rotation = 0; // radian
        this._radialFlareX = 0; //-> -0.999...+0.999
        this._radialFlareY = 0; //-> -0.999...+0.999
        this._radialFlareStrength = 1;
        var th = this;
        //this.onUpdateStyle = function(){th.dirty = true;}
        if (colors)
            this.setColorStep(colors, ratios);
        else {
            this.colors = [];
            this.ratios = [];
        }
        this.isLinear = isLinear;
    }
    get dataString() {
        let i, len = this.colors.length;
        let colors = "", ratios = "";
        for (i = 0; i < len; i++) {
            if (i != 0) {
                colors += ",";
                ratios += ",";
            }
            colors += this.colors[i].REGISTER_ID;
            ratios += this.ratios[i];
        }
        let b = 0;
        if (this.isLinear)
            b = 1;
        return colors + "|" + ratios + "|" + b;
    }
    static fromDataString(data) {
        let t = data.split("|");
        let c = t[0].split(",");
        let r = t[1].split(",");
        let linear = t[2] == "1";
        let i, len = c.length;
        let colors = [];
        let ratios = [];
        for (i = 0; i < len; i++) {
            colors[i] = ObjectLibrary.instance.getObjectByRegisterId(c[i]);
            ratios[i] = Number(r[i]);
        }
        return new GradientColor(colors, ratios, linear);
    }
    clone(cloneColors = false) {
        let c;
        if (cloneColors) {
            c = [];
            let i, len = this.colors.length;
            for (i = 0; i < len; i++)
                c[i] = this.colors[i].clone();
            return new GradientColor(c, this.ratios.concat(), this.isLinear);
        }
        else {
            return new GradientColor(this.colors.concat(), this.ratios.concat(), this.isLinear);
        }
    }
    transformValues(x = 0, y = 0, scaleX = 1, scaleY = 1, rotation = 0, flareX = 0, flareY = 0, flareStrength = 0) {
        this._x = x;
        this._y = y;
        this._scaleX = scaleX;
        this._scaleY = scaleY;
        this._rotation = rotation;
        this._radialFlareX = flareX;
        this._radialFlareY = flareY;
        this._radialFlareStrength = flareStrength;
        this.dirty = true;
    }
    initFromPoints(x0, y0, x1, y1, r0 = 0, r1 = 0) {
        this.x0 = x0;
        this.y0 = y0;
        this.r0 = r0;
        this.x1 = x1;
        this.y1 = y1;
        this.r1 = r1;
        this.dirty = true;
    }
    initLinearFromRect(x, y, w, h, angle) {
        const w2 = w / 2;
        const h2 = h / 2;
        const d = Math.sqrt(w2 * w2 + h2 * h2);
        const a1 = angle + Math.PI;
        const a2 = angle;
        x += w2;
        y += h2;
        this.x0 = x + Math.cos(a1) * d;
        this.y0 = y + Math.sin(a1) * d;
        this.x1 = x + Math.cos(a2) * d;
        this.y1 = y + Math.sin(a2) * d;
        this.dirty = true;
    }
    initRadialFromRect(x, y, w, h, radialFlareX = 0, radialFlareY = 0, flareStrength = 1) {
        if (radialFlareX <= -1)
            radialFlareX = -0.999;
        if (radialFlareY <= -1)
            radialFlareY = -0.999;
        if (radialFlareX >= 1)
            radialFlareX = 0.999;
        if (radialFlareY >= 1)
            radialFlareY = 0.999;
        const w2 = w / 2;
        const h2 = h / 2;
        const radius = Math.sqrt(w2 * w2 + h2 * h2);
        x += w2;
        y += h2;
        const a = Math.atan2(radialFlareY, radialFlareX);
        const dx = Math.cos(a) * (radius * radialFlareX);
        const dy = Math.sin(a) * (radius * radialFlareY);
        const d = Math.sqrt(dx * dx + dy * dy);
        this.x0 = x + Math.cos(a) * d;
        this.x1 = x;
        this.y0 = y + Math.sin(a) * d;
        this.y1 = y;
        this.r0 = 0;
        this.r1 = radius * flareStrength;
        this.dirty = true;
    }
    setColorStep(colors, ratios = null) {
        let i, nbStep, ratio, n;
        if (colors.length > 1) {
            if (ratios && colors.length <= ratios.length) {
                this.ratios = ratios;
                this.nbStep = colors.length;
                this.colors = colors;
            }
            else {
                this.nbStep = nbStep = colors.length;
                ratio = 0;
                n = 1 / (nbStep - 1);
                this.ratios = [];
                for (i = 0; i < nbStep; i++) {
                    this.ratios[i] = ratio;
                    ratio += n;
                }
            }
        }
        else {
            colors.push(colors[0]);
            this.nbStep = 2;
            this.ratios = [0, 1];
        }
        nbStep = this.nbStep;
        for (i = 0; i < nbStep; i++) {
            if (this.colors && this.colors[i])
                this.colors[i].removeEventListener(SolidColor.UPDATE_STYLE, this.onUpdateStyle);
            colors[i].addEventListener(SolidColor.UPDATE_STYLE, this.onUpdateStyle);
        }
        this.colors = colors;
        this.dirty = true;
    }
    addColorStep(ratio, r = 0, g = 0, b = 0, a = 1) {
        //var step:GradientStep = new GradientStep(this,ratio,r,g,b,a);
        var color = this.colors[this.nbStep] = new SolidColor(r, g, b, a);
        this.ratios[this.nbStep++] = ratio;
        return color;
    }
    getColorById(id) { return this.colors[id]; }
    setColorById(id, color) {
        if (this.colors[id]) {
            this.colors[id].removeEventListener(SolidColor.UPDATE_STYLE, this.onUpdateStyle);
            this.colors[id] = color;
            color.addEventListener(SolidColor.UPDATE_STYLE, this.onUpdateStyle);
        }
    }
    getRatioById(id) { return this.ratios[id]; }
    setRatioById(id, ratio) {
        this.ratios[id] = ratio;
    }
    getGradientStyle(context2D, target) {
        let obj;
        if (this.dirty || this.ctx != context2D) {
            this.ctx = context2D;
            const x = this.x + this._x;
            const y = this.y + this._y;
            const scaleX = this.scaleX * this._scaleX;
            const scaleY = this.scaleY * this._scaleY;
            const rotation = this.rotation + this._rotation;
            const flareX = this.radialFlareX * this._radialFlareX;
            const flareY = this.radialFlareY * this._radialFlareY;
            const flareStrength = this.radialFlareStrength * this._radialFlareStrength;
            if (this.isLinear) {
                this.initLinearFromRect(x, y, scaleX, scaleY, rotation);
                obj = context2D.createLinearGradient(this.x0, this.y0, this.x1, this.y1);
            }
            else {
                this.initRadialFromRect(x, y, scaleX, scaleY, flareX, flareY, flareStrength);
                obj = context2D.createRadialGradient(this.x0, this.y0, this.r0, this.x1, this.y1, this.r1);
            }
            let i, nb = this.nbStep;
            const ratios = this.ratios;
            const colors = this.colors;
            for (i = 0; i < nb; i++)
                obj.addColorStop(ratios[i], colors[i].style);
            this.style = obj;
            this.dirty = false;
        }
        return this.style;
    }
}
//# sourceMappingURL=GradientColor.js.map