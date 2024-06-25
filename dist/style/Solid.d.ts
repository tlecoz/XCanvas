import { SolidColor } from '../color/SolidColor';
import { Display2D } from '../display/Display2D';
import { FillStroke, Fillable } from './FillStroke';

export declare class Solid extends FillStroke {
    color: SolidColor;
    constructor(r?: number | SolidColor | string, g?: number, b?: number, a?: number);
    clone(cloneColor?: boolean, cloneLineStyle?: boolean, cloneTextStyle?: boolean, cloneTextLineStyle?: boolean): Solid;
    apply(context: CanvasRenderingContext2D, path: Fillable, target: Display2D): void;
}
