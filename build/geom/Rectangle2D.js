class Rectangle2D {
    constructor(minX = 0, minY = 0, maxX = 0, maxY = 0) {
        this.init(minX, minY, maxX, maxY);
    }
    init(minX = 0, minY = 0, maxX = 0, maxY = 0) {
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
        return this;
    }
    get x() { return this.minX; }
    set x(n) { this.minX = n; }
    get y() { return this.minY; }
    set y(n) { this.minY = n; }
    get width() { return this.maxX - this.minX; }
    set width(n) { this.maxX = this.minX + n; }
    get height() { return this.maxY - this.minY; }
    set height(n) { this.maxY = this.minY + n; }
    clear() { this.x = this.y = this.width = this.height = 0; }
    draw(context) {
        context.save();
        context.strokeStyle = "#000000";
        context.rect(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
        context.stroke();
        context.restore();
    }
}
//# sourceMappingURL=Rectangle2D.js.map