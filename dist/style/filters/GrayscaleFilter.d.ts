import { Filter } from './Filter';

export declare class GrayscaleFilter extends Filter {
    constructor(intensity?: number);
    get dataString(): string;
    static fromDataString(data: string): GrayscaleFilter;
    clone(): GrayscaleFilter;
    get value(): string;
}
