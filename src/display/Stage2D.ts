class Stage2D extends Group2D {

  protected _canvas:HTMLCanvasElement;
  protected _output:HTMLCanvasElement;
  protected _outputContext:CanvasRenderingContext2D|any;
  protected _context:CanvasRenderingContext2D;
  protected _mouseControler:MouseControler;

  constructor(w:number,h:number,appendOnBody:boolean=true){
    super();
    this._stage = this;
    if(!Browser.canUseOffscreenCanvas){
       this._canvas = document.createElement("canvas");
       this._output = this._canvas;
       this._output.style.position = "absolute";
       this._outputContext = this._output.getContext("2d");
    }else {
      this._canvas = new (window as any).OffscreenCanvas(w,h);
      this._output = document.createElement("canvas");
      this._output.style.position = "absolute";
      if(Browser.canUseImageBitmap) this._outputContext = this._output.getContext("bitmaprenderer");
      else this._outputContext = this._output.getContext("2d");

    }
    this._canvas.width = this._output.width = w;
    this._canvas.height = this._output.height = h;
    this._context = this._canvas.getContext("2d");
    this._mouseControler = new MouseControler(this._output);

    //console.log("new Stage2D ",w,h,appendOnBody)
    if(appendOnBody) document.body.appendChild(this._output);
  }

  public get dataString():string{
    //this.width = this.canvas.width;
    //this.height = this.canvas.height;
    var o = super.dataString+"###"+this._canvas.width+","+this._canvas.height;
    //this.width = this.height = 1;
    return o;
  }
  public static fromDataString(data:string):Stage2D{
    var t:string[] = data.split("###");
    var sizes:string[] = t[1].split(",");
    data = t[0];
    var t:string[] = data.split("#")[2].split(",");
    //console.log("stage data = ",data)
    console.log(data);
    console.log(sizes)
    var o:Stage2D = new Stage2D(Number(sizes[0]),Number(sizes[1]),true);
    Group2D.fromDataString(data,o);
    return o;
  }


  public get canvas():HTMLCanvasElement{return this._canvas;}
  public get context():CanvasRenderingContext2D{return this._context;}
  public get mouseControler():MouseControler{return this._mouseControler;}
  public get realAlpha():number{return this.alpha;}

  public get realX():number{return this.x};
  public get realY():number{return this.y};
  public get realScaleX():number{return this.scaleX};
  public get realScaleY():number{return this.scaleY};
  public get realRotation():number{return this.rotation};

  public drawElements():void{
    this._canvas.width = this._canvas.width;
    super.update(this._context);

    if(Browser.canUseImageBitmap){
      //console.log("drawElements ",this._outputContext)
       createImageBitmap(this._canvas).then((bmp)=>this._outputContext.transferFromImageBitmap(bmp));
     }else{
       this._outputContext.drawImage(this._canvas,0,0);
     }

  }

}
