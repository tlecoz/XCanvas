import { BitmapData } from '../bitmap/BitmapData';
import { Display2D } from './Display2D';
import { RenderStackElement } from './RenderStackElement';

export declare class BitmapCache extends BitmapData {
    protected target: Display2D;
    protected renderStackElement: RenderStackElement;
    needsUpdate: boolean;
    constructor(target: Display2D, renderStackElement?: RenderStackElement);
    draw(context: CanvasRenderingContext2D, offsetW: number, offsetH: number): void;
    updateCache(forceUpdate?: boolean): void;
}
