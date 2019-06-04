/*
type FillType = string|CanvasGradient|CanvasPattern;

class Display2D_Old extends Matrix2D {

  private static display2dIndex:number = 0;

  public static MOUSE_OVER:string = "MOUSE_OVER";
  public static MOUSE_OUT:string = "MOUSE_OUT";
  public static CLICK:string = "CLICK";



  public static pathManager:Path = new Path();



  protected cache:BitmapCache;
  protected _stage:Stage2D;
  protected _cacheAsBitmap:boolean = false;


  public renderStack:RenderStack;

  public width:number = 1;
  public height:number = 1;
  public alpha:number = 1;

  public inverseW:number = 1;//used for filling process;
  public inverseH:number = 1;//used for filling process;
  public strokeAfterFill:boolean = true;

  protected mouse:MouseControler;
  public mouseIsOver:boolean = false;
  public mouseEnabled:boolean = true;
  public useBasicHitTest:boolean = false;


  public parent:Group2D;
  protected render:Function;

  public currentTransform:DOMMatrix;

  protected _bounds:Rectangle2D;
  private _display2dName:string



  constructor(w:number,h:number,renderStack:RenderStack=null){
    super();
    this._display2dName = "o"+(Display2D_Old.display2dIndex++);
    this.width = w;
    this.height = h;


    if(!renderStack) this.renderStack = new RenderStack();
    else this.renderStack = renderStack;

    this._bounds = new Rectangle2D(0,0,w,h);

    this.cache = new BitmapCache(this);
    //this.cacheBd = new BitmapData(w,h);
    //this.cacheBd.needsUpdate = true;

  }



     //bitmap to geometry

    //----------------

    //faire en sorte qu'on puisse pusher une RenderStack dans une RenderStack

    //gérer les stack de
    //  - globalCompositeOperation
    //  - pixel manipulation

    //fx basé sur une renderstack
    //   - tint --> source + globalCompositeOperation +(SquarePath + Fill)



  public get fillStrokeDrawable():boolean{ return this._cacheAsBitmap == false || this.cache.needsUpdate == true  }

  public get display2dName():string{return this._display2dName}
  public get useComplexHitTest():boolean {return this.useBasicHitTest == false && this.mouseEnabled}

 public setStage(stage:Stage2D){
   this._stage = stage;
   if(stage) this.mouse = stage.mouseControler;
   else this.mouse = null;

 }
 public get stage():Stage2D{ return this._stage;}

 public align(displayAlign:Pt2D = Align.CENTER):void{
   this.xAxis = this.width * displayAlign.x;
   this.yAxis = this.height * displayAlign.y;
 }




 public stack(renderStackElement:RenderStackable):RenderStackElement{
   return this.renderStack.push(renderStackElement);
 }

 public get cacheAsBitmap():boolean{ return this._cacheAsBitmap;}
 public set cacheAsBitmap(b:boolean){
     this._cacheAsBitmap = b;
     if(b) this.cache.updateCache();

 }


  public get bitmapDataCache():BitmapData{ return this.cacheBd;}
  public get bitmapCache():ImageBitmap{ return this.cacheBmp;}


  public updateCacheWithoutRotation():BitmapData{
    const cacheBd:BitmapData = this.cacheBd;
    //const bitmapCache:BitmapData = this.bitmapCache;
    const bdContext:CanvasRenderingContext2D = cacheBd.context;
    const renderStack:RenderStack = this.renderStack;
    const w:number = this.width * this.scaleX;
    const h:number = this.height * this.scaleY;
    cacheBd.needsUpdate = true;
    renderStack.updateBounds(this);
    //console.log(renderStack.offsetW)
    cacheBd.width = w + renderStack.offsetW*2;
    cacheBd.height = h + renderStack.offsetH*2;
    bdContext.save();

    var m:DOMMatrix = new DOMMatrix().translate(renderStack.offsetW,renderStack.offsetH).scale(w,h);


    (bdContext as any).setTransform(m.a,m.b,m.c,m.d,m.e,m.f);
    renderStack.updateCache(bdContext,this);
    bdContext.restore();
    cacheBd.createImageBitmap().then((bmp)=>this.cacheBmp = bmp);
    cacheBd.needsUpdate = false;
    return cacheBd;
  }




  public get bounds():Rectangle2D{return this._bounds;}

  public get realAlpha():number{return this.parent.realAlpha * this.alpha;}
  public get realX():number{return this.parent.realX + this.x};
  public get realY():number{return this.parent.realY + this.y};
  public get realScaleX():number{return this.parent.realScaleX *this.scaleX};
  public get realScaleY():number{return this.parent.realScaleY * this.scaleY};
  public get realRotation():number{return this.parent.realRotation + this.rotation};



  public onMouseOver():void{
    this.mouseIsOver = true;
    this.dispatchEvent(Display2D.MOUSE_OVER);
  }
  public onMouseOut():void{
    this.mouseIsOver = false;
    this.dispatchEvent(Display2D.MOUSE_OUT);
  }

  public resetBoundsOffsets():void{
    this.offsetW = this.offsetH = 0;
  }


  private applyCacheTransform():DOMMatrix{
    const m:DOMMatrix = this.matrix;
    const bd:BitmapData = this.cacheBd;
    const ox = this.renderStack.offsetW ;
    const oy = this.renderStack.offsetH ;

    m.translateSelf(this.x,this.y);
    m.rotateSelf(this.rotation);
    m.translateSelf(-this.xAxis*this.scaleX-ox,-this.yAxis*this.scaleY-oy)
    m.scaleSelf((this.width * this.scaleX + ox*2) / bd.width,(this.height * this.scaleY + oy*2) / bd.height);

    return m;
  }


  public update(context:CanvasRenderingContext2D):void{
    this.identity();

    this.inverseW = 1/this.width;
    this.inverseH = 1/this.height;

    context.save();

    if(this.parent) this.multiply(this.parent);





    let m:DOMMatrix = this.currentTransform = this.applyTransform();
    (context as any).setTransform(m.a,m.b,m.c,m.d,m.e,m.f);

    if(this.cacheAsBitmap){
       this.cache.updateCache();
       //this.cache.draw(context)
    }

    this.renderStack.update(context,this,this.mouse.x,this.mouse.y);

    context.restore();
  }

}
*/
//# sourceMappingURL=Display2D_Old.js.map