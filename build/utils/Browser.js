class Browser {
    constructor() {
        if (!Browser._instance) {
            Browser._instance = this;
            Browser._canUseImageBitmap = createImageBitmap != undefined && createImageBitmap != null;
            Browser._canUseWorker = Worker != undefined && Worker != null;
            Browser._canUseOffscreenCanvas = window.OffscreenCanvas != undefined && window.OffscreenCanvas != null;
            var canvas = document.createElement("canvas");
            canvas.width = canvas.height = 1;
            createImageBitmap(canvas).then((bmp) => Browser.emptyImageBitmap = bmp);
        }
    }
    static get canUseImageBitmap() {
        if (!Browser._instance)
            new Browser();
        return Browser._canUseImageBitmap;
    }
    static get canUseWorker() {
        if (!Browser._instance)
            new Browser();
        return Browser._canUseWorker;
    }
    static get canUseOffscreenCanvas() {
        if (!Browser._instance)
            new Browser();
        return Browser._canUseOffscreenCanvas;
    }
}
Browser._canUseWorker = false;
Browser._canUseImageBitmap = false;
Browser._canUseOffscreenCanvas = false;
Browser.emptyImageBitmap = null;
//# sourceMappingURL=Browser.js.map