import { BorderPt } from '../BorderPt';

export declare class BorderVectorizer {
    private static _instance;
    private sourcePoints;
    private firstPt;
    private scale;
    private nbPointMax;
    points: BorderPt[];
    width: number;
    height: number;
    minX: number;
    minY: number;
    constructor();
    static get instance(): BorderVectorizer;
    init(maxPointWanted: number, borderPoints: BorderPt[]): BorderPt[];
    removeNearestPoints(a: number): void;
    process(): void;
    protected getBackOriginalScale(): void;
    protected rescaleBorderBeforeSimplificationIfPictureIsTooSmall(forceScale?: number): void;
    removeSmallLines(minDist: number, direction: boolean, maxRemove?: number): BorderPt[];
    removeNearLine(limit: number, maxRemove?: number): BorderPt[];
    private sortDist;
    private sortId;
    removeNearLine2(limit: number, maxRemove?: number): BorderPt[];
}
