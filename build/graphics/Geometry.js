class Geometry {
    constructor(path = null) {
        this._nbShape = 0;
        this._nbBoundPoint = 0;
        this.bounds = new Rectangle2D();
        if (path)
            this.getPoints(path.pathDatas);
    }
    get trianglePoints() { return this._boundPoints; }
    get triangleIndexs() { return this._indexs; }
    getBounds(target, offsetW, offsetH) {
        let p = this.firstPoint;
        let trans;
        let tx, ty;
        let minX = 99999999;
        let minY = 99999999;
        let maxX = -99999999;
        let maxY = -99999999;
        let m = target.domMatrix;
        let ox = offsetW;
        let oy = offsetH;
        while (p) {
            trans = m.transformPoint(p);
            tx = trans.x;
            ty = trans.y;
            if (tx < minX)
                minX = tx;
            if (tx > maxX)
                maxX = tx;
            if (ty < minY)
                minY = ty;
            if (ty > maxY)
                maxY = ty;
            p = p.next;
        }
        return target.bounds.init(minX - ox, minY - oy, maxX + ox, maxY + oy);
    }
    getPoints(pathDatas) {
        this._boundPoints = [];
        this._shapeXYs = [];
        this._shapeBounds = [];
        this.oldX = 0;
        this.oldY = 0;
        let i = 0, len = pathDatas.length, NB, count, type, start;
        let o;
        while (i < len) {
            type = pathDatas[i++];
            switch (type) {
                case 0: //moveTo
                    this.moveTo(pathDatas[i++], pathDatas[i++]);
                    break;
                case 1: //lineTo
                    this.lineTo(pathDatas[i++], pathDatas[i++]);
                    break;
                case 2: //circle
                    this.circle(pathDatas[i++], pathDatas[i++], pathDatas[i++]);
                    break;
                case 3: //quadraticCurveTo
                    this.quadraticCurveTo(pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++]);
                    break;
                case 4: //rect
                    this.rect(pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++]);
                    break;
                case 5: //arc
                    this.arc(pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++]);
                    break;
                case 6: //arcTo
                    this.arcTo(pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++]);
                    break;
                case 7: //bezierCurveTo
                    this.bezierCurveTo(pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++]);
                    break;
            }
        }
    }
    triangulate() {
        this._indexs = [];
        this.endProcess();
        this._indexs = [];
        var i, len = this._nbShape;
        for (i = 0; i < len; i++)
            this._indexs[i] = EarCutting.instance.computeTriangles(this._shapeXYs[i]);
    }
    endProcess() {
        if (this._nbShape != 0) {
            let o;
            this._shapeBounds[this._nbShape - 1] = o = { minX: this.minX, minY: this.minY, maxX: this.maxX, maxY: this.maxY };
        }
    }
    defineNewShape() {
        this.endProcess();
        this.oldX = 0;
        this.oldY = 0;
        this._shapePoints = [];
        this._shapeXY = [];
        this._boundPoints[this._nbShape] = this._shapePoints;
        this._shapeXYs[this._nbShape] = this._shapeXY;
        this._nbShape++;
        //console.log(this._nbShape)
        this._nbBoundPoint = 0;
    }
    registerPoint(px, py) {
        if (px < this.minX)
            this.minX = px;
        if (px > this.maxX)
            this.maxX = px;
        if (py < this.minY)
            this.minY = py;
        if (py > this.maxY)
            this.maxY = py;
        this.oldX = px;
        this.oldY = py;
        var p = this.lastPoint;
        this._shapeXY.push(px, py);
        this._shapePoints[this._nbBoundPoint++] = this.lastPoint = new DOMPoint(px, py, 0, 1);
        if (p)
            p.next = this.lastPoint;
        this.lastPoint.prev = p;
        if (!this.firstPoint)
            this.firstPoint = this.lastPoint;
    }
    moveTo(px, py) {
        this.defineNewShape();
        this.registerPoint(px, py);
    }
    lineTo(px, py) {
        this.registerPoint(px, py);
    }
    arcTo(x1, y1, x2, y2, radius) {
        var x0 = this.oldX;
        var y0 = this.oldY;
        let dx = x1 - x0;
        let dy = y1 - y0;
        let d = Math.sqrt(dx * dx + dy * dy) - radius;
        let a = Math.atan2(dy, dx);
        let _x0 = x0 + Math.cos(a) * d;
        let _y0 = y0 + Math.sin(a) * d;
        dx = x2 - x1;
        dy = y2 - y1;
        a = Math.atan2(dy, dx);
        let _x1 = x1 + Math.cos(a) * radius;
        let _y1 = y1 + Math.sin(a) * radius;
        this.quadraticCurveTo(x1, y1, _x1, _y1);
    }
    arc(px, py, radius, startAngle, endAngle) {
        this.defineNewShape();
        let da = Math.abs(endAngle - startAngle);
        let pi4 = Math.PI / 8;
        this.registerPoint(px + Math.cos(startAngle) * radius, py + Math.sin(startAngle) * radius);
        let n = 0;
        while (n + pi4 < da) {
            n += pi4;
            this.registerPoint(px + Math.cos(startAngle + n) * radius, py + Math.sin(startAngle + n) * radius);
        }
        this.registerPoint(px + Math.cos(startAngle + da) * radius, py + Math.sin(startAngle + da) * radius);
    }
    circle(px, py, radius) {
        this.arc(px, py, radius, 0, Math.PI * 2);
    }
    rect(x, y, w, h) {
        this.defineNewShape();
        this.registerPoint(x, y);
        this.registerPoint(x + w, y);
        this.registerPoint(x + w, y + h);
        this.registerPoint(x, y + h);
    }
    getQuadraticCurveLength(ax, ay, x1, y1) {
        var x0 = this.oldX;
        var y0 = this.oldY;
        let ox = x0;
        let oy = y0;
        let dx, dy, d = 0;
        let dist = 0;
        let i, nb = 10;
        let px, py, t;
        for (i = 1; i < nb; i++) {
            t = i / nb;
            px = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * ax + t * t * x1;
            py = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * ay + t * t * y1;
            dx = px - ox;
            dy = py - oy;
            dist += Math.sqrt(dx * dx + dy * dy);
            ox = px;
            oy = py;
        }
        dx = x1 - ox;
        dy = y1 - oy;
        dist += Math.sqrt(dx * dx + dy * dy);
        return dist;
    }
    quadraticCurveTo(ax, ay, x1, y1) {
        var x0 = this.oldX;
        var y0 = this.oldY;
        let n = Math.ceil(this.getQuadraticCurveLength(ax, ay, x1, y1) / Geometry.curvePointDistance);
        let i, nb = Math.max(Math.min(n, Geometry.curvePointMax), 4); //GraphicGeometryTriangulator.curvePointMax;
        let px, py, t;
        for (i = 1; i <= nb; i++) {
            t = i / nb;
            px = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * ax + t * t * x1;
            py = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * ay + t * t * y1;
            this.registerPoint(px, py);
        }
    }
    getBezierCurveLength(ax0, ay0, ax1, ay1, x1, y1) {
        var x0 = this.oldX;
        var y0 = this.oldY;
        let i, nb = 5;
        let px, py, t, cX, bX, aX, cY, bY, aY;
        let ox = x0;
        let oy = y0;
        let dx, dy, d = 0;
        let dist = 0;
        for (i = 1; i < nb; i++) {
            t = i / nb;
            cX = 3 * (ax0 - x0);
            bX = 3 * (ax1 - ax0) - cX;
            aX = x1 - x0 - cX - bX;
            cY = 3 * (ay0 - y0);
            bY = 3 * (ay1 - ay0) - cY;
            aY = y1 - y0 - cY - bY;
            px = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + x0;
            py = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + y0;
            dx = px - ox;
            dy = py - oy;
            d += Math.sqrt(dx * dx + dy * dy);
            ox = px;
            oy = py;
        }
        dx = x1 - ox;
        dy = y1 - oy;
        d += Math.sqrt(dx * dx + dy * dy);
        return d;
    }
    bezierCurveTo(ax0, ay0, ax1, ay1, x1, y1) {
        var x0 = this.oldX;
        var y0 = this.oldY;
        var n = Math.ceil(this.getBezierCurveLength(ax0, ay0, ax1, ay1, x1, y1) / Geometry.curvePointDistance);
        var i, nb = n; //Math.max(Math.min(n,GraphicGeometryTriangulator.curvePointMax),5)//GraphicGeometryTriangulator.curvePointMax;
        var px, py, t, cX, bX, aX, cY, bY, aY;
        for (i = 1; i <= nb; i++) {
            t = i / nb;
            cX = 3 * (ax0 - x0);
            bX = 3 * (ax1 - ax0) - cX;
            aX = x1 - x0 - cX - bX;
            cY = 3 * (ay0 - y0);
            bY = 3 * (ay1 - ay0) - cY;
            aY = y1 - y0 - cY - bY;
            px = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + x0;
            py = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + y0;
            this.registerPoint(px, py);
        }
    }
}
Geometry.curvePointMax = 5;
Geometry.curvePointDistance = 10;
//# sourceMappingURL=Geometry.js.map