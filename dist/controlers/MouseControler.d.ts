import { EventDispatcher } from '../events/EventDispatcher';

export declare class MouseControler extends EventDispatcher {
    x: number;
    y: number;
    isDown: boolean;
    htmlCanvas: HTMLCanvasElement;
    constructor(canvas: HTMLCanvasElement);
    down(x: number, y: number): void;
    move(x: number, y: number): void;
    up(x: number, y: number): void;
    click(x: number, y: number): void;
    doubleClick(x: number, y: number): void;
    getMouseXY(e: any): void;
}
