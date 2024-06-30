import { SolidColor } from '../../color/SolidColor';
import { Display2D } from '../../display/Display2D';
import { Path } from '../../graphics/Path';
import { LineStyle } from '../LineStyle';
import { Solid } from '../Solid';

export declare class SolidStroke extends Solid {
    constructor(r?: number | SolidColor | string, g?: number | LineStyle, b?: number, a?: number, lineStyle?: LineStyle);
    clone(): SolidStroke;
    get dataString(): string;
    static fromDataString(data: string): SolidStroke;
    apply(context: CanvasRenderingContext2D, path: Path, target: Display2D): void;
}
