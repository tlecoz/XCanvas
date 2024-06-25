import { EventDispatcher } from '../events/EventDispatcher';

export declare class SolidColor extends EventDispatcher {
    static UPDATE_STYLE: string;
    static INVISIBLE_COLOR: SolidColor;
    protected _r: number;
    protected _g: number;
    protected _b: number;
    protected _a: number;
    protected _style: string | undefined;
    protected useAlpha: boolean;
    constructor(r: number | string, g?: number, b?: number, a?: number);
    clone(): SolidColor;
    get dataString(): string;
    static fromDataString(data: string): SolidColor;
    get r(): number;
    set r(n: number);
    get g(): number;
    set g(n: number);
    get b(): number;
    set b(n: number);
    get a(): number;
    set a(n: number);
    setRGB(r: number, g: number, b: number): void;
    setRGBA(r: number, g: number, b: number, a: number): void;
    createBrighterColor(pct: number): SolidColor;
    createDarkerColor(pct: number): SolidColor;
    protected updateStyle(dispatchEvent?: boolean): void;
    get style(): string | undefined;
}
