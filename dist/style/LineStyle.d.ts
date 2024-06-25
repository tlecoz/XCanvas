import { Display2D } from '../display/Display2D';
import { RegisterableObject } from '../utils/RegisterableObject';
import { Fillable } from './FillStroke';

export declare class LineStyle extends RegisterableObject {
    cap: "butt" | "round" | "square";
    dashOffset: number;
    dashLineDist: number;
    dashHoleDist: number;
    join: "bevel" | "round" | "miter";
    lineWidth: number;
    miterLimit: number;
    allowScaleTransform: boolean;
    constructor(lineWidth?: number);
    get dataString(): string;
    static fromDataString(data: string): LineStyle;
    clone(): LineStyle;
    apply(context: CanvasRenderingContext2D, path: Fillable, target: Display2D): void;
}
