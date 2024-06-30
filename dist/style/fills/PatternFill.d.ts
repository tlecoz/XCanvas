import { BitmapData } from '../../bitmap/BitmapData';
import { Display2D } from '../../display/Display2D';
import { Path } from '../../graphics/Path';
import { Pattern } from '../Pattern';

export declare class PatternFill extends Pattern {
    constructor(source: BitmapData, crop?: boolean, applyTargetScale?: boolean);
    clone(): PatternFill;
    get dataString(): string;
    static fromDataString(data: string): PatternFill;
    apply(context: CanvasRenderingContext2D, path: Path, target: Display2D): void;
}
