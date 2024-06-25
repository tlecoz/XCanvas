import { EventDispatcher } from '../events/EventDispatcher';
import { MouseControler } from './MouseControler';
import { Touche } from './Touche';

export declare class TouchControler extends EventDispatcher {
    tapTimeLimit: number;
    doubleTimeLimit: number;
    swipeTimeLimit: number;
    lastTapTime: number;
    protected startDist: number;
    protected startAngle: number;
    protected mouse: any;
    protected zoom: number;
    protected rotation: number;
    protected firstPoint: any;
    protected secondPoint: any;
    protected actifPoints: any[];
    protected touches: Touche[];
    protected indexs: number[];
    protected touchX: number;
    protected touchY: number;
    protected nbTouch: number;
    protected lastTouch: Touche;
    protected htmlCanvas: HTMLCanvasElement;
    constructor(htmlCanvas: HTMLCanvasElement, mouseControler: MouseControler);
    private initSecondPoint;
}
