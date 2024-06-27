import { BorderPt } from '../BorderPt';

export declare class FitCurve {
    constructor();
    static borderToCurve(border: BorderPt[], maxError?: number, progressCallback?: () => void): number[][][];
    static drawCurves(ctx: CanvasRenderingContext2D, curves: number[][][]): void;
    static fitCurve(points: number[][], maxError?: number, progressCallback?: () => void): number[][][];
    private static fitCubic;
    private static generateAndReport;
    private static generateBezier;
    private static reparameterize;
    private static newtonRaphsonRootFind;
    private static chordLengthParameterize;
    private static computeMaxError;
    private static mapTtoRelativeDistances;
    private static find_t;
    private static createTangent;
    private static zeros_Xx2x2;
    private static mulItems;
    private static mulMatrix;
    private static subtract;
    private static addArrays;
    private static addItems;
    private static sum;
    private static dot;
    private static vectorLen;
    private static divItems;
    private static squareItems;
    private static normalize;
    private static q;
    private static qprime;
    private static qprimeprime;
}
