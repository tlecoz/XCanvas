import { GradientColor } from '../../color/GradientColor';
import { Display2D } from '../../display/Display2D';
import { Path } from '../../graphics/Path';
import { Gradient } from '../Gradient';
import { LineStyle } from '../LineStyle';

export declare class GradientStroke extends Gradient {
    constructor(gradient: GradientColor, isLinear?: boolean, lineStyle?: LineStyle);
    get dataString(): string;
    static fromDataString(data: string): GradientStroke;
    apply(context: CanvasRenderingContext2D, path: Path, target: Display2D): void;
}
