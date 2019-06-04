class BorderPt extends Pt2D {

  public id:number;
  public dist:number;
  public next:BorderPt;
  public prev:BorderPt;
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
  constructor(x:number,y:number,id:number){
    super(x,y);
    this.id = id;
  }
  public clone():BorderPt{
    return new BorderPt(this.x,this.y,this.id);
  }
  public distanceTo(pt:BorderPt):number{
    var dx:number = pt.x - this.x;
		var dy:number = pt.y - this.y;
		return Math.sqrt(dx * dx + dy * dy);
  }
  public distance(px:number,py:number):number {
			var dx:number = px - this.x;
			var dy:number = py - this.y;
			return Math.sqrt(dx * dx + dy * dy);
	}
  public angleTo(pt:BorderPt):number {
		var dx:number = pt.x - this.x;
		var dy:number = pt.y - this.y;
		return Math.atan2(dy, dx);
	}
}
