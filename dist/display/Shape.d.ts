import { RegisterableObject } from '../utils/RegisterableObject';
import { Display2D } from './Display2D';
import { RenderStack } from './RenderStack';

export declare class Shape extends RegisterableObject {
    x: number;
    y: number;
    w: number;
    h: number;
    private renderStack;
    constructor(x: number, y: number, w: number, h: number, renderStack: RenderStack);
    get dataString(): string;
    static fromDataString(data: string): Shape;
    apply(context: CanvasRenderingContext2D, target: Display2D, mouseX?: number, mouseY?: number): boolean;
}
