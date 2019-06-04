class TouchControler extends EventDispatcher {
    constructor(htmlCanvas, mouseControler) {
        super();
        this.tapTimeLimit = 60;
        this.doubleTimeLimit = 300;
        this.swipeTimeLimit = 400;
        this.lastTapTime = 0;
        this.startDist = 0;
        this.startAngle = 0;
        this.zoom = 1;
        this.rotation = 0;
        this.firstPoint = null;
        this.secondPoint = null;
        this.actifPoints = [];
        this.touches = [];
        this.nbTouch = 0;
        this.lastTouch = null;
        this.mouse = mouseControler;
        this.htmlCanvas = htmlCanvas;
        var th = this;
        htmlCanvas.addEventListener("touchstart", function (e) {
            e.preventDefault();
            var t = e.changedTouches;
            var touch;
            var i, len = t.length;
            var touchId = 0;
            for (i = 0; i < len; i++) {
                touch = t[i];
                touchId = touch.identifier;
                th.touchX = touch.pageX;
                th.touchY = touch.pageY;
                if (undefined == th.touches[touchId])
                    th.touches[touchId] = th.lastTouch = new Touche();
                else
                    th.lastTouch = th.touches[touchId];
                th.lastTouch.start(th.touchX, th.touchY);
                if (th.nbTouch == 0) {
                    th.lastTouch.firstPoint = true;
                    th.firstPoint = th.lastTouch;
                }
                else if (th.nbTouch == 1) {
                    th.initSecondPoint(th.lastTouch);
                }
                th.actifPoints[th.nbTouch++] = th.lastTouch;
                th.dispatchEvent(TouchEvents.ADD_ONE_TOUCH);
                if (true == th.lastTouch.firstPoint) {
                    th.dispatchEvent(TouchEvents.START);
                    th.mouse.down(th.touchX, th.touchY);
                }
            }
        }, false);
        function touchEnd(e) {
            e.preventDefault();
            var t = e.changedTouches;
            var touch;
            var i, len = t.length;
            var touchId = 0;
            var lastTouch;
            var oldTouchId = Number.MAX_VALUE;
            for (i = 0; i < len; i++) {
                touch = t[i];
                touchId = touch.identifier;
                if (touchId == oldTouchId)
                    continue;
                oldTouchId = touchId;
                th.touchX = touch.pageX;
                th.touchY = touch.pageY;
                lastTouch = th.touches[touchId];
                lastTouch.end(lastTouch.x, lastTouch.y);
                th.nbTouch--;
                th.dispatchEvent(TouchEvents.LOSE_ONE_TOUCH);
                th.actifPoints.splice(th.actifPoints.lastIndexOf(lastTouch), 1);
                if (lastTouch.firstPoint == true) {
                    lastTouch.firstPoint = false;
                    th.dispatchEvent(TouchEvents.END);
                    th.mouse.up(lastTouch.x, lastTouch.y);
                    var time = new Date().getTime();
                    if (lastTouch.lifeTime < th.tapTimeLimit) {
                        if (time - th.lastTapTime < th.doubleTimeLimit) {
                            th.dispatchEvent(TouchEvents.DOUBLE_TAP);
                            th.mouse.doubleClick(th.touchX, th.touchY);
                            th.lastTapTime = 0;
                        }
                        else {
                            th.dispatchEvent(TouchEvents.TAP);
                            th.mouse.click(lastTouch.x, lastTouch.y);
                            th.lastTapTime = time;
                        }
                    }
                    else {
                        if (lastTouch.lifeTime > 80 && lastTouch.lifeTime < th.swipeTimeLimit) {
                            var swipeId = lastTouch.swipeId;
                            if (swipeId >= 0) {
                                if (0 == swipeId)
                                    th.dispatchEvent(TouchEvents.SWIPE_RIGHT);
                                else if (1 == swipeId)
                                    th.dispatchEvent(TouchEvents.SWIPE_DOWN);
                                else if (2 == swipeId)
                                    th.dispatchEvent(TouchEvents.SWIPE_LEFT);
                                else if (3 == swipeId)
                                    th.dispatchEvent(TouchEvents.SWIPE_UP);
                            }
                        }
                    }
                }
            }
        }
        htmlCanvas.addEventListener("touchend", touchEnd, false);
        htmlCanvas.addEventListener("touchleave", touchEnd, false);
        htmlCanvas.addEventListener("touchmove", function (e) {
            e.preventDefault();
            var t = e.changedTouches;
            var touch;
            var i, len = t.length;
            var touchId = 0;
            var lastTouch;
            for (i = 0; i < len; i++) {
                touch = t[i];
                touchId = touch.identifier;
                th.touchX = touch.pageX;
                th.touchY = touch.pageY;
                lastTouch = th.touches[touchId];
                lastTouch.move(th.touchX, th.touchY);
                th.dispatchEvent(TouchEvents.MOVE_ONE_TOUCH);
                if (lastTouch.firstPoint == true) {
                    th.dispatchEvent(TouchEvents.MOVE);
                    th.mouse.move(th.touchX, th.touchY);
                }
                if (th.nbTouch >= 2) {
                    var dx = th.secondPoint.x - th.firstPoint.x;
                    var dy = th.secondPoint.y - th.firstPoint.y;
                    var d = Math.sqrt(dx * dx + dy * dy);
                    var a = Math.atan2(dy, dx);
                    th.zoom = d / th.startDist;
                    th.rotation = a - th.startAngle;
                    th.dispatchEvent(TouchEvents.ZOOM_AND_ROTATE);
                }
            }
        }, false);
    }
    initSecondPoint(p) {
        this.secondPoint = p;
        var dx = p.x - this.firstPoint.x;
        var dy = p.y - this.firstPoint.y;
        this.startAngle = Math.atan2(dy, dx);
        this.startDist = Math.sqrt(dx * dx + dy * dy);
    }
}
//# sourceMappingURL=TouchControler.js.map