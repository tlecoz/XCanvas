import { MouseControler } from '../controlers/MouseControler';
import { Rectangle2D } from '../geom/Rectangle2D';
import { Path } from '../graphics/Path';
import { FillStroke } from '../style/FillStroke';
import { BitmapFill } from '../style/fills/BitmapFill';
import { GradientFill } from '../style/fills/GradientFill';
import { PatternFill } from '../style/fills/PatternFill';
import { SolidFill } from '../style/fills/SolidFill';
import { GradientStroke } from '../style/strokes/GradientStroke';
import { PatternStroke } from '../style/strokes/PatternStroke';
import { TextPath } from '../style/textstyles/TextPath';
import { GradientTextFill } from '../style/textstyles/fills/GradientTextFill';
import { PatternTextFill } from '../style/textstyles/fills/PatternTextFill';
import { SolidTextFill } from '../style/textstyles/fills/SolidTextFill';
import { GradientTextStroke } from '../style/textstyles/strokes/GradientTextStroke';
import { PatternTextStroke } from '../style/textstyles/strokes/PatternTextStroke';
import { SolidTextStroke } from '../style/textstyles/strokes/SolidTextStroke';
import { RegisterableObject } from '../utils/RegisterableObject';
import { Display2D } from './Display2D';
import { RenderStackElement } from './RenderStackElement';
import { Shape } from './Shape';

export type PathRenderable = SolidFill | GradientFill | GradientStroke | PatternFill | PatternStroke | BitmapFill;
export type TextRenderable = SolidTextFill | SolidTextStroke | GradientTextFill | GradientTextStroke | PatternTextFill | PatternTextStroke;
export type RenderStackable = PathRenderable | TextRenderable | Path | TextPath | Shape;
export declare class RenderStack extends RegisterableObject {
    lastPath: Path | TextPath;
    lastFillStroke: FillStroke;
    protected _elements: RenderStackElement[];
    offsetW: number;
    offsetH: number;
    mouse: MouseControler;
    constructor(elements?: (Path | TextPath | FillStroke | Shape)[]);
    filter(condition: (val: any) => boolean): any;
    get dataString(): string;
    static fromDataString(data: string): RenderStack;
    get elements(): RenderStackElement[];
    clone(): RenderStack;
    push(renderStackElement: Path | TextPath | FillStroke | Shape | RenderStack, mouseEnabled?: boolean): RenderStackElement | RenderStack;
    updateWithHitTest(context: CanvasRenderingContext2D, target: Display2D, mouseX?: number, mouseY?: number, updateFromShape?: boolean): boolean;
    update(context: CanvasRenderingContext2D, target: Display2D, updateFromShape?: boolean): boolean;
    updateBounds(target: Display2D): Rectangle2D;
    updateCache(context: CanvasRenderingContext2D, target: Display2D): void;
}
