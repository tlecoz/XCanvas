class Shape extends RegisterableObject {
    constructor(x, y, w, h, renderStack) {
        super();
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.renderStack = renderStack;
    }
    get dataString() {
        return [this.x, this.y, this.w, this.h, this.renderStack.REGISTER_ID].join(",");
    }
    static fromDataString(data) {
        var t = data.split(",");
        return new Shape(Number(t[0]), Number(t[1]), Number(t[2]), Number(t[3]), ObjectLibrary.instance.getObjectByRegisterId(t[4]));
    }
    apply(context, target, mouseX = Number.MAX_VALUE, mouseY = Number.MAX_VALUE) {
        context.save();
        context.translate(this.x * target.inverseW, this.y * target.inverseH);
        context.scale(this.w / target.width, this.h / target.height);
        var b;
        //console.log(target instanceof Display2D)
        if (target.mouseEnabled)
            b = this.renderStack.updateWithHitTest(context, target, mouseX, mouseY, true);
        else {
            b = this.renderStack.update(context, target, true);
        }
        context.restore();
        return b;
    }
}
//# sourceMappingURL=Shape.js.map