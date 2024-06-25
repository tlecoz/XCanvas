import { SolidColor } from '../../color/SolidColor';
import { DropShadowFilter } from './DropShadowFilter';

export declare class GlowFilter extends DropShadowFilter {
    constructor(radius: number, color: SolidColor | string);
    get dataString(): string;
    static fromDataString(data: string): GlowFilter;
    clone(cloneColor?: boolean): GlowFilter;
}
