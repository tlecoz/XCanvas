class BitmapGeometry extends Path {
    constructor(bd, percentOfTheOriginal = 0.055, curveSmooth = 1) {
        super();
        this._outsideBitmap = null;
        this._holeBitmap = null;
        this._outsideVector = null;
        this._holeVector = null;
        this._outsideCurves = null;
        this._holeCurves = null;
        this.bd = bd;
        this.precision = percentOfTheOriginal;
        this.curveSmooth = curveSmooth;
        this.updateBitmapBorders();
    }
    updateBitmapBorders() {
        this.bd.saveData();
        this.bd.setPadding(1, 1, 1, 1);
        this._outsideBitmap = BorderFinder.instance.getBorderFromBitmapData(this.bd);
        this._holeBitmap = BorderFinder.instance.getHoleBorders(this.bd);
        for (var i = 0; i < this._holeBitmap.length; i++)
            this._holeBitmap[i] = this._holeBitmap[i].reverse();
        this.bd.restoreData();
        this.vectorize(this.precision);
        if (this.curveSmooth != 0)
            this.convertLinesToCurves(this.curveSmooth);
    }
    vectorize(percentOfTheOriginal = 0.055) {
        if (percentOfTheOriginal > 1)
            percentOfTheOriginal = 1;
        if (percentOfTheOriginal < 0.0001)
            percentOfTheOriginal = 0.0001;
        var precisionHole = percentOfTheOriginal * 2;
        //console.log("precision = ",percentOfTheOriginal,precisionHole)
        //console.log(this._outsideBitmap.length)
        this._outsideVector = BorderVectorizer.instance.init(this._outsideBitmap.length * percentOfTheOriginal >> 0, this._outsideBitmap);
        console.log("vectorize : wanted ", (this._outsideBitmap.length * percentOfTheOriginal >> 0), " , got ", this._outsideVector.length);
        //console.log("vector = ",this._outsideVector.length+" VS ",this._outsideBitmap.length)
        this._holeVector = [];
        var i, len = this._holeBitmap.length;
        for (i = 0; i < len; i++) {
            this._holeVector[i] = BorderVectorizer.instance.init(this._holeBitmap[i].length * precisionHole >> 0, this._holeBitmap[i]);
        }
        this.updateGeometry();
    }
    convertLinesToCurves(smoothLevel = 1) {
        //smoothLevel => a number between 0.1 and 1000
        if (smoothLevel < 0.1)
            smoothLevel = 0.1;
        if (!this.outsideVector)
            this.vectorize(0.065);
        console.log("vectorLen ", this.outsideVector.length);
        this._outsideCurves = FitCurve.borderToCurve(this.outsideVector, smoothLevel);
        console.log("curveLen ", this._outsideCurves.length);
        console.log("vectorToCurveRatio = ", (this._outsideCurves.length / this.outsideVector.length));
        this._holeCurves = [];
        var i, len = this._holeVector.length;
        var j, nb, k = 0;
        var bezier;
        var points = [];
        for (i = 0; i < len; i++) {
            this._holeCurves[i] = FitCurve.borderToCurve(this._holeVector[i], smoothLevel);
        }
        this.updateGeometry();
    }
    /*
    public triangulateGeometry(shape:Shape2D,updateIfExist:boolean=false):void{
      //console.log("triangulate bitmap")
      var precision:number = this.precision;
      if(!this.trianglePoints || updateIfExist){
        var o:{trianglePoints:number[],
               triangleIndexs:number[],
               minX:number,
               minY:number,
               maxX:number,
               maxY:number} = BitmapGeometryTriangulator.instance.triangulateGeometry(this,precision);
        this.basicHitPoints = [];
        this.trianglePoints = [new Float32Array(o.trianglePoints)];
        this.transTrianglePoints = [new Float32Array(o.trianglePoints)];
        this.triangleIndexs = [new Int32Array(o.triangleIndexs)];
        var hp = [o.minX,o.minY,
                  o.maxX,o.minY,
                  o.minX,o.maxY,
                  o.maxX,o.maxY]
  
        this.basicHitPoints[0] = new Float32Array(hp);
      }
    }
    */
    updateGeometry() {
        //this.beginPath();
        let i, len;
        if (this.outsideCurves) {
            //console.log("updateGeometry - curves")
            this.drawCurves(this.outsideCurves);
            if (this.holeCurves && this.holeCurves.length) {
                len = this.holeCurves.length;
                for (i = 0; i < len; i++)
                    this.drawCurves(this.holeCurves[i]);
            }
        }
        else if (this.outsideVector) {
            //console.log("updateGeometry - vector")
            this.drawLines(this.outsideVector);
            if (this.holeVector && this.holeVector.length) {
                len = this.holeVector.length;
                for (i = 0; i < len; i++)
                    this.drawLines(this.holeVector[i]);
            }
        }
        else {
            //console.log("updateGeometry - bitmapBorder")
            this.drawLines(this.outsideBitmap);
            if (this.holeBitmap && this.holeBitmap.length) {
                len = this.holeBitmap.length;
                for (i = 0; i < len; i++)
                    this.drawLines(this.holeBitmap[i]);
            }
        }
    }
    drawLines(path) {
        if (!path)
            return;
        this.moveTo(path[0].x, path[0].y);
        let i, len = path.length;
        for (i = 1; i < len; i++)
            this.lineTo(path[i].x, path[i].y);
    }
    drawCurves(path) {
        if (!path)
            return;
        let i, len = path.length;
        let bezier;
        for (i = 0; i < len; i++) {
            bezier = path[i];
            if (i == 0)
                this.moveTo(bezier[0][0], bezier[0][1]);
            this.bezierCurveTo(bezier[1][0], bezier[1][1], bezier[2][0], bezier[2][1], bezier[3][0], bezier[3][1]);
        }
    }
    get outsideBitmap() { return this._outsideBitmap; }
    get holeBitmap() { return this._holeBitmap; }
    get outsideVector() { return this._outsideVector; }
    get holeVector() { return this._holeVector; }
    get outsideCurves() { return this._outsideCurves; }
    get holeCurves() { return this._holeCurves; }
}
//# sourceMappingURL=BitmapGeometry.js.map