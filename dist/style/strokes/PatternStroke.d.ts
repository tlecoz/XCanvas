import { BitmapData } from '../../bitmap/BitmapData';
import { Display2D } from '../../display/Display2D';
import { Path } from '../../graphics/Path';
import { LineStyle } from '../LineStyle';
import { Pattern } from '../Pattern';

export declare class PatternStroke extends Pattern {
    constructor(source: BitmapData, crop?: boolean, applyTargetScale?: boolean, lineStyle?: LineStyle);
    get dataString(): string;
    static fromDataString(data: string): PatternStroke;
    apply(context: CanvasRenderingContext2D, path: Path, target: Display2D): void;
}
