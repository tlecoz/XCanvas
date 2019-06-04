class Browser {

  private static _canUseWorker:boolean = false;
  private static _canUseImageBitmap:boolean = false;
  private static _canUseOffscreenCanvas:boolean = false;

  private static _instance:Browser;
  private static emptyImageBitmap:ImageBitmap = null;


  constructor(){
    if(!Browser._instance){
      Browser._instance = this;
      Browser._canUseImageBitmap = createImageBitmap != undefined && createImageBitmap != null;
      Browser._canUseWorker = Worker != undefined && Worker != null;
      Browser._canUseOffscreenCanvas = (window as any).OffscreenCanvas != undefined && (window as any).OffscreenCanvas != null;

      var canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      createImageBitmap(canvas).then((bmp)=>Browser.emptyImageBitmap = bmp);
    }
  }

  public static get canUseImageBitmap():boolean{
    if(!Browser._instance) new Browser();
    return Browser._canUseImageBitmap;
  }
  public static get canUseWorker():boolean{
    if(!Browser._instance) new Browser();
    return Browser._canUseWorker;
  }
  public static get canUseOffscreenCanvas():boolean{
    if(!Browser._instance) new Browser();
    return Browser._canUseOffscreenCanvas;
  }
}
