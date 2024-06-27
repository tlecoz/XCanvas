export declare class Rectangle2D {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    constructor(minX?: number, minY?: number, maxX?: number, maxY?: number);
    init(minX?: number, minY?: number, maxX?: number, maxY?: number): Rectangle2D;
    add(r: Rectangle2D): void;
    get x(): number;
    set x(n: number);
    get y(): number;
    set y(n: number);
    get width(): number;
    set width(n: number);
    get height(): number;
    set height(n: number);
    clear(): void;
    draw(context: CanvasRenderingContext2D): void;
}
