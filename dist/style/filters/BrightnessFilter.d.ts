import { Filter } from './Filter';

export declare class BrightnessFilter extends Filter {
    constructor(intensity?: number);
    get dataString(): string;
    static fromDataString(data: string): BrightnessFilter;
    clone(): BrightnessFilter;
    get value(): string;
}
