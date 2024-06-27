import { BitmapData } from "../bitmap/BitmapData";

export class Video extends BitmapData {




  protected video: HTMLVideoElement;
  protected playerW: number;
  protected playerH: number;
  protected videoW: number;
  protected videoH: number;
  protected duration: number;
  protected playing: boolean = false;
  protected canPlay: boolean = false;
  protected useBitmapData: boolean = false;
  protected bmp: ImageBitmap;

  protected firstFrameRendered: boolean = false;
  protected oldTime: number = -10000;
  public crop: boolean = true;
  public loop: boolean = true;
  public fps: number = 30;
  public url: string;

  public get dataString(): string {

    return [this.playerW,
    this.playerH,
    this.video.src,
    Number(this.video.muted),
    Number(this.video.autoplay),
    Number(this.crop),
    Number(this.loop),
    this.fps
    ].join(",");
  }

  public static fromDataString(data: string): Video {
    let t: string[] = data.split(",");
    let v: Video = new Video(Number(t[0]), Number(t[1]), t[2], t[3] == "1", t[4] == "1");
    v.crop = t[5] == "1";
    v.loop = t[6] == "1";
    v.fps = Number(t[7]);
    return v;
  }


  constructor(w: number, h: number, url: string = "", muted: boolean = true, autoplay: boolean = true) {
    super(1, 1);

    this.playerW = w;
    this.playerH = h;

    var video = this.video = document.createElement("video");
    video.style.visibility = "hidden";
    video.width = w;
    video.height = h;
    video.muted = muted;
    video.autoplay = autoplay;
    video.src = this.url = url;

    //### the code works but chrome become unstable if I use ImageBitmap => 19/01/2019
    this.useNativeBitmapData = true//(Browser.canUseImageBitmap == false)
    //######


    var started: boolean = false;

    video.onpause = () => { this.playing = false; }
    video.onwaiting = () => { this.playing = false; }
    video.onplay = () => { this.playing = true; }

    video.onended = () => {
      this.playing = false;
      if (this.loop) video.play();
    }

    video.oncanplay = () => {
      this.videoW = video.videoWidth;
      this.videoH = video.videoHeight;
      this.canPlay = true;
      if (!started && autoplay) {
        started = true;
        document.body.appendChild(video);
      }
      if (!this.firstFrameRendered) this.update();
    }

  }



  public update(): boolean {
    if (this.playing || this.firstFrameRendered == false) {

      if (Math.abs(this.video.currentTime - this.oldTime) < (1 / this.fps)) return;

      this.oldTime = this.video.currentTime;

      if (this.useBitmapData) {

        var s: number;
        var w = this.videoW;
        var h = this.videoH;
        var srcX: number = 0, srcY: number = 0;
        var srcW: number = w, srcH: number = h;
        var destX: number = 0, destY: number = 0;
        var destW: number = this.playerW, destH: number = this.playerH;
        s = w / this.playerW;
        w *= s;
        h *= s;

        if (!this.crop) {
          s = this.playerH / h;
          w *= s;
          h *= s;

          if (w > this.playerW) {
            s = this.playerW / w;
            w *= s;
            h *= s;
          }

          destX = (this.playerW - w) * 0.5;
          destY = (this.playerH - h) * 0.5;
          destW = this.playerW - destX * 2;
          destH = this.playerH - destY * 2;

        } else {

          s = this.playerW / w;
          w *= s;
          h *= s;

          if (h < this.playerH) {
            s = this.playerH / h;
            w *= s;
            h *= s;
          }

          var scale = w / this.videoW;
          srcX = (w - this.playerW) * 0.5 / scale;
          srcY = (h - this.playerH) * 0.5 / scale;
          srcW = this.videoW - srcX * 2;
          srcH = this.videoH - srcY * 2;

        }



        //console.log(destX,destY,destW,destH)

        //console.log(this.video.width,this.video.height,this.playerW,this.playerH)



        this.context.drawImage(this.video, srcX, srcY, srcW, srcH, destX, destY, destW, destH);
        this.dispatchEvent(BitmapData.IMAGE_LOADED)
      } else {
        createImageBitmap(this.video).then((bmp) => {
          //if(this.bmp) this.bmp.close();
          this.bmp = bmp;
          this.dispatchEvent(BitmapData.IMAGE_LOADED)
        })
      }
      return true;
    }
  }

  public get htmlCanvas(): HTMLCanvasElement | ImageBitmap {
    if (this.useBitmapData) return this.canvas;
    else {
      if (this.bmp) return this.bmp;
      return this.canvas;
    }
  }


  public get useNativeBitmapData(): boolean { return this.useBitmapData }
  public set useNativeBitmapData(b: boolean) {
    if (this.useBitmapData != b) {
      if (b) {
        this.canvas.width = this.video.width;
        this.canvas.height = this.video.height;
      } else {
        this.canvas.width = this.canvas.height = 1;
      }
      this.useBitmapData = b;
    }

  }

  public get ready(): boolean { return this.canPlay }
  public get htmlVideo(): HTMLVideoElement { return this.video }

  public play(): void {
    if (!document.body.contains(this.video)) document.body.appendChild(this.video);
    this.video.play();
  }
  public stop(): void {
    if (document.body.contains(this.video)) document.body.removeChild(this.video);
    this.video.src = "";
  }

  public seekPercent(pct: number): void {
    this.video.currentTime = this.duration * pct;
  }
  public seekTime(timeInSecond: number): void {
    this.video.currentTime = timeInSecond;
  }

}
