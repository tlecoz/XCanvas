import { Filter } from './Filter';

export declare class SaturateFilter extends Filter {
    constructor(intensity?: number);
    get dataString(): string;
    static fromDataString(data: string): SaturateFilter;
    get value(): string;
    clone(): SaturateFilter;
}
