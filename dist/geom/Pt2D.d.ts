export declare class Pt2D {
    x: number;
    y: number;
    isCurveAnchor: boolean;
    static X: Pt2D;
    static Y: Pt2D;
    static ZERO: Pt2D;
    constructor(x?: number, y?: number, isCurveAnchor?: boolean);
    clone(): Pt2D;
    equals(pt: Pt2D): boolean;
    add(pt: Pt2D): Pt2D;
    substract(pt: Pt2D): Pt2D;
    multiply(pt: Pt2D): Pt2D;
    divide(pt: Pt2D): Pt2D;
    normalize(): Pt2D;
    dot(pt: Pt2D): number;
    greaterThan(pt: Pt2D): boolean;
    static distance(a: Pt2D, b: Pt2D): number;
}
