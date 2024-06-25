import { BitmapData } from '../../bitmap/BitmapData';
import { Display2D } from '../../display/Display2D';
import { Path } from '../../graphics/Path';
import { FillStroke } from '../FillStroke';

export declare class BitmapFill extends FillStroke {
    bd: BitmapData;
    centerInto: boolean;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    constructor(bd: BitmapData, centerInto?: boolean);
    get dataString(): string;
    static fromDataString(data: string): BitmapFill;
    clone(cloneMedia?: boolean, cloneLineStyle?: boolean): BitmapFill;
    apply(context: CanvasRenderingContext2D, path: Path, target: Display2D): void;
}
