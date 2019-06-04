class BorderFinder {
  private static _instance:BorderFinder;
  private static directionDatas:number[];
  private static offsetX:number[];
  private static offsetY:number[];

  public borderPoints:BorderPt[];
  public directions:string="";



  private bd:BitmapData;
  private center:BorderPt;
  private pt:BorderPt;
  private first:BorderPt;
  private diago:number;
  private n:number;
  private tab:BorderPt[];



  private old:BorderPt;
  private count:number;
  private working:boolean;
  private oldAngle:number;
  private firstId:number;

  private directionDatas:number[];
  private offsetX:number[]
  private offsetY:number[]
  private _width:number;
  private _height:number;
  private bug:boolean;

  private usedImg:BitmapData;
  private pixelUsed:boolean[];
  private sourceBd:BitmapData;
  private matrix:any;
  private radian:number = Math.PI/180;

  private outColor:number;
  private colorTracking:boolean;
  private trackCol:{r:number,g:number,b:number,a:number};

  private offsetAngle:number;
  private secondPass:boolean = false;

  private holeBd:BitmapData;
  private minX:number;
  private minY:number;
  private maxX:number;
  private maxY:number;

  private scaleRatio:number;
  private bugScale:number = 1.25;


  constructor(){
    //if(BorderFinder._instance){
    //  throw new Error("BorderFinder is a singleton. You must use BorderFinder.instance .");
    //}
    BorderFinder._instance = this;
    this.diago = Math.sqrt(2);

    var directionDatas = [];
    for(var i:number=0;i<766;i++) directionDatas[i] = 0;
    directionDatas[0] = 3;
    directionDatas[45] = 4;
    directionDatas[90] = 5;
    directionDatas[135] = 6;
    directionDatas[180] = 7;
    directionDatas[225] = 8;
    directionDatas[270] = 1;
    directionDatas[315] = 2;
    directionDatas[360] = 3;
    directionDatas[405] = 4;
    directionDatas[450] = 5;
    directionDatas[495] = 6;
    directionDatas[540] = 7;
    directionDatas[585] = 8;
    directionDatas[630] = 1;
    directionDatas[675] = 2;
    directionDatas[720] = 3;
    directionDatas[765] = 4;

    BorderFinder.directionDatas = directionDatas;

    var offsetX = BorderFinder.offsetX = [];
    var offsetY = BorderFinder.offsetY = [];
    offsetX[0] = 1;
    offsetY[0] = -1;

    offsetX[45] = 1;
    offsetY[45] = 0;

    offsetX[90] = 1;
    offsetY[90] = 1;

    offsetX[135] = 0;
    offsetY[135] = 1;

    offsetX[180] = -1;
    offsetY[180] = 1;

    offsetX[225] = -1;
    offsetY[225] = 0;

    offsetX[270] = -1;
    offsetY[270] = -1;

    offsetX[315] = 0;
    offsetY[315] = -1;

    offsetX[360] = 1;
    offsetY[360] = -1;

    offsetX[405] = 1;
    offsetY[405] = 0;

    offsetX[450] = 1;
    offsetY[450] = 1;

    offsetX[495] = 0;
    offsetY[495] = 1;

    offsetX[540] = -1;
    offsetY[540] = 1;

    offsetX[585] = -1;
    offsetY[585] = 0;

    offsetX[630] = -1;
    offsetY[630] = -1;

    offsetX[675] = 0;
    offsetY[675] = -1;

    offsetX[720] = 1;
    offsetY[720] = -1;

    offsetX[765] = 1;
    offsetY[765] = 0;
  }

  public reset():void{
    this.directionDatas = [];

    this.borderPoints = null;
    this.directions = "";
    this.bd = null;
    this.center = null;
    this.pt = null;
    this.first = null;
    this.diago = null;
    this.n = null;
    this.tab = null;
    this.old = null;
    this.count = null;
    this.working = null;
    this.oldAngle = null;
    this.firstId = null;

    this.offsetX = null;
    this.offsetY = null;
    this._width = null;
    this._height = null;
    this.bug = null;
    this.usedImg = null;
    this.pixelUsed = null;
    this.sourceBd = null;
    this.matrix = null;
    this.outColor = null;
    this.colorTracking = null;
    this.trackCol = null;
    this.offsetAngle = null;
    this.secondPass = null;
    this.holeBd = null;
    this.minX = null;
    this.minY = null;
    this.maxX = null;
    this.maxY = null;
    this.scaleRatio = null;
    this.bugScale = 1.25;
  }

  public static get instance():BorderFinder{
    if(!BorderFinder._instance) new BorderFinder();
    return BorderFinder._instance
  };

  public get holePicture():BitmapData{return this.holeBd}


  public getOutsideBorder(source:BitmapData):BorderPt[] {

			var r:{x:number,y:number,w:number,h:number} = source.getAlphaChannelBoundRect(0,0,source.width,source.height,0,0);
			var _temp:BitmapData = new BitmapData(r.w, r.h, "rgba(0,0,0,0)", true);
			//matrix.identity();
			//matrix.translate(-r.x, -r.y);
			//_temp.draw(source, matrix);

      _temp.drawImage(source.htmlCanvas,r.x,r.y,r.w,r.h,0,0,r.w,r.h);

			var res:BorderPt[] = this.getBorderFromBitmapData(_temp, false );
			if(res){
				let i:number,len:number = res.length;
				for (i = 0; i < len; i++) {
					res[i].x += r.x;
					res[i].y += r.y;
				}
			}
			return res;
		}

    public createGraphicsGeometryFromBitmapData(source:BitmapData,firstPassPrecision:number=0.2,fitCurvePrecision:number=1):GraphicGeometry{
      var geom:GraphicGeometry = new GraphicGeometry();
      var border:BorderPt[] = this.getBorderFromBitmapData(source);

      var vectoBorder:BorderPt[] = BorderVectorizer.instance.init((border.length * firstPassPrecision)>>0,border);
      var curves:number[][][] = FitCurve.borderToCurve(vectoBorder,fitCurvePrecision);

      var i:number,len:number = curves.length;
      var bezier:number[][];
      for(i=0;i<len;i++){
        bezier = curves[i];
        if(i==0)geom.moveTo(bezier[0][0],bezier[0][1])
        geom.bezierCurveTo(bezier[1][0],bezier[1][1],
                          bezier[2][0],bezier[2][1],
                          bezier[3][0],bezier[3][1]);
      }


      return geom;
    }















    public getBorderFromBitmapData(source:BitmapData,
                                  trackColor:boolean=false,
                                  colorTracked:{r:number,g:number,b:number,a:number}={r:255,g:0,b:255,a:0},
                                  areaRect:{x:number,y:number,w:number,h:number}=null,
                                  secondPass:boolean=false,
                                  borderX:number=0,
                                  borderY:number=0):BorderPt[] {
			//if(source != sourceBd) secondPass = false;

      this.reset();

      this.directions = "";

      let tab:BorderPt[] = this.tab = [];
			let n:number = this.n = 0;
			let old:BorderPt = this.old = new BorderPt(0,0,0);
			let count:number = this.count = 0;
      let directionDatas:number[] = BorderFinder.directionDatas;

      var offsetX = this.offsetX = BorderFinder.offsetX;
      var offsetY = this.offsetY = BorderFinder.offsetY;
			let colorTracking:boolean = this.colorTracking = trackColor;
			let trackCol:{r:number,g:number,b:number,a:number} = this.trackCol = colorTracked;
			let minX:number,minY:number,maxX:number,maxY:number;
      minX = minY = 99999999;
			maxX = maxY = 0;
			this.sourceBd = source;

			var area:number = source.width * source.height;
			if (areaRect) area = areaRect.w * areaRect.h;

			var s:number = (300*300)/area ;
			if (s < 1)  s = 1;
			else if (s > 2) s = 2;

      //console.log("getBorder scale = ",s, (400*400),area)

			if (secondPass) s+=1;

			let scaleRatio:number = this.scaleRatio = s;


			var pw2:number = (source.width * s) >> 0; //(val >> 0) = int(val);
			var ph2:number = (source.height * s) >> 0;


      if(!this.bd) this.bd = new BitmapData(pw2+4,ph2+4,"rgba(0,0,0,0)",true);
      else this.bd.resize(pw2+4,ph2+4);

      let bd:BitmapData = this.bd;


      bd.drawImage(source.htmlCanvas,0,0,source.width,source.height,2,2,pw2,ph2);



			this.pixelUsed = [];
      let pixelUsed:boolean[] = this.pixelUsed;

			var i:number,len:number = bd.width * bd.height;
			for(i=0;i<len;i++) pixelUsed[i] = false;

			var px:number = bd.width >> 1;
			var py:number = 2;
			var r:{x:number,y:number,w:number,h:number}
			var j:number;

			if (colorTracking == false) {


				r = bd.getAlphaChannelBoundRect(0,0,bd.width,bd.height,0,0);

				len = r.w + 1;
				px = r.x-1 ;
				py = (r.y + r.w/2) >> 0;

				for (i = 0; i < r.w; i++) {
					if (0 == bd.getPixelAlpha(px, py)) px++;
					else break;
				}


			}
			else {
				r = bd.getColorBoundRect(0,0,bd.width,bd.height,trackCol.r,trackCol.g,trackCol.b,trackCol.a);
				len = r.w + 1;
				px = r.x;
				py = r.y;

				for (i = 0; i < len; i++) {
					if (!bd.matchColor(px, py,trackCol.r,trackCol.g,trackCol.b,trackCol.a)) px++;
					else break;
				}

			}


			n = 0;
			tab = this.tab = [];
			old = this.old = new BorderPt(0,0,0);
			let directions = this.directions = "";
			this.count = 0;
			this.first = this.center = new BorderPt(px,py,0);
			let pt:BorderPt = this.pt = new BorderPt(px-1,py,0);

      let firstId:number;
			let id:number = firstId = this.firstId = (py * bd.width + px) >> 0; //(val) >> 0 = int(val)

			pixelUsed[id] = true;

			this._width = bd.width;
			this._height = bd.height;
			this.bug = false;


			this.offsetAngle = 0;
			this.working = true;

			if(colorTracking == false){

				while (this.working && this.bug == false){
					this.getBorder();
					this.bug = this.count > 100;
				}


			}else {

				while (this.working && this.bug == false){
					this.getBorderColorTracking();
					this.bug = this.count > 100;
				}
			}


			this.borderPoints = null;
			if (this.bug == true) {
				if (secondPass == true || colorTracking) {
					//console.log("borderFinder second pass bug found");
					return null;
				}
				//console.log("bug found");


				var temp:BitmapData = source.clone();
        temp.applyFilter("blur(0.05px)");
				return this.getBorderFromBitmapData(temp, colorTracking, trackCol,areaRect,true);
			}

			//if (secondPass) s *= bugScale;

			len = tab.length;
      var prev = tab[tab.length-1]

			for (i = 0; i < len; i++) {
        pt = tab[i];
				pt.x = (borderX + (pt.x) / s) >> 0; //(val >> 0) = int(val)
				pt.y = (borderY + (pt.y) / s) >> 0;
        pt.id = i;
        pt.prev = prev;
        prev.next = pt;
        prev = pt;
			}

			this.borderPoints = tab;
			return tab;

		}

    private returnAngle(p0:BorderPt,p1:BorderPt):number{
			return  (Math.atan2(p1.y - p0.y, p1.x - p0.x) / (Math.PI / 180.0) ) >> 0; //(val >> 0) = int(val)
		}

    private getBorder():void{
			let _angle:number = this.returnAngle(this.center, this.pt) + 45 ;
			let a:number = _angle;
			let test:boolean = a - this.oldAngle > 0;

			let len:number = a + 315;
			let r:number;
			let px:number=0, py:number=0;
			let temp:BorderPt;
			let bool:Boolean = false;
			let pixelIndex:number;
			let radian:number = this.radian;
      let center:BorderPt = this.center;
      let pixelUsed:boolean[] = this.pixelUsed;
      let diago:number = this.diago;
      let _width:number = this._width;
      let bd:BitmapData = this.bd;
      let directionDatas:number[] = this.directionDatas;
      let firstId:number = this.firstId;
      let tab:BorderPt[] = this.tab;
      let offsetX:number[] = this.offsetX;
      let offsetY:number[] = this.offsetY;

			while (a < len) {

        /*
				r = radian * a;
				if (a % 45 != 0){
					px = (0.5+center.x +  Math.cos(r) * diago)>>0;
					py = (0.5+center.y +  Math.sin(r) * diago)>>0;
				}else	{
					px = (0.5+center.x +  Math.cos(r))>>0;
					py = (0.5+center.y +  Math.sin(r))>>0;
				}*/
        px = center.x + offsetX[a+135];
        py = center.y + offsetY[a+135];
				pixelIndex = py * _width + px;
        //console.log(py,_width,px)
				if (0 != bd.getPixelAlpha(px, py)){
  				if (true == pixelUsed[pixelIndex]){

  					if(pixelIndex == firstId){
  						  //console.log("FINISH");
  						//trace("len = " + tab.length);
  							bool = false;
  							this.working = false;
  							this.count = 0;
  							break;
  					}

  				}else {
              if(!pixelUsed[pixelIndex]){
  						   this.directions += directionDatas[a+45];
  						   pixelUsed[pixelIndex] = true;
  						   tab.push(new BorderPt(px, py, this.n++));//new Point(px, py);
  						   bool = true;
  						   break;
              }
					}
				}
				a += 45;
			}



			if(bool){
				temp = new BorderPt(center.x,center.y,0);
				this.center = new BorderPt(px, py,0);
				this.pt = new BorderPt(temp.x, temp.y,0);
				this.count = 0;

			}else {

				center = new BorderPt(this.pt.x, this.pt.y,0);
        this.count++;
        //console.log(this.count)
				var d:number = tab.length - this.count;
				if (d >= 0) this.pt = tab[d] ;
				else {
          //console.log("work = false")
          this.working = false;
        }

			}
		}

    private getBorderColorTracking():void{
      let _angle:number = this.returnAngle(this.center, this.pt) + 45 ;
			let a:number = _angle;
			let test:boolean = a - this.oldAngle > 0;

			let len:number = a + 450;
			let r:number;
			let px:number=0, py:number=0;
			let temp:BorderPt;
			let bool:Boolean = false;
			let pixelIndex:number;
			let radian:number = this.radian;
      let center:BorderPt = this.center;
      let pixelUsed:boolean[] = this.pixelUsed;
      let diago:number = this.diago;
      let _width:number = this._width;
      let bd:BitmapData = this.bd;
      let directionDatas:number[] = this.directionDatas;
      let firstId:number = this.firstId;
      let tab:BorderPt[] = this.tab;
			let red:number = this.trackCol.r;
      let green:number = this.trackCol.g;
      let blue:number = this.trackCol.b;
      let alpha:number = this.trackCol.a;

			while (a < len){
				r = radian * a;
        /*
				if (a % 45 != 0){
					px = Math.round(center.x +  Math.cos(r) * diago);
					py = Math.round(center.y +  Math.sin(r) * diago);
				}else
				{
					px = Math.round(center.x +  Math.cos(r));
					py = Math.round(center.y +  Math.sin(r));
				}
        */
        if (a % 45 != 0){
          px = (center.x +  Math.cos(r) * diago)>>0;
          py = (center.y +  Math.sin(r) * diago)>>0;
        }else
        {
          px = (center.x +  Math.cos(r))>>0;
          py = (center.y +  Math.sin(r))>>0;
        }
				pixelIndex = py * _width + px;

				if (bd.matchColor(px, py,red,green,blue,alpha)){
          if (true == pixelUsed[pixelIndex]){

  					if(pixelIndex == firstId){
  						  //console.log("FINISH");
  						//trace("len = " + tab.length);
  							bool = false;
  							this.working = false;
  							this.count = 0;
  							break;
  					}

  				}else {
              if(!pixelUsed[pixelIndex]){
  						   this.directions += directionDatas[a+45];
  						   pixelUsed[pixelIndex] = true;
  						   tab.push(new BorderPt(px, py, this.n++));//new Point(px, py);
  						   bool = true;
  						   break;
              }
					}
				}
				a += 45;
			}



			if(bool){
				temp = new BorderPt(center.x,center.y,0);
				this.center = new BorderPt(px, py,0);
				this.pt = new BorderPt(temp.x, temp.y,0);
				this.count = 0;

			}else {

				center = new BorderPt(this.pt.x, this.pt.y,0);
        this.count++;
        //console.log(this.count)
				var d:number = tab.length - this.count;
				if (d >= 0) this.pt = tab[d] ;
				else {
          //console.log("work = false")
          this.working = false;
        }

			}
		}



    public getNumberOfHoles(source:BitmapData):number {
  			var picture:BitmapData = source.clone();
  			var r:{x:number,y:number,w:number,h:number} = picture.getAlphaChannelBoundRect(0,0,picture.width,picture.height,0,0);

  			var i:number, len:number;
  			var floodColor:{r:number,g:number,b:number,a:number} = {r:100,g:0,b:255,a:255};//xff00ff00;
  			var count:number = 0;
  			var sw:number = source.width;
  			var sh:number = source.height;

  			while (r != null && r.w != 0 && r.h != 0) {
  				len = r.w;
  				for (i = 0; i < len; i++) {
            //if (!picture.isOpaque(r.x + i, r.y)) {

  					if (picture.matchAlpha(r.x + i, r.y,0)) {
              //console.log(i," picture.floodFillRGBA(",r.x + i, r.y, floodColor.r,floodColor.g,floodColor.b,floodColor.a)
  						var bounds = picture.floodFillRGBA(r.x + i, r.y, floodColor.r,floodColor.g,floodColor.b,floodColor.a).bounds;
  						//r = picture.getColorBoundRect(0,0,picture.width,picture.height,floodColor.r,floodColor.g,floodColor.b,floodColor.a);
  						floodColor.g = (Math.random()*255)>>0;
              floodColor.b = (Math.random()*255)>>0;
              floodColor.r = (Math.random()*255)>>0;

              if(bounds.x > 0 && bounds.y > 0 && bounds.x + bounds.width < sw && bounds.y + bounds.height < sh) count++;
  						break;
  					}
  				}


  				r = picture.getAlphaChannelBoundRect(0, 0,picture.width,picture.height,0,0);

  			}
        console.log("nbHole = ",count);
  			return count;
		}

    public getHoleBorders(source:BitmapData):BorderPt[][]{


      //first Part :
      //1) find a region containing alpha pixels
      //2) fill that region with a color in another canvas and keep its boundary
      //3) extract the region in another canvas at the good dimension

      var result = [];

      var picture:BitmapData = source//.clone();
      var r:{x:number,y:number,w:number,h:number} = picture.getAlphaChannelBoundRect(0,0,picture.width,picture.height,0,0);

      var i:number, len:number;
      var floodColor:{r:number,g:number,b:number,a:number} = {r:255,g:0,b:255,a:255};//xff00ff00;
      floodColor.g = (Math.random()*255)>>0;
      floodColor.b = (Math.random()*255)>>0;
      floodColor.r = (Math.random()*255)>>0;

      var count:number = 0;
      var sw:number = source.width;
      var sh:number = source.height;
      var area:{x:number,y:number,w:number,h:number} = {x:0,y:0,w:source.width,h:source.height};
      var holeBd:BitmapData;
      while (r != null && r.w != 0 && r.h != 0) {
          len = r.w;
          for (i = 0; i < len; i++) {
            if (picture.matchAlpha(r.x + i, r.y,0)) {
                holeBd = picture.floodFillRGBAandReturnOutputCanvas(r.x + i, r.y, floodColor.r,floodColor.g,floodColor.b,floodColor.a);
                //document.body.appendChild(holeBd.htmlCanvas)
                if(holeBd.offsetX > 0 && holeBd.offsetY > 0 && holeBd.offsetX + holeBd.width < sw-1 && holeBd.offsetY + holeBd.height < sh-1){ //if its not an outside border
                   result[count++] = holeBd;
                }
                floodColor.g = (Math.random()*255)>>0;
                floodColor.b = (Math.random()*255)>>0;
                floodColor.r = (Math.random()*255)>>0;
                break;
            }
          }
          r = picture.getAlphaChannelBoundRect(0, 0,picture.width,picture.height,0,0);
       }

       //second part :
       //for each rect-bounds & color , figure out the border

       var i:number;
       var borders:BorderPt[][] = [];
       var offX:number[] = [];
       var offY:number[] = [];
       for(i=0;i<result.length;i++){
         holeBd = result[i];
         offX[i] = holeBd.offsetX;
         offY[i] = holeBd.offsetY;
         borders[i] = this.getBorderFromBitmapData(holeBd,false,{r:0,g:0,b:0,a:0},null,false,holeBd.offsetX,holeBd.offsetY);

         //this.debugBorder(holeBd.context,borders[i]);
         //document.body.appendChild(holeBd.htmlCanvas)
         //console.log(i+" | "+area.w+" , "+area.h+" =>> ",borders[i].length);
       }

       return borders;//{borders:borders,borderX:offX,borderY:offY}
    }

































    public debugBorder(ctx:CanvasRenderingContext2D,border:BorderPt[],strokeStyle:string="#000000",b:boolean=true,px:number=0,py:number=0):void{
       ctx.strokeStyle = ctx.fillStyle = strokeStyle;
       ctx.beginPath()
       ctx.moveTo(border[0].x+px,border[0].y+py);
       if(b) for(var i=1;i<border.length;i++) ctx.lineTo(border[i].x+px,border[i].y+py);
       else for(var i=border.length-1;i>=0;i--) ctx.lineTo(border[i].x+px,border[i].y+py);
       ctx.stroke()
      // ctx.fill()
    }
}
