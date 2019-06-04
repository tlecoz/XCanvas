class SpritesheetSequence {
    constructor(source, startFrame, endFrame, framePerSecond, loop = true) {
        this._frameW = source.frameW;
        this._frameH = source.frameH;
        this.framePerSecond = framePerSecond;
        this.startFrame = startFrame;
        this.endFrame = endFrame;
        this.nbX = source.nbX;
        this._nbFrame = endFrame - startFrame;
        this.frameDuration = 1000 / framePerSecond;
        this.currentFrame = startFrame;
        this.started = false;
        this.startTime = 0;
        this._frameX = 0;
        this._frameY = 0;
        this.loopSequence = loop;
        this.updateFrame(this.currentFrame);
    }
    updateFrame(id) {
        this._frameY = Math.floor(id / this.nbX) * this._frameH;
        this._frameX = (id % this.nbX) * this._frameW;
    }
    start() {
        this.started = true;
        this.startTime = new Date().getTime();
    }
    stop() {
        this.started = false;
    }
    reset(start) {
        this.started = start;
        this.currentFrame = this.startFrame;
    }
    update() {
        if (false == this.started)
            return;
        var time = new Date().getTime() - this.startTime;
        if (time > this.frameDuration) {
            this.startTime = new Date().getTime();
            this.currentFrame++;
            if (this.currentFrame > this.endFrame) {
                if (this.loopSequence)
                    this.currentFrame = this.startFrame;
                else
                    this.currentFrame = this.endFrame;
            }
            this.updateFrame(this.currentFrame);
        }
    }
    get fps() { return this.framePerSecond; }
    set fps(n) {
        this.framePerSecond = n;
        this.frameDuration = 1000 / this.framePerSecond;
    }
    get frameX() { return this._frameX; }
    get frameY() { return this._frameY; }
    get frameW() { return this._frameW; }
    get frameH() { return this._frameH; }
    get nbFrame() { return this._nbFrame; }
}
//# sourceMappingURL=SpritesheetSequence.js.map