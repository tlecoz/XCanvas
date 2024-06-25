import { Path } from '../Path';

export declare class CirclePath extends Path {
    private static _instance;
    constructor();
    static get instance(): CirclePath;
    static get path(): Path2D;
}
