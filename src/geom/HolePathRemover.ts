class HolePathRemover {
  private static _instance:HolePathRemover;

  public debug:BitmapData;
  public outside:BorderPt[];
  private grid:BorderPt[][][];
  private cells:BorderPt[];
  private gridSize:number;
  private nbX:number;
  private nbY:number;
  public quads:any[];

  constructor(){
    this.debug = new BitmapData(window.innerWidth,window.innerHeight);
    HolePathRemover._instance = this;
  }
  public static get instance():HolePathRemover{
    if(!HolePathRemover._instance) new HolePathRemover();
    return HolePathRemover._instance;
  }
  public drawQuads():void{

  }

  public drawPath(pct:number,color:string="#000000"):void{
    var ctx:CanvasRenderingContext2D = this.debug.context;
    this.debug.clear();
    ctx.fillStyle = color;

    var path:BorderPt[] = this.outside;

    var s = 1
    ctx.beginPath();
    ctx.moveTo(path[0].x*s,path[0].y*s);
    var i:number,len:number = path.length * pct;
    for(i=1;i<len;i++) ctx.lineTo(path[i].x*s,path[i].y*s);
    ctx.closePath();
    //ctx.fill("evenodd");
    ctx.stroke();


    for(i=0;i<this.quads.length;i++){
      ctx.fillStyle = "#ff0000";
      ctx.beginPath();
      ctx.moveTo(this.quads[i].p0.x*s,this.quads[i].p0.y*s);
      ctx.lineTo(this.quads[i].p1.x*s,this.quads[i].p1.y*s);
      ctx.lineTo(this.quads[i].p2.x*s,this.quads[i].p2.y*s);
      ctx.lineTo(this.quads[i].p3.x*s,this.quads[i].p3.y*s);
      ctx.closePath();
      ctx.fill()
    }

  }


  private findClosestPoints(outside:BorderPt[],hole:BorderPt[]):{outsidePt:BorderPt,holePt:BorderPt}{

    var result:{outsidePt:BorderPt,holePt:BorderPt,dist:number} = {outsidePt:null,holePt:null,dist:9999999999999};

    let i:number,j:number,nbHole:number = hole.length,nbOut:number = outside.length;
    let hx:number,hy:number,ox:number,oy:number,dx:number,dy:number;
    let holePt:BorderPt,outPt:BorderPt;
    for(i=0;i<nbHole;i++){
      holePt = hole[i];
      hx = holePt.x;
      hy = holePt.y;
      for(j=0;j<nbOut;j++){
        outPt = outside[j];
        ox = outPt.x;
        oy = outPt.y;

        dx = ox - hx;
        dy = oy - hy;

        outPt.dist = dx*dx+dy*dy;
      }
      outside = outside.sort(function(a:BorderPt,b:BorderPt){
        if(a.dist > b.dist ) return 1;
        if(a.dist < b.dist) return -1;
        return 0;
      })

      if(outside[0].dist < result.dist){
        result.dist = outside[0].dist;
        result.outsidePt = outside[0];
        result.holePt = holePt;
      }
    }

    //console.log(result);

    return result;
  }

  public init(outside:BorderPt[],precision:number=0):void{ //,precision:number):void{
    this.quads = [];
    var minX:number = 9999999;
    var minY:number = 9999999;
    var maxX:number = -9999999;
    var maxY:number = -9999999;

    //####
    //console.log("precision = ",precision)
    //precision = 0.1
    if(precision != 0) outside = BorderVectorizer.instance.init(outside.length*precision >> 0,outside);
    //###

    var i:number,len:number = outside.length;
    var pt:BorderPt;
    var px:number,py:number;
    for(i=0;i<len-1;i++){
       pt = outside[i];
       pt.id = i;
       px = pt.x;
       py = pt.y;
       if(px>maxX) maxX = px;
       if(px<minX) minX = px;
       if(py>maxY) maxY = py;
       if(py<minY) minY = py;

       pt.next = outside[(i+1)%len];
       if(i>0)pt.prev = outside[i-1];
       else outside[i].prev = outside[len-1];
    }
    var w = maxX - minX;
    var h = maxY - minY;
    var size:number = this.gridSize = (Math.max(w,h)/8)>>0;
    this.outside = outside;


    var nbX = Math.ceil(w / size);
    var nbY = Math.ceil(h / size);
    var j:number,k:number = 0;
    var grid = this.grid = [];
    var cells = this.cells = [];

    //var ctx = this.debug.context;
    //ctx.strokeStyle = "rgba(255,0,0,0.5)"
    //ctx.lineWidth = 0.1;
    //ctx.beginPath()
    for(i=0;i<nbX;i++){

      //tx.moveTo(i*size,0);
      //ctx.lineTo(i*size,h);
      //ctx.closePath()
        //ctx.stroke()
       grid[i] = [];
       for(j=0;j<nbY;j++){
         //if(i==0){
          //  ctx.beginPath()
            //ctx.moveTo(0,j*size);
            //ctx.lineTo(w,j*size);
            //ctx.closePath()

          //}
         grid[i][j] = cells[k++] = []
         grid[i][j].x = i;
         grid[i][j].y = j;
         grid[i][j].used = false;
       }
    }
    //ctx.stroke()
    //ctx.lineWidth = 1



    for(i=0;i<len-1;i++){
       pt = outside[i];
       px = pt.x;
       py = pt.y;
       grid[(px / size)>>0][(py/size)>>0].push(pt);
    }

  }

  private getCellAround(px:number,py:number,result:any[]){
    var x = px,y=py;
    var grid = this.grid;

    x = px-1;
    y = py-1;
    if(grid[x] && grid[x][y] && !(grid[x][y] as any).used){
      (grid[x][y] as any).used = true;
      result.push(grid[x][y]);
    }

    x = px+0;
    y = py-1;
    if(grid[x] && grid[x][y] && !(grid[x][y] as any).used){
      (grid[x][y] as any).used = true;
      result.push(grid[x][y]);
    }

    x = px+1;
    y = py-1;
    if(grid[x] && grid[x][y] && !(grid[x][y] as any).used){
      (grid[x][y] as any).used = true;
      result.push(grid[x][y]);
    }

    x = px+1;
    y = py+0;
    if(grid[x] && grid[x][y] && !(grid[x][y] as any).used){
      (grid[x][y] as any).used = true;
      result.push(grid[x][y]);
    }

    x = px+1;
    y = py+1;
    if(grid[x] && grid[x][y] && !(grid[x][y] as any).used){
      (grid[x][y] as any).used = true;
      result.push(grid[x][y]);
    }

    x = px+0;
    y = py+1;
    if(grid[x] && grid[x][y] && !(grid[x][y] as any).used){
      (grid[x][y] as any).used = true;
      result.push(grid[x][y]);
    }

    x = px-1;
    y = py+1;
    if(grid[x] && grid[x][y] && !(grid[x][y] as any).used){
      (grid[x][y] as any).used = true;
      result.push(grid[x][y]);
    }

    x = px-1;
    y = py-0;
    if(grid[x] && grid[x][y] && !(grid[x][y] as any).used){
      (grid[x][y] as any).used = true;
      result.push(grid[x][y]);
    }


  }

  private findClosestPoints2(hole:BorderPt[]):{outsidePt:BorderPt,holePt:BorderPt}{


    var result:{outsidePt:BorderPt,holePt:BorderPt}

    var i:number,len:number = hole.length;
    var pt:BorderPt,px:number,py:number;
    var grid:BorderPt[][][] = this.grid;
    var size:number = this.gridSize;
    var points = [];
    var o;

    for(i=0;i<this.cells.length;i++) (this.cells[i] as any).used = false;

    var around:BorderPt[][] = [];

    for(i=0;i<len;i++){
      pt = hole[i];
      px = (pt.x/size)>>0;
      py = (pt.y/size)>>0;

      o = grid[px][py];
      o.used = true;
      points = points.concat(o);
      if(points.length == 0) this.getCellAround(px,py,around);
      //else break;

    }

    //console.log()

    var a;
    var newAround;
    var k:number = 0;
    while(points.length == 0 && k++ < 1000){
      len = around.length;
      newAround = [];
      for(i=0;i<len;i++){
        a = around[i];
        a.used = true;
        points = points.concat(a);
        if(points.length == 0) this.getCellAround(a.x,a.y,newAround);
        //else break;
      }
      around = newAround;
    }


    return this.findClosestPoints(points,hole);
  }



  public addHole(hole:BorderPt[],precision:number=0):BorderPt[]{
    var time:number = new Date().getTime();

    //###
    if(precision != 0) hole = BorderVectorizer.instance.init(hole.length*precision >> 0,hole);
    //###

    var i:number,len:number = hole.length;
    for(i=0;i<len;i++){
       hole[i].id = i;
       hole[i].prev = hole[(i+1)%len];
       if(i>0)hole[i].next = hole[i-1];
       else hole[i].next = hole[len-1];
       //console.log(i,hole[i].prev,hole[i].next)
    }
    //hole[len-1].next = hole[0];
    //console.log("---")

    var o = this.findClosestPoints2(hole.concat());

    //console.log(o)

    var outside = this.outside;
    var id = o.outsidePt.id-1;
    if(id < 0) id += outside.length;
    var outConnectStartPt:BorderPt = outside[id];
    var outConnectEndPt:BorderPt = outside[(o.outsidePt.id+1)%outside.length];
    //var outErasedPt:BorderPt = outside.splice(o.outsidePt.id,1)[0];




    var holeConnectStartPt:BorderPt = hole[o.holePt.id];
    //console.log("outConnectStartPt = ",outConnectStartPt)
    //console.log("holeConnectStartPt = ",holeConnectStartPt)

    var id = o.holePt.id-1
    if(id<0)id += hole.length;
    var holeConnectEndPt:BorderPt = hole[id];
    //var holeErasedPt:BorderPt = hole.splice(o.holePt.id,1)[0];

    outConnectStartPt.next = holeConnectEndPt;
    holeConnectStartPt.next = outConnectEndPt;

    this.quads.push({
      p0:outConnectStartPt,
      p1:outConnectEndPt,
      p2:holeConnectStartPt,
      p3:holeConnectEndPt
    })

    var path:BorderPt[] = [];
    var first = outside[0];
    var k = 0;
    var pt = path[k++] = first;
    pt.id = 0;
    pt = pt.next;
    while(pt && pt != first ){
      pt.id = k;
      path[k++] = pt ;
      pt = pt.next;
    }
    //console.log("k = ",k)

    this.outside = path;
    //this.drawPath(path,"#000000");
    //this.drawPath(hole,"#ff0000");

    //console.log(new Date().getTime()-time)

    return path;
  }



}
