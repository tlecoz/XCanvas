import { BitmapData } from '../bitmap/BitmapData';

export declare class Img extends BitmapData {
    private _img;
    private _url;
    onLoaded: (e?: any) => void;
    constructor(url?: string);
    get dataString(): string;
    static fromDataString(url: string): Img;
    get htmlImage(): HTMLImageElement;
    get url(): string;
    set url(s: string);
}
