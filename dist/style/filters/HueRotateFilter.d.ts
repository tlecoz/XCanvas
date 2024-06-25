import { Filter } from './Filter';

export declare class HueRotateFilter extends Filter {
    constructor(angle?: number);
    get dataString(): string;
    static fromDataString(data: string): HueRotateFilter;
    get value(): string;
    clone(): HueRotateFilter;
}
