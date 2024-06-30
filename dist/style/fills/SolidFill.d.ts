import { SolidColor } from '../../color/SolidColor';
import { Display2D } from '../../display/Display2D';
import { Path } from '../../graphics/Path';
import { Solid } from '../Solid';

export declare class SolidFill extends Solid {
    constructor(r?: number | SolidColor | string, g?: number, b?: number, a?: number);
    clone(): SolidFill;
    get dataString(): string;
    static fromDataString(data: string): SolidFill;
    apply(context: CanvasRenderingContext2D, path: Path, target: Display2D): void;
}
