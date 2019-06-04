class SquarePath extends Path {
    constructor() {
        super();
        if (!SquarePath._instance)
            SquarePath._instance = this;
        else
            throw new Error("SquarePath is a singleton. You must use SquarePath.instance.");
        this.rect(0, 0, 1, 1);
        this.computePath();
    }
    static get instance() {
        if (!SquarePath._instance)
            new SquarePath();
        return SquarePath._instance;
    }
    static get path() { return SquarePath.instance.path; }
}
//# sourceMappingURL=SquarePath.js.map