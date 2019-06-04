class VideoPlayer extends EventDispatcher {
    constructor(w, h, url = null, muted = true, autoplay = true) {
        super();
        this.w = w;
        this.h = h;
        this.url = url;
        this.video = document.createElement("video");
        this.video.preload = "false";
        if (muted) {
            this.video.muted = true;
            if (autoplay)
                this.video.autoplay = true;
        }
        if (this.url)
            this.video.src = this.url;
    }
    get width() { return this.w; }
    set width(n) { this.w = n; }
    get height() { return this.h; }
    set height(n) { this.h = n; }
    get preload() { return this.video.preload; }
    set preload(b) { this.video.preload = b; }
    get muted() { return this.video.muted; }
    set muted(b) { this.video.muted = b; }
    get autoplay() { return this.video.autoplay; }
    set autoplay(b) { this.video.autoplay = b; }
}
//# sourceMappingURL=VideoPlayer.js.map