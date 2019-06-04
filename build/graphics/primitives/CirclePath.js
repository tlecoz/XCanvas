class CirclePath extends Path {
    constructor() {
        super();
        if (!CirclePath._instance)
            CirclePath._instance = this;
        else
            throw new Error("CirclePath is a singleton. You must use CirclePath.instance.");
        this.circle(0.5, 0.5, 0.5);
        this.computePath();
    }
    static get instance() {
        if (!CirclePath._instance)
            new CirclePath();
        return CirclePath._instance;
    }
    static get path() { return CirclePath.instance.path; }
}
//# sourceMappingURL=CirclePath.js.map