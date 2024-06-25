import { Display2D } from '../display/Display2D';
import { EventDispatcher } from '../events/EventDispatcher';
import { Rectangle2D } from '../geom/Rectangle2D';
import { BitmapPixel } from './BitmapPixel';

export declare class BitmapData extends EventDispatcher {
    static IMAGE_LOADED: string;
    private static abstractCanvas;
    private static abstractContext;
    offsetX: number;
    offsetY: number;
    pixel: BitmapPixel;
    needsUpdate: boolean;
    protected _maskTemp: BitmapData;
    protected _filterTemp: any;
    protected _imageData: ImageData;
    protected pixels: Uint8ClampedArray;
    protected pixelDataDirty: boolean;
    protected useAlphaChannel: boolean;
    protected sourceUrl: string;
    protected _savedData: {
        data: ImageData;
        w: number;
        h: number;
    };
    protected ctx: CanvasRenderingContext2D;
    protected canvas: HTMLCanvasElement;
    constructor(w?: number, h?: number, cssColor?: string);
    get htmlCanvas(): HTMLCanvasElement | ImageBitmap;
    get context(): CanvasRenderingContext2D;
    saveData(): void;
    restoreData(clearSavedData?: boolean): void;
    setPadding(left?: number, right?: number, top?: number, bottom?: number): void;
    createImageBitmap(): Promise<ImageBitmap>;
    get width(): number;
    set width(n: number);
    get height(): number;
    set height(n: number);
    getImageData(x: number, y: number, w: number, h: number): ImageData;
    putImageData(data: ImageData, x: number, y: number): void;
    drawDisplayElement(displayElement: Display2D, matrix?: DOMMatrix): void;
    drawHtmlCode(htmlCodeSource: string, x: number, y: number, w: number, h: number): void;
    clone(): BitmapData;
    resize(w: number, h: number, resultBd?: BitmapData): BitmapData;
    resizeWithAntialazing(w: number, h: number, resultBd: BitmapData): BitmapData;
    get pixelView(): BitmapPixel;
    tint(r: number, g: number, b: number, a?: number): void;
    fillRect(x: number, y: number, w: number, h: number, cssColor: string): void;
    get pixelData(): Uint8ClampedArray;
    getPixels(x: number, y: number, w: number, h: number): Uint8ClampedArray;
    getPixel(x: number, y: number): {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    getPixelRGBIntColor(x: number, y: number): number;
    getPixelRGBAIntColor(x: number, y: number): number;
    getPixelRed(x: number, y: number): number;
    getPixelGreen(x: number, y: number): number;
    getPixelBlue(x: number, y: number): number;
    getPixelAlpha(x: number, y: number): number;
    clear(): void;
    applyFilter(cssFilterStr: string): void;
    drawImage(img: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap, srcX?: number, srcY?: number, srcW?: number, srcH?: number, destX?: number, destY?: number, destW?: number, destH?: number): void;
    setImageData(imgData: ImageData, x: number, y: number): void;
    applyImageData(): void;
    floodFillRGBAandReturnOutputCanvas(x: number, y: number, fillR: number, fillG: number, fillB: number, fillA?: number): BitmapData;
    floodFillRGBA(x: number, y: number, fillR: number, fillG: number, fillB: number, fillA?: number): {
        pixels: {
            x: number;
            y: number;
        }[][];
        bounds: Rectangle2D;
    };
    matchColor(x: number, y: number, r: number, g: number, b: number, a: number): boolean;
    matchRed(x: number, y: number, value: number): boolean;
    matchGreen(x: number, y: number, value: number): boolean;
    matchBlue(x: number, y: number, value: number): boolean;
    matchAlpha(x: number, y: number, value: number): boolean;
    isOpaque(x: number, y: number): boolean;
    getColorBoundRect(areaX: number, areaY: number, areaW: number, areaH: number, r: number, g: number, b: number, a: number, tolerance?: number, toleranceG?: number, toleranceB?: number, toleranceA?: number): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    getRedChannelBoundRect(areaX: number, areaY: number, areaW: number, areaH: number, channelMin: number, channelMax: number): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    getGreenChannelBoundRect(areaX: number, areaY: number, areaW: number, areaH: number, channelMin: number, channelMax: number): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    getBlueChannelBoundRect(areaX: number, areaY: number, areaW: number, areaH: number, channelMin: number, channelMax: number): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    getAlphaChannelBoundRect(areaX: number, areaY: number, areaW: number, areaH: number, channelMin: number, channelMax: number): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    getChannelBoundRect(areaX: number, areaY: number, areaW: number, areaH: number, channelMin: number, channelMax: number, channelId?: number): {
        x: number;
        y: number;
        w: number;
        h: number;
    };
}
