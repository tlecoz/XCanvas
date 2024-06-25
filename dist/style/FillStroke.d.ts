import { BitmapData } from '../bitmap/BitmapData';
import { Display2D } from '../display/Display2D';
import { Path } from '../graphics/Path';
import { RegisterableObject } from '../utils/RegisterableObject';
import { LineStyle } from './LineStyle';
import { TextStyle } from './TextStyle';
import { Filter } from './filters/Filter';
import { FilterStack } from './filters/FilterStack';
import { TextPath } from './textstyles/TextPath';

export type Fillable = Path | TextPath;
export declare class FillStroke extends RegisterableObject {
    fillPathRule: "nonzero" | "evenodd";
    protected styleType: "fillStyle" | "strokeStyle";
    alpha: number;
    lineStyle: LineStyle;
    textStyle: TextStyle;
    filters: FilterStack | Filter;
    needsUpdate: boolean;
    static radian: number;
    offsetW: number;
    offsetH: number;
    dirty: boolean;
    protected _cacheAsBitmap: boolean;
    protected cacheDirty: boolean;
    protected cache: BitmapData;
    constructor();
    apply(context: CanvasRenderingContext2D, path: Fillable, target: Display2D): void;
    get cacheAsBitmap(): boolean;
    set cacheAsBitmap(b: boolean);
    get isFill(): boolean;
    get isStroke(): boolean;
    get globalOffsetW(): number;
    get globalOffsetH(): number;
    get lineWidth(): number;
}
