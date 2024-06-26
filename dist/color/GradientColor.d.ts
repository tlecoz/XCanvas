import { Display2D } from '../display/Display2D';
import { BasicEvent, EventDispatcher } from '../events/EventDispatcher';
import { SolidColor } from './SolidColor';

export declare class GradientColor extends EventDispatcher {
    static UPDATE_STYLE: string;
    protected colors: SolidColor[] | null;
    protected ratios: number[] | null;
    protected nbStep: number;
    protected x0: number;
    protected y0: number;
    protected r0: number;
    protected x1: number;
    protected y1: number;
    protected r1: number;
    protected style: CanvasGradient | null;
    protected ctx: CanvasRenderingContext2D | null;
    protected onUpdateStyle: (e?: BasicEvent) => void | null;
    dirty: boolean;
    isLinear: boolean;
    scaleX: number;
    scaleY: number;
    x: number;
    y: number;
    rotation: number;
    radialFlareX: number;
    radialFlareY: number;
    radialFlareStrength: number;
    _scaleX: number;
    _scaleY: number;
    _x: number;
    _y: number;
    _rotation: number;
    _radialFlareX: number;
    _radialFlareY: number;
    _radialFlareStrength: number;
    constructor(colors?: SolidColor[] | null, ratios?: number[] | null, isLinear?: boolean);
    get dataString(): string;
    static fromDataString(data: string): GradientColor;
    clone(cloneColors?: boolean): GradientColor | null;
    transformValues(x?: number, y?: number, scaleX?: number, scaleY?: number, rotation?: number, flareX?: number, flareY?: number, flareStrength?: number): void;
    initFromPoints(x0: number, y0: number, x1: number, y1: number, r0?: number, r1?: number): void;
    initLinearFromRect(x: number, y: number, w: number, h: number, angle: number): void;
    initRadialFromRect(x: number, y: number, w: number, h: number, radialFlareX?: number, radialFlareY?: number, flareStrength?: number): void;
    setColorStep(colors: SolidColor[], ratios?: number[]): void;
    addColorStep(ratio: number, r?: number | string, g?: number, b?: number, a?: number): SolidColor | null;
    getColorById(id: number): SolidColor | null;
    setColorById(id: number, color: SolidColor): string;
    getRatioById(id: number): number;
    setRatioById(id: number, ratio: number): void;
    getGradientStyle(context2D: CanvasRenderingContext2D, target?: Display2D): CanvasGradient | null;
}
