class VideoPlayer extends BitmapData {
    constructor(w, h, url = "", muted = true, autoplay = true) {
        super(1, 1);
        this.playing = false;
        this.canPlay = false;
        this.useBitmapData = false;
        this.firstFrameRendered = false;
        this.oldTime = -10000;
        this.crop = true;
        this.loop = true;
        this.fps = 30;
        this.playerW = w;
        this.playerH = h;
        var video = this.video = document.createElement("video");
        video.style.visibility = "hidden";
        video.width = w;
        video.height = h;
        video.muted = muted;
        video.autoplay = autoplay;
        video.src = url;
        //### the code works but chrome become unstable if I use ImageBitmap => 19/01/2019
        this.useNativeBitmapData = true; //(Browser.canUseImageBitmap == false)
        //######
        var th = this;
        var started = false;
        video.onpause = function () { th.playing = false; };
        video.onwaiting = function () { th.playing = false; };
        video.onplay = function () { th.playing = true; };
        video.onended = function () {
            th.playing = false;
            if (th.loop)
                video.play();
        };
        video.oncanplay = function () {
            th.videoW = video.videoWidth;
            th.videoH = video.videoHeight;
            th.canPlay = true;
            if (!started && autoplay) {
                started = true;
                document.body.appendChild(video);
            }
            if (!th.firstFrameRendered)
                th.update();
        };
    }
    update() {
        if (this.playing || this.firstFrameRendered == false) {
            if (Math.abs(this.video.currentTime - this.oldTime) < (1 / this.fps))
                return;
            this.oldTime = this.video.currentTime;
            if (this.useBitmapData) {
                var s;
                var w = this.videoW;
                var h = this.videoH;
                var srcX = 0, srcY = 0;
                var srcW = w, srcH = h;
                var destX = 0, destY = 0;
                var destW = this.playerW, destH = this.playerH;
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
                }
                else {
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
                this.dispatchEvent(BitmapData.IMAGE_LOADED);
            }
            else {
                createImageBitmap(this.video).then((bmp) => {
                    //if(this.bmp) this.bmp.close();
                    this.bmp = bmp;
                    this.dispatchEvent(BitmapData.IMAGE_LOADED);
                });
            }
            return true;
        }
    }
    get htmlCanvas() {
        if (this.useBitmapData)
            return this.canvas;
        else {
            if (this.bmp)
                return this.bmp;
            return this.canvas;
        }
    }
    get useNativeBitmapData() { return this.useBitmapData; }
    set useNativeBitmapData(b) {
        if (this.useBitmapData != b) {
            if (b) {
                this.canvas.width = this.video.width;
                this.canvas.height = this.video.height;
            }
            else {
                this.canvas.width = this.canvas.height = 1;
            }
            this.useBitmapData = b;
        }
    }
    get ready() { return this.canPlay; }
    get htmlVideo() { return this.video; }
    play() {
        if (!document.body.contains(this.video))
            document.body.appendChild(this.video);
        this.video.play();
    }
    stop() {
        if (document.body.contains(this.video))
            document.body.removeChild(this.video);
        this.video.src = "";
    }
    seekPercent(pct) {
        this.video.currentTime = this.duration * pct;
    }
    seekTime(timeInSecond) {
        this.video.currentTime = timeInSecond;
    }
}
//# sourceMappingURL=VideoPlayer.js.map