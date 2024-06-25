import { BitmapData } from '../bitmap/BitmapData';

export declare class Video extends BitmapData {
    protected video: HTMLVideoElement;
    protected playerW: number;
    protected playerH: number;
    protected videoW: number;
    protected videoH: number;
    protected duration: number;
    protected playing: boolean;
    protected canPlay: boolean;
    protected useBitmapData: boolean;
    protected bmp: ImageBitmap;
    protected firstFrameRendered: boolean;
    protected oldTime: number;
    crop: boolean;
    loop: boolean;
    fps: number;
    url: string;
    get dataString(): string;
    static fromDataString(data: string): Video;
    constructor(w: number, h: number, url?: string, muted?: boolean, autoplay?: boolean);
    update(): boolean;
    get htmlCanvas(): HTMLCanvasElement | ImageBitmap;
    get useNativeBitmapData(): boolean;
    set useNativeBitmapData(b: boolean);
    get ready(): boolean;
    get htmlVideo(): HTMLVideoElement;
    play(): void;
    stop(): void;
    seekPercent(pct: number): void;
    seekTime(timeInSecond: number): void;
}
