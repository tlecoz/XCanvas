export class Browser {

  private static _canUseWorker: boolean = false;
  private static _canUseImageBitmap: boolean = false;
  private static _canUseOffscreenCanvas: boolean = false;

  private static _instance: Browser;

  //@ts-ignore
  private static emptyImageBitmap: ImageBitmap;

  public static disableOffscreenCanvas: boolean = false;
  public static disableWorker: boolean = false;
  public static disableImageBitmap: boolean = false;

  constructor() {
    if (!Browser._instance) {
      Browser._instance = this;
      Browser._canUseImageBitmap = createImageBitmap != undefined && createImageBitmap != null;
      Browser._canUseWorker = Worker != undefined && Worker != null;
      Browser._canUseOffscreenCanvas = (window as any).OffscreenCanvas != undefined && (window as any).OffscreenCanvas != null;

      var canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      createImageBitmap(canvas).then((bmp) => Browser.emptyImageBitmap = bmp);
    }
  }

  public static get canUseImageBitmap(): boolean {
    if (Browser.disableImageBitmap) return false;
    if (!Browser._instance) new Browser();
    return Browser._canUseImageBitmap;
  }
  public static get canUseWorker(): boolean {
    if (Browser.disableWorker) return false;
    if (!Browser._instance) new Browser();
    return Browser._canUseWorker;
  }
  public static get canUseOffscreenCanvas(): boolean {
    if (Browser.disableOffscreenCanvas) return false;
    if (!Browser._instance) new Browser();
    return Browser._canUseOffscreenCanvas;
  }
}
