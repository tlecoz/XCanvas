class CssFilter {
    constructor(cssFilterValue = null) {
        this.filter = "";
        this.clear();
        if (cssFilterValue)
            this.filter = cssFilterValue;
    }
    clear() {
        this.filter = "";
        this.offsetX = this.offsetY = 0;
    }
    dropShadow(offsetX, offsetY, radius, color) {
        //offsetX *= this.screenScale;
        //offsetY *= this.screenScale;
        //radius *= this.screenScale;
        this.filter += "drop-shadow(" + offsetX + "px " + offsetY + "px " + radius + "px " + color + ") ";
        //console.log(radius)
        var ox = Math.abs(offsetX) + radius * 4;
        var oy = Math.abs(offsetY) + radius * 4;
        if (this.offsetX < ox)
            this.offsetX = ox;
        if (this.offsetY < oy)
            this.offsetY = oy;
        return this;
    }
    blur(intensity) {
        //intensity *= this.screenScale;
        this.filter += "blur(" + intensity + "px) ";
        intensity *= Math.sqrt(2);
        if (this.offsetX < intensity)
            this.offsetX = intensity;
        if (this.offsetY < intensity)
            this.offsetY = intensity;
        return this;
    }
    halo(intensity, color = "#ffffff") {
        //intensity *= this.screenScale;
        /*this.useHalo = true;
        this.haloColor = color;
        this.haloIntensity = intensity;
        if(this.offsetX < intensity) this.offsetX = intensity;
        if(this.offsetY < intensity) this.offsetY = intensity;*/
        this.dropShadow(0, 0, intensity, color);
        return this;
    }
    brightness(intensity = 0.5) {
        this.filter += "brightness(" + intensity + ") ";
        return this;
    }
    contrast(intensity = 1.5) {
        intensity *= 100;
        this.filter += "contrast(" + intensity + "%) ";
        return this;
    }
    grayscale(intensity = 0.5) {
        intensity *= 100;
        this.filter += "grayscale(" + intensity + "%) ";
        return this;
    }
    hueRotate(angleInDegree = 90) {
        this.filter += "hue-rotate(" + angleInDegree + "deg) ";
        return this;
    }
    invert(intensity = 0.5) {
        intensity *= 100;
        this.filter += "invert(" + intensity + "%) ";
        return this;
    }
    opacity(intensity = 0.5) {
        intensity *= 100;
        this.filter += "opacity(" + intensity + "%) ";
        return this;
    }
    saturate(intensity = 0.5) {
        intensity *= 100;
        this.filter += "saturate(" + intensity + "%) ";
        return this;
    }
    sepia(intensity = 0.5) {
        intensity *= 100;
        this.filter += "sepia(" + intensity + "%) ";
        return this;
    }
}
//# sourceMappingURL=CssFilter.js.map