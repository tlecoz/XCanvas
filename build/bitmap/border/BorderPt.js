class BorderPt extends Pt2D {
    /*
    public id2:number;
    public dist2:number;
    public dist3:number;
    public dist4:number;
    public nextAngle:number;
    public prevAngle:number;
    public pt:any;
  
    public isQuadPoint:boolean=false;
    public quad:BorderPt[];
    public quadId:number;
    */
    constructor(x, y, id) {
        super(x, y);
        this.id = id;
    }
    clone() {
        return new BorderPt(this.x, this.y, this.id);
    }
    distanceTo(pt) {
        var dx = pt.x - this.x;
        var dy = pt.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    distance(px, py) {
        var dx = px - this.x;
        var dy = py - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    angleTo(pt) {
        var dx = pt.x - this.x;
        var dy = pt.y - this.y;
        return Math.atan2(dy, dx);
    }
}
//# sourceMappingURL=BorderPt.js.map