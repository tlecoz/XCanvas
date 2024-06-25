import { BitmapData } from "../../bitmap/BitmapData";
import { Display2D } from "../../display/Display2D";
import { Path } from "../../graphics/Path";
import { FillStroke } from "../FillStroke";

export class BitmapCacheFill extends FillStroke {

  public bd: BitmapData;

  //@ts-ignore
  constructor(bd: BitmapData, centerInto: boolean = true) {
    super();
    this.bd = bd;
    this.styleType = "fillStyle";


  }
  public get width(): number { return this.bd.width }
  public get height(): number { return this.bd.height }

  //@ts-ignore
  public apply(context: CanvasRenderingContext2D, path: Path, target: Display2D): void {

    context.drawImage(this.bd.htmlCanvas, 0, 0);

  }
}
