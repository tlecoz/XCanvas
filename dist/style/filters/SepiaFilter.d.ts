import { Filter } from './Filter';

export declare class SepiaFilter extends Filter {
    constructor(intensity?: number);
    get dataString(): string;
    static fromDataString(data: string): SepiaFilter;
    get value(): string;
    clone(): SepiaFilter;
}
