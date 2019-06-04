class BitmapCacheFill extends FillStroke {

  public bd:BitmapData;

  constructor(bd:BitmapData,centerInto:boolean=true){
    super();
    this.bd = bd;
    this.styleType = "fillStyle";
  

  }
  public get width():number{return this.bd.width}
  public get height():number{return this.bd.height}
  public apply(context:CanvasRenderingContext2D,path:Path,target:Display2D):void{

    context.drawImage(this.bd.htmlCanvas,0,0);

  }
}
