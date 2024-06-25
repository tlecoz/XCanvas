import { Filter } from './Filter';

export declare class InvertFilter extends Filter {
    constructor(intensity?: number);
    get dataString(): string;
    static fromDataString(data: string): InvertFilter;
    get value(): string;
    clone(): InvertFilter;
}
