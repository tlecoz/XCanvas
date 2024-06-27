import { Pt2D } from '../geom/Pt2D';
import { Rectangle2D } from '../geom/Rectangle2D';
import { Display2D } from './Display2D';
import { Stage2D } from './Stage2D';

export declare class Group2D extends Display2D {
    static CHILD_ADDED: string;
    static CHILD_REMOVED: string;
    protected _numChildren: number;
    protected _children: Display2D[];
    constructor();
    get dataString(): string;
    static fromDataString(data: string, target?: Group2D): Group2D;
    align(displayAlign?: Pt2D): void;
    updateBounds(): Rectangle2D;
    setStage(stage: Stage2D | null): void;
    appendChild(element: Display2D): Display2D;
    removeChild(element: Display2D): Display2D;
    get numChildren(): number;
    get children(): Display2D[];
    update(context: CanvasRenderingContext2D): DOMMatrix;
}
