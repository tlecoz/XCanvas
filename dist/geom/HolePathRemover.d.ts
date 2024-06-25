import { BitmapData } from '../bitmap/BitmapData';
import { BorderPt } from '../bitmap/border/BorderPt';

export declare class HolePathRemover {
    private static _instance;
    debug: BitmapData;
    outside: BorderPt[] | null;
    private grid;
    private cells;
    private gridSize;
    quads: any[] | null;
    constructor();
    static get instance(): HolePathRemover;
    drawQuads(): void;
    drawPath(pct: number, color?: string): void;
    private findClosestPoints;
    init(outside: BorderPt[], precision?: number): void;
    private getCellAround;
    private findClosestPoints2;
    addHole(hole: BorderPt[], precision?: number): BorderPt[];
}
