import { GradientColor } from '../../color/GradientColor';
import { Display2D } from '../../display/Display2D';
import { Path } from '../../graphics/Path';
import { Gradient } from '../Gradient';

export declare class GradientFill extends Gradient {
    constructor(gradient: GradientColor);
    get dataString(): string;
    static fromDataString(data: string): GradientFill;
    apply(context: CanvasRenderingContext2D, path: Path, target: Display2D): void;
}
