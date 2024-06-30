import { BitmapData } from '../../bitmap/BitmapData';
import { Display2D } from '../../display/Display2D';
import { Path } from '../../graphics/Path';
import { FillStroke } from '../FillStroke';

export declare class BitmapCacheFill extends FillStroke {
    bd: BitmapData;
    constructor(bd: BitmapData, centerInto?: boolean);
    clone(): BitmapCacheFill;
    get width(): number;
    get height(): number;
    apply(context: CanvasRenderingContext2D, path: Path, target: Display2D): void;
}
