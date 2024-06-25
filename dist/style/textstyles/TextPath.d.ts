import { RegisterableObject } from '../../utils/RegisterableObject';

export declare class TextPath extends RegisterableObject {
    text: string;
    constructor(text: string);
    get dataString(): string;
    static fromDataString(data: string): TextPath;
    isPointInside(context: any, px: number, py: number, isStroke: boolean, fillrule?: string): boolean;
    isPointInPath(context: CanvasRenderingContext2D, px: number, py: number): boolean;
    isPointInStroke(context: CanvasRenderingContext2D, px: number, py: number): boolean;
}
