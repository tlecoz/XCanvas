import { SolidColor } from '../../../color/SolidColor';
import { Display2D } from '../../../display/Display2D';
import { Solid } from '../../Solid';
import { TextStyle } from '../../TextStyle';
import { TextPath } from '../TextPath';

export declare class SolidTextFill extends Solid {
    constructor(textStyle: TextStyle, r?: number | SolidColor | string, g?: number, b?: number, a?: number);
    get dataString(): string;
    static fromDataString(data: string): SolidTextFill;
    apply(context: CanvasRenderingContext2D, path: TextPath, target: Display2D): void;
}
