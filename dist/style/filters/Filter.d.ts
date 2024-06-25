import { SolidColor } from '../../color/SolidColor';
import { DirtyEventDispatcher } from '../../events/DirtyEventDispatcher';

export declare class Filter extends DirtyEventDispatcher {
    boundOffsetW: number;
    boundOffsetH: number;
    next: Filter;
    protected _updateColor: Function;
    protected _color: SolidColor;
    protected _offsetX: number;
    protected _offsetY: number;
    protected _radius: number;
    protected _intensity: number;
    protected _angle: number;
    constructor();
    get value(): string;
    get angle(): number;
    set angle(n: number);
    get color(): SolidColor;
    set color(c: SolidColor);
    get intensity(): number;
    set intensity(n: number);
    get offsetX(): number;
    set offsetX(n: number);
    get offsetY(): number;
    set offsetY(n: number);
    get radius(): number;
    set radius(n: number);
    clear(): void;
}
