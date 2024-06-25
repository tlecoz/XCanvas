export declare class EarCutting {
    private static _instance;
    private CONCAVE;
    private CONVEX;
    private indices;
    private vertices;
    private vertexCount;
    private vertexTypes;
    private triangles;
    constructor();
    static get instance(): EarCutting;
    private computeSpannedAreaSign;
    private previousIndex;
    private nextIndex;
    private classifyVertex;
    private areVerticesClockwise;
    private isEarTip;
    private findEarTip;
    private cutEarTip;
    private triangulate;
    private _computeTriangles;
    computeTriangles(arrayXY: number[]): any;
}
