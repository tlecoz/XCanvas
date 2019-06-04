class Path extends RegisterableObject {
    constructor(pathData = null) {
        super();
        this.bounds = { x: 0, y: 0, w: 0, h: 0 };
        this._path = new Path2D();
        if (!pathData)
            this.datas = [];
        else {
            this.datas = pathData;
            this.computePath();
        }
    }
    get dataString() { return this.datas.join(","); }
    static fromDataString(data) {
        var t = data.split(",");
        var t2 = [];
        let i, len = t.length;
        for (i = 0; i < len; i++)
            t2[i] = Number(t[i]);
        return new Path(t2);
    }
    newPath() {
        this._path = new Path2D();
        return this._path;
    }
    isPointInPath(context, px, py, fillrule = "nonzero") {
        return context.isPointInPath(this.path, px, py, fillrule);
    }
    isPointInStroke(context, px, py) {
        return context.isPointInStroke(this.path, px, py);
    }
    isPointInside(context, px, py, isStroke, fillrule = "nonzero") {
        if (isStroke)
            return context.isPointInStroke(this.path, px, py);
        return context.isPointInPath(this.path, px, py, fillrule);
    }
    get originalW() { return this._originalW; }
    get originalH() { return this._originalH; }
    get originalX() { return this._originalX; }
    get originalY() { return this._originalY; }
    moveTo(x, y) { this.datas.push(0, x, y); } //0
    lineTo(x, y) { this.datas.push(1, x, y); } //1
    circle(x, y, radius) {
        //console.log(x,y,radius);
        this.arc(x, y, radius);
    } //2
    quadraticCurveTo(ax, ay, x, y) { this.datas.push(3, ax, ay, x, y); } //3
    rect(x, y, w, h) { this.datas.push(4, x, y, w, h); } //4
    arc(x, y, radius, startAngle = 0, endAngle = Math.PI * 2) {
        //console.log(5,x,y,radius,startAngle,endAngle)
        this.datas.push(5, x, y, radius, startAngle, endAngle);
    } //5
    arcTo(x0, y0, x1, y1, radius) { this.datas.push(6, x0, y0, x1, y1, radius); } //6
    bezierCurveTo(ax0, ay0, ax1, ay1, x1, y1) { this.datas.push(7, ax0, ay0, ax1, ay1, x1, y1); } //7
    static moveTo(path, datas, i) {
        path.moveTo(datas[i + 1], datas[i + 2]);
    }
    static lineTo(path, datas, i) {
        path.lineTo(datas[i + 1], datas[i + 2]);
    }
    static circle(path, datas, i) {
        path.arc(datas[i + 1], datas[i + 2], datas[i + 3], 0, Math.PI * 2);
    }
    static rect(path, datas, i) {
        path.rect(datas[i + 1], datas[i + 2], datas[i + 3], datas[i + 4]);
    }
    static quadraticCurveTo(path, datas, i) {
        path.quadraticCurveTo(datas[i + 1], datas[i + 2], datas[i + 3], datas[i + 4]);
    }
    static arc(path, datas, i) {
        //console.log(datas[i+1],datas[i+2],datas[i+3],datas[i+4],datas[i+5])
        path.arc(datas[i + 1], datas[i + 2], datas[i + 3], datas[i + 4], datas[i + 5]);
    }
    static arcTo(path, datas, i) {
        path.arc(datas[i + 1], datas[i + 2], datas[i + 3], datas[i + 4], datas[i + 5]);
    }
    static bezierCurveTo(path, datas, i) {
        //console.log("bezierCurveTo ",datas[i+1],datas[i+2],datas[i+3],datas[i+4],datas[i+5],datas[i+6])
        path.bezierCurveTo(datas[i + 1], datas[i + 2], datas[i + 3], datas[i + 4], datas[i + 5], datas[i + 6]);
    }
    get path() { return this._path; }
    get geometry() { return this._geom; }
    get pathDatas() { return this.datas; }
    computePath() {
        let i, j, type, minX = 9999999, minY = 9999999, maxX = -9999999, maxY = -9999999;
        let a, b, c, d, e, f;
        let nb, start, val;
        let datas = this.datas;
        let func;
        let count, countOffset;
        let useRadius;
        let minRadius = 9999999, maxRadius = -999999;
        let NB = 0;
        let o;
        const len = datas.length;
        const objByType = Path.objByType;
        //const normalizeData:number[] = datas.concat();
        //datas = normalizeData;
        for (i = 0; i < len; i += (count + 1)) {
            type = datas[i];
            o = objByType[type];
            //console.log(i," type = ",type )
            count = o.count; //countByType[type];
            countOffset = o.countOffset;
            useRadius = o.useRadius;
            start = i + 1;
            nb = count - countOffset;
            nb += start;
            if (useRadius)
                nb--;
            for (j = start; j < nb; j++) {
                val = datas[j];
                if (val < minX)
                    minX = val;
                if (val < minY)
                    minY = val;
                if (val > maxX)
                    maxX = val;
                if (val > maxY)
                    maxY = val;
            }
            if (useRadius) {
                val = datas[nb];
                if (val < minRadius)
                    minRadius = val;
                if (val > maxRadius)
                    maxRadius = val;
            }
        }
        //if(useRadius) nb++
        let dx = maxX - minX;
        let dy = maxY - minY;
        let distRadius = 0;
        if (useRadius) {
            dx = 1; //minRadius;
            dy = 1; //minRadius;
            minX = minY = 0;
            distRadius = 1 + maxRadius - minRadius;
        }
        this._originalW = Math.abs(dx);
        this._originalH = Math.abs(dy);
        this._originalX = minX;
        this._originalY = minY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        //console.log("distRadius => ",distRadius+" = "+maxRadius+" - "+minRadius)
        const path = this._path;
        let startXY, endXY;
        let isXY;
        for (i = 0; i < len; i += (count + 1)) {
            type = datas[i];
            o = objByType[type];
            func = o.func; //funcByType[type];
            count = o.count; //countByType[type];
            countOffset = o.countOffset;
            useRadius = o.useRadius;
            endXY = o.endXY;
            start = i + 1;
            nb = start + count - countOffset;
            //console.log(datas);
            //console.log(minX,minY,dx,dy);
            if (useRadius)
                nb--;
            for (j = start; j < nb; j++) {
                val = datas[j];
                isXY = j < endXY;
                if (j % 2 == 0) {
                    val -= minX;
                    val /= dx;
                }
                else {
                    val -= minY;
                    val /= dy;
                }
                //console.log("datas["+j+"] = ",val);
                datas[j] = val;
            }
            if (useRadius) {
                val = datas[nb];
                //val -= minRadius;
                //val /= (distRadius);
                //console.log("val ",nb," = ",val)
                datas[nb] = val;
                //console.log("datas["+nb+"] = ",val+" ### "+distRadius);
            }
            func(path, datas, start - 1);
        }
        console.log(this.datas);
        this._geom = new Geometry(this);
        return this._geom;
    }
}
Path.objByType = [
    { func: Path.moveTo, count: 2, endXY: 3, countOffset: 0, useRadius: false },
    { func: Path.lineTo, count: 2, endXY: 3, countOffset: 0, useRadius: false },
    { func: Path.arc, count: 3, endXY: 3, countOffset: 0, useRadius: true },
    { func: Path.quadraticCurveTo, count: 4, endXY: 5, countOffset: 0, useRadius: false },
    { func: Path.rect, count: 4, endXY: 3, countOffset: 0, useRadius: false },
    { func: Path.arc, count: 5, endXY: 3, countOffset: 2, useRadius: true },
    { func: Path.arcTo, count: 2, endXY: 3, countOffset: 2, useRadius: true },
    { func: Path.bezierCurveTo, count: 6, endXY: 7, countOffset: 0, useRadius: false }
];
//# sourceMappingURL=Path.js.map