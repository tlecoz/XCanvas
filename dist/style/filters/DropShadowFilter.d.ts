import { SolidColor } from '../../color/SolidColor';
import { Filter } from './Filter';

export declare class DropShadowFilter extends Filter {
    constructor(offsetX: number, offsetY: number, radius: number, color: SolidColor | string);
    get dataString(): string;
    static fromDataString(data: string): DropShadowFilter;
    clone(cloneColor?: boolean): DropShadowFilter;
    get value(): string;
}
