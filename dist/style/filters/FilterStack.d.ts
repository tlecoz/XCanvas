import { IDirty } from '../../events/IDirty';
import { RegisterableObject } from '../../utils/RegisterableObject';
import { Filter } from './Filter';

export declare class FilterStack extends RegisterableObject implements IDirty {
    protected first: Filter;
    protected last: Filter;
    protected _value: string;
    dirty: boolean;
    boundOffsetW: number;
    boundOffsetH: number;
    constructor();
    clear(): void;
    clone(cloneFilters?: boolean): FilterStack;
    get value(): string;
    get dataString(): string;
    static fromDataString(data: string): FilterStack;
    add(filter: Filter): FilterStack;
}
