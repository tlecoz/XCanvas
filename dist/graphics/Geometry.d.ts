import { Display2D } from '../display/Display2D';
import { Rectangle2D } from '../geom/Rectangle2D';
import { Path } from './Path';

export declare class Geometry {
    static curvePointMax: number;
    static curvePointDistance: number;
    private oldX;
    private oldY;
    private minX;
    private minY;
    private maxX;
    private maxY;
    protected _shapeBounds: {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    }[];
    protected _boundPoints: DOMPoint[][];
    protected _shapePoints: DOMPoint[];
    protected _shapeXYs: number[][];
    protected _shapeXY: number[];
    protected _nbShape: number;
    protected _nbBoundPoint: number;
    protected _indexs: number[][];
    protected firstPoint: any;
    protected lastPoint: any;
    constructor(path?: Path);
    get trianglePoints(): any;
    get triangleIndexs(): any;
    getBounds(target: Display2D, offsetW: number, offsetH: number): Rectangle2D;
    getPoints(pathDatas: number[]): void;
    triangulate(): void;
    endProcess(): void;
    defineNewShape(): void;
    registerPoint(px: number, py: number): void;
    moveTo(px: number, py: number): void;
    lineTo(px: number, py: number): void;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    arc(px: number, py: number, radius: number, startAngle: number, endAngle: number): void;
    circle(px: number, py: number, radius: number): void;
    rect(x: number, y: number, w: number, h: number): void;
    getQuadraticCurveLength(ax: number, ay: number, x1: number, y1: number): number;
    quadraticCurveTo(ax: number, ay: number, x1: number, y1: number): void;
    getBezierCurveLength(ax0: number, ay0: number, ax1: number, ay1: number, x1: number, y1: number): number;
    bezierCurveTo(ax0: number, ay0: number, ax1: number, ay1: number, x1: number, y1: number): void;
}
