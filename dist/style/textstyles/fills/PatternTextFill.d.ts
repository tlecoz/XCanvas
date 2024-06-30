import { BitmapData } from '../../../bitmap/BitmapData';
import { Display2D } from '../../../display/Display2D';
import { Pattern } from '../../Pattern';
import { TextStyle } from '../../TextStyle';
import { TextPath } from '../TextPath';

export declare class PatternTextFill extends Pattern {
    constructor(textStyle: TextStyle, bd: BitmapData, crop?: boolean, applyTargetScale?: boolean);
    clone(): PatternTextFill;
    get dataString(): string;
    static fromDataString(data: string): PatternTextFill;
    apply(context: CanvasRenderingContext2D, path: TextPath, target: Display2D): void;
}
