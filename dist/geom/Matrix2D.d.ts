import { EventDispatcher } from '../events/EventDispatcher';

export declare class Matrix2D extends EventDispatcher {
    static IDENTITY: DOMMatrix;
    x: number;
    y: number;
    xAxis: number;
    yAxis: number;
    rotation: number;
    scaleX: number;
    scaleY: number;
    width: number;
    height: number;
    offsetW: number;
    offsetH: number;
    protected matrix: DOMMatrix;
    protected savedMatrixs: any;
    constructor();
    get dataString(): string;
    static fromDataString(data: string, target?: Matrix2D): Matrix2D;
    save(): void;
    restore(): void;
    get realWidth(): number;
    get realHeight(): number;
    clone(): Matrix2D;
    applyTransform(): DOMMatrix;
    setMatrixValue(s?: string): DOMMatrix;
    translate(x: number, y: number): DOMMatrix;
    rotate(angle: number): DOMMatrix;
    scale(x: number, y: number): DOMMatrix;
    invert(): DOMMatrix;
    rotateFromVector(x: number, y: number): DOMMatrix;
    multiply(m: Matrix2D): void;
    preMultiply(m: Matrix2D): void;
    identity(): void;
    get domMatrix(): DOMMatrix;
}
