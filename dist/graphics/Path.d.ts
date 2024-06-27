import { RegisterableObject } from '../utils/RegisterableObject';
import { Geometry } from './Geometry';

export declare class Path extends RegisterableObject {
    static objByType: {
        count: number;
        func: (...arg: any[]) => void;
        endXY: number;
        countOffset: number;
        useRadius: boolean;
    }[];
    protected _path: Path2D;
    protected _originalW: number;
    protected _originalH: number;
    protected _originalX: number;
    protected _originalY: number;
    protected _geom: Geometry;
    protected datas: number[];
    protected bounds: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    constructor(pathData?: number[]);
    get dataString(): string;
    static fromDataString(data: string): Path;
    newPath(): Path2D;
    isPointInPath(context: CanvasRenderingContext2D, px: number, py: number, fillrule?: CanvasFillRule): boolean;
    isPointInStroke(context: CanvasRenderingContext2D, px: number, py: number): boolean;
    isPointInside(context: any, px: number, py: number, isStroke: boolean, fillrule?: string): boolean;
    get originalW(): number;
    get originalH(): number;
    get originalX(): number;
    get originalY(): number;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    circle(x: number, y: number, radius: number): void;
    quadraticCurveTo(ax: number, ay: number, x: number, y: number): void;
    rect(x: number, y: number, w: number, h: number): void;
    arc(x: number, y: number, radius: number, startAngle?: number, endAngle?: number): void;
    arcTo(x0: number, y0: number, x1: number, y1: number, radius: number): void;
    bezierCurveTo(ax0: number, ay0: number, ax1: number, ay1: number, x1: number, y1: number): void;
    private static moveTo;
    private static lineTo;
    private static circle;
    private static rect;
    private static quadraticCurveTo;
    private static arc;
    private static arcTo;
    private static bezierCurveTo;
    get path(): Path2D;
    get geometry(): Geometry;
    get pathDatas(): number[];
    computePath(): Geometry;
}
