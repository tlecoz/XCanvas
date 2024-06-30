import { GradientColor } from '../../../color/GradientColor';
import { Display2D } from '../../../display/Display2D';
import { Gradient } from '../../Gradient';
import { TextStyle } from '../../TextStyle';
import { TextPath } from '../TextPath';

export declare class GradientTextFill extends Gradient {
    constructor(textStyle: TextStyle, gradient: GradientColor, isLinear?: boolean);
    clone(): GradientTextFill;
    get dataString(): string;
    static fromDataString(data: string): GradientTextFill;
    apply(context: CanvasRenderingContext2D, path: TextPath, target: Display2D): void;
}
