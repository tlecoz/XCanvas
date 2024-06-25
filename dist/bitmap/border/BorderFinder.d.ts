import { Geometry } from '../../graphics/Geometry';
import { BitmapData } from '../BitmapData';
import { BorderPt } from './BorderPt';

export declare class BorderFinder {
    private static _instance;
    private static offsetX;
    private static offsetY;
    borderPoints: BorderPt[];
    directions: string;
    private bd;
    private center;
    private pt;
    private diago;
    private n;
    private tab;
    private count;
    private working;
    private firstId;
    private directionDatas;
    private offsetX;
    private offsetY;
    private _width;
    private bug;
    private pixelUsed;
    private radian;
    private trackCol;
    private holeBd;
    constructor();
    reset(): void;
    static get instance(): BorderFinder;
    get holePicture(): BitmapData;
    getOutsideBorder(source: BitmapData): BorderPt[];
    createGraphicsGeometryFromBitmapData(source: BitmapData, firstPassPrecision?: number, fitCurvePrecision?: number): Geometry;
    getBorderFromBitmapData(source: BitmapData, trackColor?: boolean, colorTracked?: {
        r: number;
        g: number;
        b: number;
        a: number;
    }, areaRect?: {
        x: number;
        y: number;
        w: number;
        h: number;
    }, secondPass?: boolean, borderX?: number, borderY?: number): BorderPt[];
    private returnAngle;
    private getBorder;
    private getBorderColorTracking;
    getNumberOfHoles(source: BitmapData): number;
    getHoleBorders(source: BitmapData): BorderPt[][];
    debugBorder(ctx: CanvasRenderingContext2D, border: BorderPt[], strokeStyle?: string, b?: boolean, px?: number, py?: number): void;
}
