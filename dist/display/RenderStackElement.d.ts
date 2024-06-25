import { Path } from '../graphics/Path';
import { FillStroke } from '../style/FillStroke';
import { TextPath } from '../style/textstyles/TextPath';
import { RegisterableObject } from '../utils/RegisterableObject';
import { Shape } from './Shape';

export declare class RenderStackElement extends RegisterableObject {
    value: FillStroke | Path | TextPath | Shape;
    enabled: boolean;
    mouseEnabled: boolean;
    lastPath: Path | TextPath;
    lastFillStroke: FillStroke;
    isShape: boolean;
    isPath: boolean;
    isTextPath: boolean;
    isPathFill: boolean;
    isPathStroke: boolean;
    isTextFill: boolean;
    isTextStroke: boolean;
    isTextFillStroke: boolean;
    isPathFillStroke: boolean;
    isStroke: boolean;
    get dataString(): string;
    static fromDataString(data: string): RenderStackElement;
    constructor(element: FillStroke | Path | TextPath | Shape, mouseEnabled?: boolean);
    clone(): RenderStackElement;
    init(lastPath: Path | TextPath, lastFillStroke: FillStroke): void;
}
