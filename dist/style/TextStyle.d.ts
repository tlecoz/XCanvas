import { Display2D } from '../display/Display2D';
import { RegisterableObject } from '../utils/RegisterableObject';
import { LineStyle } from './LineStyle';
import { TextPath } from './textstyles/TextPath';

export declare class TextStyle extends RegisterableObject {
    fontName: string;
    fontSize: number;
    sizeMeasure: string;
    offsetX: number;
    offsetY: number;
    lineStyle: LineStyle | null;
    allowScaleTransform: boolean;
    constructor(fontName: string, fontSize: number, sizeMeasure?: string, offsetX?: number, offsetY?: number, allowScaleTransform?: boolean, lineStyle?: LineStyle);
    get dataString(): string;
    static fromDataString(data: string): TextStyle;
    clone(cloneTextLineStyle?: boolean): TextStyle;
    apply(context: CanvasRenderingContext2D, path: TextPath, target: Display2D): void;
}
