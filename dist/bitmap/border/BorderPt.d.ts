import { Pt2D } from '../../geom/Pt2D';

export declare class BorderPt extends Pt2D {
    id: number;
    dist: number;
    next: BorderPt | null;
    prev: BorderPt | null;
    isQuadPoint: boolean;
    constructor(x: number, y: number, id: number);
    clone(): BorderPt;
    distanceTo(pt: BorderPt): number;
    distance(px: number, py: number): number;
    angleTo(pt: BorderPt): number;
}
