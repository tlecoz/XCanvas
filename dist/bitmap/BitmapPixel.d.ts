import { SolidColor } from '../color/SolidColor';

export declare class BitmapPixel {
    private static _instance;
    protected pixelData: Uint8ClampedArray;
    protected w: number;
    protected h: number;
    protected id: number;
    constructor();
    static get instance(): BitmapPixel;
    init(pixelData: Uint8ClampedArray, w: number, h: number): BitmapPixel;
    getPixelObject(x: number, y: number): BitmapPixel;
    setRGB(x: number, y: number, r: number, g: number, b: number): void;
    setRGBA(x: number, y: number, r: number, g: number, b: number, a: number): void;
    setSolidColorPixel(x: number, y: number, solidColor: SolidColor): void;
    copyIntoSolidColor(x: number, y: number, solidColor: SolidColor): void;
    get r(): number;
    get g(): number;
    get b(): number;
    get a(): number;
    set r(n: number);
    set g(n: number);
    set b(n: number);
    set a(n: number);
}
