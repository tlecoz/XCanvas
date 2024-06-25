import { Filter } from './Filter';

export declare class BlurFilter extends Filter {
    constructor(intensity?: number);
    get dataString(): string;
    static fromDataString(data: string): BlurFilter;
    clone(): BlurFilter;
    get value(): string;
}
