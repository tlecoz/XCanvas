import { BorderPt } from './BorderPt';

export declare class BorderLine {
    start: BorderPt;
    end: BorderPt;
    points: BorderPt[];
    dist: number;
    sens: boolean;
    actif: boolean;
    private color;
    constructor(p0: BorderPt, p1: BorderPt);
    addPointToStart(pt: BorderPt): void;
    addPointToEnd(pt: BorderPt): void;
    findNearestPoint(px: number, py: number): BorderPt;
    draw(ctx: CanvasRenderingContext2D, offsetX?: number, offsetY?: number): void;
    getDistanceFromPoint(px: number, py: number): number;
    private distanceFromPointToLine;
    private orientationIsCorrect;
    lookForNearLines(lines: BorderLine[], a: number): void;
}
