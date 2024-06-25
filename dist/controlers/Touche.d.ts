import { EventDispatcher } from '../events/EventDispatcher';

export declare class Touche extends EventDispatcher {
    x: number;
    y: number;
    vx: number;
    vy: number;
    actif: boolean;
    firstPoint: boolean;
    swipeId: number;
    startTime: number;
    lifeTime: number;
    constructor();
    start(x: number, y: number): void;
    end(x: number, y: number): void;
    move(x: number, y: number): void;
    isTap(timeLimit: number): boolean;
}
