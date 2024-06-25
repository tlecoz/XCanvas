export declare class Browser {
    private static _canUseWorker;
    private static _canUseImageBitmap;
    private static _canUseOffscreenCanvas;
    private static _instance;
    private static emptyImageBitmap;
    constructor();
    static get canUseImageBitmap(): boolean;
    static get canUseWorker(): boolean;
    static get canUseOffscreenCanvas(): boolean;
}
