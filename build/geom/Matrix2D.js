class Matrix2D extends EventDispatcher {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.xAxis = 0;
        this.yAxis = 0;
        this.rotation = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.width = 1;
        this.height = 1;
        this.offsetW = 0;
        this.offsetH = 0;
        this.savedMatrixs = [];
        this.matrix = new DOMMatrix();
    }
    get dataString() {
        var data = [this.x, this.y, this.xAxis, this.yAxis, this.rotation, this.scaleX, this.scaleY, this.width, this.height, this.offsetW, this.offsetH].join(",");
        data += "#";
        data += [this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e, this.matrix.f].join(",");
        return data;
    }
    static fromDataString(data, target = null) {
        var t = data.split("#");
        var p = t[0].split(",");
        var m = t[1].split(",");
        var o;
        if (!target)
            o = new Matrix2D();
        else
            o = target;
        o.x = Number(p[0]);
        o.y = Number(p[1]);
        o.xAxis = Number(p[2]);
        o.yAxis = Number(p[3]);
        o.rotation = Number(p[4]);
        o.scaleX = Number(p[5]);
        o.scaleY = Number(p[6]);
        o.width = Number(p[7]);
        o.height = Number(p[8]);
        o.offsetW = Number(p[9]);
        o.offsetH = Number(p[10]);
        o.domMatrix.a = Number(m[0]);
        o.domMatrix.b = Number(m[1]);
        o.domMatrix.c = Number(m[2]);
        o.domMatrix.d = Number(m[3]);
        o.domMatrix.e = Number(m[4]);
        o.domMatrix.f = Number(m[5]);
        return o;
    }
    save() {
        let o = this.savedMatrixs, next = null;
        if (o)
            next = o;
        var obj = {
            matrix: this.matrix.toString(),
            next: next
        };
        this.savedMatrixs = obj;
    }
    restore() {
        this.setMatrixValue(this.savedMatrixs.matrix);
        this.savedMatrixs = this.savedMatrixs.next;
    }
    get realWidth() {
        //must be overrided
        return this.width;
    }
    get realHeight() {
        //must be overrided
        return this.height;
    }
    clone() {
        var m = new Matrix2D();
        m.x = this.x;
        m.y = this.y;
        m.rotation = this.rotation;
        m.scaleX = this.scaleX;
        m.scaleY = this.scaleY;
        m.xAxis = this.xAxis;
        m.yAxis = this.yAxis;
        m.width = this.width;
        m.height = this.height;
        m.setMatrixValue(this.matrix.toString());
        return m;
    }
    applyTransform() {
        const m = this.matrix;
        m.translateSelf(this.x, this.y);
        m.rotateSelf(this.rotation);
        m.translateSelf(-this.xAxis * this.scaleX, -this.yAxis * this.scaleY);
        m.scaleSelf(this.width * this.scaleX, this.height * this.scaleY);
        return m;
    }
    setMatrixValue(s = "matrix(1, 0, 0, 1, 0, 0)") { return this.matrix.setMatrixValue(s); }
    translate(x, y) { return this.matrix.translateSelf(x, y); }
    rotate(angle) { return this.matrix.rotateSelf(angle); }
    scale(x, y) { return this.matrix.scaleSelf(x, y); }
    invert() { return this.matrix.invertSelf(); }
    rotateFromVector(x, y) { return this.matrix.rotateFromVectorSelf(x, y); }
    multiply(m) { this.matrix.multiplySelf(m.domMatrix); }
    preMultiply(m) { this.matrix.preMultiplySelf(m.domMatrix); }
    identity() { this.matrix.setMatrixValue("matrix(1, 0, 0, 1, 0, 0)"); }
    get domMatrix() { return this.matrix; }
}
Matrix2D.IDENTITY = new DOMMatrix("matrix(1, 0, 0, 1, 0, 0)");
//# sourceMappingURL=Matrix2D.js.map