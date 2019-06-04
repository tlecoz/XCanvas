
type FillType = string|CanvasGradient|CanvasPattern;

class Display2D extends Matrix2D {

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
    this._display2dName = "o"+(Display2D.display2dIndex++);
    this.width = w;
    this.height = h;


    if(!renderStack) this.renderStack = new RenderStack();
    else this.renderStack = renderStack;

    this._bounds = new Rectangle2D(0,0,w,h);

    this.cache = new BitmapCache(this);

  }

  public get dataString():string{
    var datas:string = super.dataString;
    datas += "#";
    datas += [this.width,this.height,this.alpha,this.renderStack.REGISTER_ID].join(",");
    return datas;
  }
  public static fromDataString(data:string,target:Display2D=null):Display2D{
    var t:string[] = data.split("#")[2].split(",");
    console.log(t);
    var o:Display2D;
    if(!target) o = new Display2D(Number(t[0]),Number(t[1]),ObjectLibrary.instance.getObjectByRegisterId(t[3]));
    else o = target;

    o.alpha = Number(t[2]);
    Matrix2D.fromDataString(data,o);
    return o;
  }


  /*

     bitmap to geometry

    //----------------

    faire en sorte qu'on puisse pusher une RenderStack dans une RenderStack

    gérer les stack de
      - globalCompositeOperation
      - pixel manipulation

    fx basé sur une renderstack
       - tint --> source + globalCompositeOperation +(SquarePath + Fill)

  */

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
    if(b != this._cacheAsBitmap){
      this._cacheAsBitmap = b;
      if(b) this.cache.needsUpdate = true;
   }


 }
 public get bitmapCache():BitmapCache{ return this.cache;}





  public get bounds():Rectangle2D{return this._bounds;}

  public get realAlpha():number{
    if(!this.parent) console.log(this);
    return this.parent.realAlpha * this.alpha;
  }
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



  public update(context:CanvasRenderingContext2D):void{
    this.identity();

    this.inverseW = 1/this.width;
    this.inverseH = 1/this.height;

    context.save();
    if(this.parent) this.multiply(this.parent);

    let m:DOMMatrix = this.currentTransform = this.applyTransform();
    (context as any).setTransform(m.a,m.b,m.c,m.d,m.e,m.f);

    this.cache.updateCache();

    if(this.mouseEnabled && this.mouse) this.renderStack.updateWithHitTest(context,this,this.mouse.x,this.mouse.y);
    else this.renderStack.update(context,this);

    context.restore();
  }

}
