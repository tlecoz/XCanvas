import { Display2D } from './Display2D';
import { Stage2D } from './Stage2D';

export declare class Group2D extends Display2D {
    protected _numChildren: number;
    protected _children: Display2D[];
    constructor();
    get dataString(): string;
    static fromDataString(data: string, target?: Group2D): Group2D;
    setStage(stage: Stage2D | null): void;
    appendChild(element: Display2D): Display2D;
    removeChild(element: Display2D): Display2D;
    get numChildren(): number;
    get children(): Display2D[];
    update(context: CanvasRenderingContext2D): DOMMatrix;
}
