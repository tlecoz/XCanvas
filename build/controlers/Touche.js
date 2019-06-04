class Touche extends EventDispatcher {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.actif = false;
        this.firstPoint = false;
        this.swipeId = TouchSwipe.NOT_DEFINED_YET;
    }
    start(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.swipeId = TouchSwipe.NOT_DEFINED_YET;
        this.actif = true;
        this.startTime = new Date().getTime();
        this.dispatchEvent(TouchEvents.START);
    }
    end(x, y) {
        this.vx = x - this.x;
        this.vy = y - this.y;
        this.lifeTime = new Date().getTime() - this.startTime;
        this.x = x;
        this.y = y;
        this.actif = false;
        this.dispatchEvent(TouchEvents.END);
    }
    move(x, y) {
        this.vx = x - this.x;
        this.vy = y - this.y;
        if (this.swipeId != TouchSwipe.NOT_A_SWIPE) {
            var pi2 = Math.PI * 2;
            var pi_2 = Math.PI / 2;
            var a = (pi2 + Math.atan2(this.vy, this.vx) + Math.PI / 4) % pi2;
            var direction = Math.floor(a / pi_2);
            if (TouchSwipe.NOT_DEFINED_YET == this.swipeId)
                this.swipeId = direction;
            else if (this.swipeId != TouchSwipe.NOT_A_SWIPE && direction != this.swipeId)
                this.swipeId = TouchSwipe.NOT_A_SWIPE;
        }
        this.x = x;
        this.y = y;
        this.actif = true;
        this.dispatchEvent(TouchEvents.MOVE);
    }
    isTap(timeLimit) {
        return (new Date().getTime() - this.startTime) < timeLimit;
    }
}
//# sourceMappingURL=Touche.js.map