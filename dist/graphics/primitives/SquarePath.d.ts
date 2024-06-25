import { Path } from '../Path';

export declare class SquarePath extends Path {
    private static _instance;
    constructor();
    static get instance(): SquarePath;
    static get path(): Path2D;
}
