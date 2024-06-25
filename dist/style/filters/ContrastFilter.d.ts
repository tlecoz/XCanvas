import { Filter } from './Filter';

export declare class ContrastFilter extends Filter {
    constructor(intensity?: number);
    get dataString(): string;
    static fromDataString(data: string): ContrastFilter;
    clone(): ContrastFilter;
    get value(): string;
}
