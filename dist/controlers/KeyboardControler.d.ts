import { EventDispatcher } from '../events/EventDispatcher';

export declare class KeyboardControler extends EventDispatcher {
    isDown: boolean[];
    keyCode: number;
    constructor();
    keyIsDown(keyCode: number): boolean;
}
