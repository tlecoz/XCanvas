class Pt2D {
    constructor(x = 0, y = 0, isCurveAnchor = false) {
        this.x = x;
        this.y = y;
        this.isCurveAnchor = isCurveAnchor;
    }
    equals(pt) { return this.x == pt.x && this.y == pt.y; }
    add(pt) { return new Pt2D(this.x + pt.x, this.y + pt.y); }
    ;
    substract(pt) { return new Pt2D(this.x - pt.x, this.y - pt.y); }
    multiply(pt) { return new Pt2D(this.x * pt.x, this.y * pt.y); }
    ;
    divide(pt) { return new Pt2D(this.x / pt.x, this.y / pt.y); }
    ;
    normalize() {
        let max = Math.sqrt(this.dot(this));
        return new Pt2D(this.x / max, this.y / max);
    }
    dot(pt) { return this.x * pt.x + this.y * pt.y; }
    ;
    greaterThan(pt) {
        return this.x > pt.x || this.x == pt.x && this.y > pt.y;
    }
    static distance(a, b) {
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
Pt2D.X = new Pt2D(1, 0);
Pt2D.Y = new Pt2D(0, 1);
Pt2D.ZERO = new Pt2D(0, 0);
//# sourceMappingURL=Pt2D.js.map