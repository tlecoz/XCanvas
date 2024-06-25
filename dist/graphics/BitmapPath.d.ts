import { BitmapData } from '../bitmap/BitmapData';
import { BorderPt } from '../bitmap/border/BorderPt';
import { Path } from './Path';

export declare class BitmapPath extends Path {
    protected _outsideBitmap: BorderPt[] | null;
    protected _holeBitmap: BorderPt[][] | null;
    protected _outsideVector: BorderPt[] | null;
    protected _holeVector: BorderPt[][] | null;
    protected _outsideCurves: number[][][] | null;
    protected _holeCurves: number[][][][] | null;
    protected bd: BitmapData;
    protected precision: number;
    protected curveSmooth: number;
    constructor(bd: BitmapData, percentOfTheOriginal?: number, curveSmooth?: number);
    updateBitmapBorders(): void;
    vectorize(percentOfTheOriginal?: number): void;
    convertLinesToCurves(smoothLevel?: number): void;
    private generatePath;
    private drawLines;
    private drawCurves;
    get outsideBitmap(): BorderPt[] | null;
    get holeBitmap(): BorderPt[][] | null;
    get outsideVector(): BorderPt[] | null;
    get holeVector(): BorderPt[][] | null;
    get outsideCurves(): number[][][] | null;
    get holeCurves(): number[][][][] | null;
}
