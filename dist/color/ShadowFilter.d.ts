import { SolidColor } from './SolidColor';

export declare class ShadowFilter {
    static NO_SHADOW: ShadowFilter;
    solidColor: SolidColor;
    blur: number;
    offsetX: number;
    offsetY: number;
    constructor(solidColor: SolidColor, blur: number, offsetX: number, offsetY: number);
    apply(context2D: CanvasRenderingContext2D): void;
}
