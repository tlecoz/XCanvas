class BorderVectorizer {

  private static _instance:BorderVectorizer;

  private sourcePoints:BorderPt[];
  private firstPt:BorderPt;
  private scale:number;
  private nbPointMax:number;

  public points:BorderPt[];
  public width:number;
  public height:number;
  public minX:number;
  public minY:number;

  constructor(){
    if(BorderVectorizer._instance){
      throw new Error("You must use BorderVectorizer.instance")
    }
    BorderVectorizer._instance = this;
  }

  public static get instance():BorderVectorizer{
    if(!BorderVectorizer._instance) new BorderVectorizer();
    return BorderVectorizer._instance;
  }

  public init(maxPointWanted:number,borderPoints:BorderPt[]):BorderPt[]{
    this.sourcePoints = borderPoints;
    this.nbPointMax = maxPointWanted;
    this.points = borderPoints.concat();
    this.firstPt = borderPoints[0];

    this.process();

    return this.points;
  }






  public removeNearestPoints(a:number){
    var i:number;
    var v:BorderPt[] = this.points;
    //console.log("before => ",v.length);

    v.push(v[0]);
    v.push(v[1]);

    var limitAngle:number = Math.PI/180 * a;
    var a1:number, a2:number;
		var p0:BorderPt, p1:BorderPt, p2:BorderPt;
		var p0x:number, p0y:number, p1x:number, p1y:number, p2x:number, p2y:number;
		var dx:number,dy:number

    for (i = 2; i < v.length; i++) {

			p0x = v[i - 1].x;
			p0y = v[i - 1].y;

			p1x = v[i].x;
			p1y = v[i].y;

			dx = p0x - p1x;
			dy = p1y - p1y;

			a1 = Math.atan2(dy, dx);

			dx = v[i - 2].x - p0x;
			dy = v[i - 2].y - p0y;

			a2 = Math.atan2(dy, dx);

			if ( a1-a2 < limitAngle ) {
				v.splice(i, 1);
			}

		}
		v.pop();
		//console.log("after = " + v.length);
		this.points = v;
  }

  public process(){
    //by default, the process apply a very strong optimization of the path.
			//I wrote that class to convert a pixel-path made of hundreds/thousands of pixels
			//into the minimal amount of point possible with approximatly the same shape

			//I did it to convert a custom-pixel-shape into Box2D-polygon

      //console.log("NB POINT BEFORE OPTIMISATION : "+this.points.length+"      ---  nbWanted = "+this.nbPointMax);



      var startLen:number = this.points.length;
			var len:number = this.points.length;
			var count:number = 1;
			var maxPoint:number = this.nbPointMax;// * 1.35;// int(points.length / 40);
			var num:number = 0;
			var b:boolean = false;
			var numIncrement:number = 1 //+ (0.5 +numPass/20) / 5;
      var oldLen:number = -1;

      var o12:BorderLinePt = new BorderLinePt();
      var o23:BorderLinePt = new BorderLinePt();
      var o31:BorderLinePt = new BorderLinePt();
      var linePoints:BorderLinePt[] = [];
      linePoints[0] = o12;
      linePoints[1] = o23;
      linePoints[2] = o31;
      var points:BorderPt[] = this.points;
			while(len > maxPoint ){
				num+=numIncrement;



				if(len > maxPoint) {

          o12.reset();
          o23.reset();
          o31.reset();
          let limit = num;
          let maxRemove = len - maxPoint;
          let dx:number,dy:number;
    			let i:number;
    			let p1:BorderPt, p2:BorderPt, p3:BorderPt;






    			let center:BorderPt, opposite:BorderPt;
    			let oppositeId:number;
          let opposites:{d:number,id:number}[] = [];
    			let o1x:number,o1y:number,o2x:number,o2y:number,o3x:number,o3y:number,a:number,d:number;


          let hypothenus:BorderLinePt
    			let multi:number;
          let nbRemove:number = 0;
          let k:number = 0;

    			for (i = 2; i < points.length-1; i+=2) {
    				p1 = points[i - 2];
    				p2 = points[i - 1];
    				p3 = points[i];

    				o1x = p1.x;
    				o1y = p1.y;
    				o2x = p2.x;
    				o2y = p2.y;
    				o3x = p3.x;
    				o3y = p3.y;


    				multi = 100000; //used to maximize the chance to have 3 different distance for the Collection.sort;

    				o12.id = i - 2;
    				o12.p1 = p1;
    				o12.p2 = p2;
    				dx = p1.x - p2.x;
    				dy = p1.y - p2.y;
    				o12.d = ( Math.sqrt(dx*dx+dy*dy) * multi)>>0;
    				o12.a = Math.atan2(dy,dx);

    				o23.id = i - 1;
    				o23.p1 = p2;
    				o23.p2 = p3;
    				dx = p2.x - p3.x;
    				dy = p2.y - p3.y;
    				o23.d = ( Math.sqrt(dx*dx+dy*dy) * multi)>>0;
    				o23.a = Math.atan2(dy,dx);

    				o31.id = i;
    				o31.p1 = p3;
    				o31.p2 = p1;
    				dx = p3.x - p1.x;
    				dy = p3.y - p1.y;
    				o31.d = ( Math.sqrt(dx*dx+dy*dy)*multi)>>0;
    				o31.a = Math.atan2(dy,dx);

            linePoints = linePoints.sort(this.sortDist);
    				hypothenus = linePoints[2];
    				center = hypothenus.p1;
    				opposite = linePoints[0].p1;
    				oppositeId = linePoints[0].id;
    				if (opposite == hypothenus.p2) {
    					opposite = linePoints[1].p1;
    					oppositeId = linePoints[1].id;
    				}

    				dx = center.x - opposite.x;
    				dy = center.y - opposite.y;
    				a =  Math.atan2(dy,dx);
    				d = Math.sqrt(dx*dx+dy*dy);

    				opposite.x = (center.x + Math.cos(-hypothenus.a + a) * d) >> 0; // val >> 0 == int(val)
    				opposite.y = (center.y + Math.sin(-hypothenus.a + a) * d) >> 0;

    				dy = Math.abs(opposite.y - center.y);

    				p1.x = o1x >> 0; //val >> 0 == int(val)
    				p1.y = o1y >> 0;
    				p2.x = o2x >> 0;
    				p2.y = o2y >> 0;
    				p3.x = o3x >> 0;
    				p3.y = o3y >> 0;


    				if (dy < limit) opposites[k++] = {d:dy,id:oppositeId}

    			}


          if(opposites.length > maxRemove){
            //console.log("aaaaaaaaaaaaa")
            opposites = opposites.sort(this.sortDist);
             opposites = opposites.slice(0,maxRemove);
          }
          opposites = opposites.sort(this.sortId);

          for(i=opposites.length-1;i>=0;i--){
            oppositeId = opposites[i].id;
            this.points.splice(oppositeId, 1);
          }

          //this.removeNearLine2(num,len-maxPoint);
				}
        oldLen = len;
        len = this.points.length;
        if(oldLen == len) count++;

			}


      //console.log("num = ",num,maxPoint)

			//console.log(this.nbPointMax, "wanted | NB POINT AFTER OPTIMISATION : "+this.points.length+" ( "+((this.points.length / startLen)*100.0)+" % of the original )");
  }

  protected getBackOriginalScale():void{
			this.minX = 100000;
			var maxX:number = 0;
			this.minY = 100000;
			var maxY:number = 0;
			var i:number,k:number=0,len:number = this.sourcePoints.length;

			var point:BorderPt;
			for(i=0;i<len;i++){
				point = this.sourcePoints[i];
				if(this.sourcePoints[i] == null) continue;
				point.x /= this.scale;
				point.y /= this.scale;
			}

			if (this.points[0] == this.points[this.points.length - 1]) len--;

			len = this.points.length;
			var temp:BorderPt[] = [];

			for (i = 0; i < len; i++) {
				if(this.points[i] == null) continue;

				point = this.points[i];
				temp[k++] = new BorderPt(point.x,point.y,0);
				if (point.x < this.minX) this.minX = point.x;
				if (point.y < this.minY) this.minY = point.y;
				if (point.x > maxX) maxX = point.x;
				if (point.y > maxY) maxY = point.y;
			}

			this.width = maxX - this.minX;
			this.height = maxY - this.minY;

			var temp2:BorderPt[] = temp.concat();
			temp2[k-1] = this.firstPt;
			this.points = temp2;
		}
    protected rescaleBorderBeforeSimplificationIfPictureIsTooSmall(forceScale:number=0):void{
			var _minX:number = 100000, _maxX:number = 0;
			var _minY:number = 100000, _maxY:number = 0;
			var i:number;
			var len:number = this.points.length;
			var point:BorderPt;
			for (i = 0; i < len; i++) {
				point = this.points[i];
				if (point.x < _minX) _minX = point.x;
				if (point.y < _minY) _minY = point.y;
				if (point.x > _maxX) _maxX = point.x;
				if (point.y > _maxY) _maxY = point.y;
			}

			var w:number = _maxX - _minX;
			var h:number = _maxY - _minY;
			var wh:number = w * h;

			if(!forceScale) this.scale = ((1000.0*1000.0) / wh) ;
      else this.scale = forceScale;

			for (i = 0; i < this.points.length; i++) {
				this.points[i].x *= this.scale;
				this.points[i].y *= this.scale;
			}

		}

    public removeSmallLines(minDist:number, direction:boolean,maxRemove:number=9999):BorderPt[]{

			var temp:BorderPt[] = [];
			var i:number,k:number = 0,len:number = this.points.length;

			if(direction) temp[k++] = this.points[0];
			else temp[k++] = this.points[this.points.length-1];

			var p0:BorderPt,p1:BorderPt;
			var dx:number,dy:number,d:number;
			var oldDist:number = 0;

			if(direction == true){

				for(i=1;i<len;i++){

					p0 = this.points[i-1];
					p1 = this.points[i];

					dx = p0.x - p1.x;
					dy = p0.y - p1.y;
					d = Math.sqrt(dx*dx+dy*dy);

					if(oldDist + d > minDist || k>= maxRemove){

						temp[k++] = p1;
						oldDist = (oldDist + d - minDist) % minDist;

					}else{
						oldDist += d;
						/*if (p1.isQuadPoint) {
							p1.isQuadPoint = false;
							p0.isQuadPoint = true;
							p0.quad = p1.quad;
							p0.quad[p1.quadId] = p0;
						}*/
					}

				}

			} else {

				for(i=len-2;i>-1;i--){

					p0 = this.points[i+1];
					p1 = this.points[i];

					dx = p0.x - p1.x;
					dy = p0.y - p1.y;
					d = Math.sqrt(dx*dx+dy*dy);

					if(oldDist + d > minDist || k>= maxRemove){
						temp[k++] = p1;
						oldDist = (oldDist + d - minDist) % minDist;
					}else{
						oldDist += d;
						/*if (p1.isQuadPoint) {
							p1.isQuadPoint = false;
							p0.isQuadPoint = true;
							p0.quad = p1.quad;
							p0.quad[p1.quadId] = p0;
						}*/
					}

				}
			}

			this.points = temp;
			return temp;
		}

    public removeNearLine(limit:number,maxRemove:number=9999):BorderPt[] {

			//it does almost the same thing than the function "simplify"
			//but because it's not based on the "direction-datas" given by the BorderFinder class
			//it's possible to apply with multiple pass and get better results


			//For example, if I have 3 following points of a path like that
			//
			//  0
			//               1
			//
			//
			//                  2


			//the algo loop on every points and create a virtual 4th point at the center of the hypothenus, like that
			//
			//  0
			//               1
			//          4
			//
			//                  2


			//then it will compute the distance between 4 and 1
			//if the distance is smaller than the variable "limit"
			//I remove the point 1 (the point 4 is just an abstraction, it is never added to the point-list


			var dx:number,dy:number;
			var i:number;
			var p1:BorderPt, p2:BorderPt, p3:BorderPt;
			var o12:BorderLinePt = new BorderLinePt();
			var o23:BorderLinePt = new BorderLinePt();
			var o31:BorderLinePt = new BorderLinePt();

			var center:BorderPt, opposite:BorderPt;
			var oppositeId:number;

			var o1x:number,o1y:number,o2x:number,o2y:number,o3x:number,o3y:number;

			var linePoints:BorderLinePt[] = [];
			linePoints[0] = o12;
			linePoints[1] = o23;
			linePoints[2] = o31;

			var multi:number;
      var nbRemove:number = 0;
			for (i = 2; i < this.points.length-1; i+=2) {
				p1 = this.points[i - 2];
				p2 = this.points[i - 1];
				p3 = this.points[i];

				o1x = p1.x;
				o1y = p1.y;
				o2x = p2.x;
				o2y = p2.y;
				o3x = p3.x;
				o3y = p3.y;


				multi = 100000; //used to maximize the chance to have 3 different distance for the Collection.sort;

				o12.id = i - 2;
				o12.p1 = p1;
				o12.p2 = p2;
				dx = p1.x - p2.x;
				dy = p1.y - p2.y;
				o12.d = ( Math.sqrt(dx*dx+dy*dy) * multi)>>0;
				o12.a = Math.atan2(dy,dx);

				o23.id = i - 1;
				o23.p1 = p2;
				o23.p2 = p3;
				dx = p2.x - p3.x;
				dy = p2.y - p3.y;
				o23.d = ( Math.sqrt(dx*dx+dy*dy) * multi)>>0;
				o23.a = Math.atan2(dy,dx);

				o31.id = i;
				o31.p1 = p3;
				o31.p2 = p1;
				dx = p3.x - p1.x;
				dy = p3.y - p1.y;
				o31.d = ( Math.sqrt(dx*dx+dy*dy)*multi)>>0;
				o31.a = Math.atan2(dy,dx);


				//linePoints.sortOn("d", Array.NUMERIC);

        function sortFunc(a:BorderLinePt,b:BorderLinePt):number{
          if(a.d > b.d) return 1;
          if(a.d < b.d) return -1;
          return 0;
        }

        linePoints = linePoints.sort(sortFunc);

				var hypothenus:BorderLinePt = linePoints[2];
				center = hypothenus.p1;

				opposite = linePoints[0].p1;
				oppositeId = linePoints[0].id;
				if (opposite == hypothenus.p2) {
					opposite = linePoints[1].p1;
					oppositeId = linePoints[1].id;
				}

				dx = center.x - opposite.x;
				dy = center.y - opposite.y;
				var a:number =  Math.atan2(dy,dx);
				var d:number = Math.sqrt(dx*dx+dy*dy);

				opposite.x = (center.x + Math.cos(-hypothenus.a + a) * d) >> 0; // val >> 0 == int(val)
				opposite.y = (center.y + Math.sin(-hypothenus.a + a) * d) >> 0;

				dy = Math.abs(opposite.y - center.y);

				p1.x = o1x >> 0; //val >> 0 == int(val)
				p1.y = o1y >> 0;
				p2.x = o2x >> 0;
				p2.y = o2y >> 0;
				p3.x = o3x >> 0;
				p3.y = o3y >> 0;


				if (dy < limit) {
					this.points.splice(oppositeId, 1);


					var p:BorderPt = this.points[oppositeId]
					/*if (p.isQuadPoint == true) {
						p.isQuadPoint = false;

						hypothenus.p2.isQuadPoint = true;
						hypothenus.p2.quad = p.quad;
						hypothenus.p2.quad[p.quadId] = p1;

					}*/

          nbRemove++;
          if(nbRemove == maxRemove) break;
				}

			}

			return this.points;
		}

    private sortDist(a:BorderLinePt,b:BorderLinePt):number{
      if(a.d > b.d) return 1;
      if(a.d < b.d) return -1;
      return 0;
    }
    private sortId(a:BorderLinePt,b:BorderLinePt):number{
      if(a.id > b.id) return 1;
      if(a.id < b.id) return -1;
      return 0;
    }

    public removeNearLine2(limit:number,maxRemove:number=9999):BorderPt[] {

			//it does almost the same thing than the function "simplify"
			//but because it's not based on the "direction-datas" given by the BorderFinder class
			//it's possible to apply with multiple pass and get better results


			//For example, if I have 3 following points of a path like that
			//
			//  0
			//               1
			//
			//
			//                  2


			//the algo loop on every points and create a virtual 4th point at the center of the hypothenus, like that
			//
			//  0
			//               1
			//          4
			//
			//                  2


			//then it will compute the distance between 4 and 1
			//if the distance is smaller than the variable "limit"
			//I remove the point 1 (the point 4 is just an abstraction, it is never added to the point-list
      /*function sortDist(a:BorderLinePt,b:BorderLinePt):number{
        if(a.d > b.d) return 1;
        if(a.d < b.d) return -1;
        return 0;
      }
      function sortId(a:BorderLinePt,b:BorderLinePt):number{
        if(a.id > b.id) return 1;
        if(a.id < b.id) return -1;
        return 0;
      }*/

			var dx:number,dy:number;
			var i:number;
			var p1:BorderPt, p2:BorderPt, p3:BorderPt;
			var o12:BorderLinePt = new BorderLinePt();
			var o23:BorderLinePt = new BorderLinePt();
			var o31:BorderLinePt = new BorderLinePt();

			var center:BorderPt, opposite:BorderPt;
			var oppositeId:number;
      var opposites:{d:number,id:number}[] = [];
			var o1x:number,o1y:number,o2x:number,o2y:number,o3x:number,o3y:number;

			var linePoints:BorderLinePt[] = [];
			linePoints[0] = o12;
			linePoints[1] = o23;
			linePoints[2] = o31;

			var multi:number;
      var nbRemove:number = 0;
      var k:number = 0;
			for (i = 2; i < this.points.length-1; i+=2) {
				p1 = this.points[i - 2];
				p2 = this.points[i - 1];
				p3 = this.points[i];

				o1x = p1.x;
				o1y = p1.y;
				o2x = p2.x;
				o2y = p2.y;
				o3x = p3.x;
				o3y = p3.y;


				multi = 100000; //used to maximize the chance to have 3 different distance for the Collection.sort;

				o12.id = i - 2;
				o12.p1 = p1;
				o12.p2 = p2;
				dx = p1.x - p2.x;
				dy = p1.y - p2.y;
				o12.d = ( Math.sqrt(dx*dx+dy*dy) * multi)>>0;
				o12.a = Math.atan2(dy,dx);

				o23.id = i - 1;
				o23.p1 = p2;
				o23.p2 = p3;
				dx = p2.x - p3.x;
				dy = p2.y - p3.y;
				o23.d = ( Math.sqrt(dx*dx+dy*dy) * multi)>>0;
				o23.a = Math.atan2(dy,dx);

				o31.id = i;
				o31.p1 = p3;
				o31.p2 = p1;
				dx = p3.x - p1.x;
				dy = p3.y - p1.y;
				o31.d = ( Math.sqrt(dx*dx+dy*dy)*multi)>>0;
				o31.a = Math.atan2(dy,dx);


				//linePoints.sortOn("d", Array.NUMERIC);



        linePoints = linePoints.sort(this.sortDist);

				var hypothenus:BorderLinePt = linePoints[2];
				center = hypothenus.p1;

				opposite = linePoints[0].p1;
				oppositeId = linePoints[0].id;
				if (opposite == hypothenus.p2) {
					opposite = linePoints[1].p1;
					oppositeId = linePoints[1].id;
				}

				dx = center.x - opposite.x;
				dy = center.y - opposite.y;
				var a:number =  Math.atan2(dy,dx);
				var d:number = Math.sqrt(dx*dx+dy*dy);

				opposite.x = (center.x + Math.cos(-hypothenus.a + a) * d) >> 0; // val >> 0 == int(val)
				opposite.y = (center.y + Math.sin(-hypothenus.a + a) * d) >> 0;

				dy = Math.abs(opposite.y - center.y);

				p1.x = o1x >> 0; //val >> 0 == int(val)
				p1.y = o1y >> 0;
				p2.x = o2x >> 0;
				p2.y = o2y >> 0;
				p3.x = o3x >> 0;
				p3.y = o3y >> 0;


				if (dy < limit) {
          /*
					this.points.splice(oppositeId, 1);


					var p:BorderPt = this.points[oppositeId]
					if (p.isQuadPoint == true) {
						p.isQuadPoint = false;

						hypothenus.p2.isQuadPoint = true;
						hypothenus.p2.quad = p.quad;
						hypothenus.p2.quad[p.quadId] = p1;

					}

          nbRemove++;
          if(nbRemove == maxRemove) break;
          */
          opposites[k++] = {d:dy,id:oppositeId}
          //opposites.push({d:dy,id:oppositeId})
				}

			}


      if(opposites.length > maxRemove){
        //console.log("aaaaaaaaaaaaa")
        opposites = opposites.sort(this.sortDist);
         opposites = opposites.slice(0,maxRemove);
      }
      opposites = opposites.sort(this.sortId);

      for(i=opposites.length-1;i>=0;i--){
        oppositeId = opposites[i].id;
        this.points.splice(oppositeId, 1);

        /*var p:BorderPt = this.points[oppositeId]
        if (p.isQuadPoint == true) {
          p.isQuadPoint = false;

          hypothenus.p2.isQuadPoint = true;
          hypothenus.p2.quad = p.quad;
          hypothenus.p2.quad[p.quadId] = p1;

        }*/
      }

			return this.points;
		}
}
