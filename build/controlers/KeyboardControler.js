class KeyboardControler extends EventDispatcher {
    constructor() {
        super();
        this.keyCode = -1;
        this.isDown = [];
        for (var i = 0; i < 222; i++)
            this.isDown[i] = false;
        var th = this;
        document.addEventListener("keydown", function (e) {
            th.keyCode = e.keyCode;
            th.isDown[th.keyCode] = true;
            th.dispatchEvent(KeyboardEvents.KEY_DOWN);
            th.dispatchEvent(KeyboardEvents.CHANGED);
        });
        document.addEventListener("keyup", function (e) {
            th.keyCode = e.keyCode;
            th.isDown[th.keyCode] = false;
            th.dispatchEvent(KeyboardEvents.KEY_DOWN);
            th.dispatchEvent(KeyboardEvents.CHANGED);
        });
    }
    keyIsDown(keyCode) { return this.isDown[keyCode]; }
    ;
}
//# sourceMappingURL=KeyboardControler.js.map