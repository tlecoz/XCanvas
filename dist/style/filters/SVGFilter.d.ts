import { Filter } from './Filter';

export declare class SVGFilter extends Filter {
    protected _url: string;
    constructor(url: string);
    get dataString(): string;
    static fromDataString(data: string): SVGFilter;
    get url(): string;
    set url(n: string);
    get value(): string;
    clone(): SVGFilter;
}
