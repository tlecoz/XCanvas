import { Pt2D } from './Pt2D';

export declare class RectBounds {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    protected points: Pt2D[];
    protected nbPoint: number;
    private static rect;
    constructor();
    reset(): void;
    addPoint(px: number, py: number, registerPoint?: boolean): void;
    addRect(minX: number, minY: number, maxX: number, maxY: number): void;
    drawBounds(context2D: CanvasRenderingContext2D): void;
    get x(): number;
    get y(): number;
    get width(): number;
    get height(): number;
    static getBounds(xAxis: number, yAxis: number, w: number, h: number, rotation: number): RectBounds;
}
