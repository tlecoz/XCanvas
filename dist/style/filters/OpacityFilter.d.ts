import { Filter } from './Filter';

export declare class OpacityFilter extends Filter {
    constructor(intensity?: number);
    get dataString(): string;
    static fromDataString(data: string): OpacityFilter;
    get value(): string;
    clone(): OpacityFilter;
}
