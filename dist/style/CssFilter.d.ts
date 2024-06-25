export declare class CssFilter {
    filter: string;
    offsetX: number;
    offsetY: number;
    constructor(cssFilterValue?: string);
    clear(): void;
    dropShadow(offsetX: number, offsetY: number, radius: number, color: string): CssFilter;
    blur(intensity: number): CssFilter;
    halo(intensity: number, color?: string): CssFilter;
    brightness(intensity?: number): CssFilter;
    contrast(intensity?: number): CssFilter;
    grayscale(intensity?: number): CssFilter;
    hueRotate(angleInDegree?: number): CssFilter;
    invert(intensity?: number): CssFilter;
    opacity(intensity?: number): CssFilter;
    saturate(intensity?: number): CssFilter;
    sepia(intensity?: number): CssFilter;
}
