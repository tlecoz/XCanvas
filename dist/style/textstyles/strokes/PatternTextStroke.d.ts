import { BitmapData } from '../../../bitmap/BitmapData';
import { Display2D } from '../../../display/Display2D';
import { Pattern } from '../../Pattern';
import { TextStyle } from '../../TextStyle';
import { TextPath } from '../TextPath';

export declare class PatternTextStroke extends Pattern {
    constructor(textStyle: TextStyle, bd: BitmapData, centerInto?: boolean, applyTargetScale?: boolean);
    clone(): PatternTextStroke;
    get dataString(): string;
    static fromDataString(data: string): PatternTextStroke;
    apply(context: CanvasRenderingContext2D, path: TextPath, target: Display2D): void;
}
