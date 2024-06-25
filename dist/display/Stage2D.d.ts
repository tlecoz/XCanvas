import { MouseControler } from '../controlers/MouseControler';
import { Group2D } from './Group2D';

export declare class Stage2D extends Group2D {
    protected _canvas: HTMLCanvasElement;
    protected _output: HTMLCanvasElement;
    protected _outputContext: CanvasRenderingContext2D | any;
    protected _context: CanvasRenderingContext2D;
    protected _mouseControler: MouseControler;
    constructor(w: number, h: number, appendOnBody?: boolean);
    get dataString(): string;
    static fromDataString(data: string): Stage2D;
    get canvas(): HTMLCanvasElement;
    get context(): CanvasRenderingContext2D;
    get mouseControler(): MouseControler;
    get globalAlpha(): number;
    get globalX(): number;
    get globalY(): number;
    get globalScaleX(): number;
    get globalScaleY(): number;
    get globalRotation(): number;
    drawElements(): void;
}
