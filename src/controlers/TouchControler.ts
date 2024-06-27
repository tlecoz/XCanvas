import { EventDispatcher } from "../events/EventDispatcher";
import { TouchEvents } from "../events/TouchEvents";
import { MouseControler } from "./MouseControler";
import { Touche } from "./Touche";

export class TouchControler extends EventDispatcher {

    public tapTimeLimit = 60;
    public doubleTimeLimit = 300;
    public swipeTimeLimit = 400;
    public lastTapTime = 0;

    protected startDist = 0;
    protected startAngle = 0;

    protected mouse;
    protected zoom = 1;
    protected rotation = 0;


    protected firstPoint = null;
    protected secondPoint = null;
    protected actifPoints = [];
    protected touches: Touche[] = [];
    protected indexs: number[];
    protected touchX: number;
    protected touchY: number;

    protected nbTouch: number = 0;
    protected lastTouch: Touche = null;

    protected htmlCanvas: HTMLCanvasElement;

    constructor(htmlCanvas: HTMLCanvasElement, mouseControler: MouseControler) {
        super();
        this.mouse = mouseControler;
        this.htmlCanvas = htmlCanvas;


        htmlCanvas.addEventListener("touchstart", (e) => {

            e.preventDefault();

            var t: TouchList = e.changedTouches;
            var touch: any;
            var i: number, len: number = t.length;
            var touchId: number = 0;

            for (i = 0; i < len; i++) {


                touch = t[i];
                touchId = touch.identifier;
                this.touchX = touch.pageX;
                this.touchY = touch.pageY;

                if (undefined == this.touches[touchId]) this.touches[touchId] = this.lastTouch = new Touche();
                else this.lastTouch = this.touches[touchId];

                this.lastTouch.start(this.touchX, this.touchY);

                if (this.nbTouch == 0) {
                    this.lastTouch.firstPoint = true;
                    this.firstPoint = this.lastTouch;
                } else if (this.nbTouch == 1) {
                    this.initSecondPoint(this.lastTouch);
                }

                this.actifPoints[this.nbTouch++] = this.lastTouch;
                this.dispatchEvent(TouchEvents.ADD_ONE_TOUCH);


                if (true == this.lastTouch.firstPoint) {
                    this.dispatchEvent(TouchEvents.START);
                    this.mouse.down(this.touchX, this.touchY);
                }
            }

        }, false);


        const touchEnd = (e) => {
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

                if (touchId == oldTouchId) continue;
                oldTouchId = touchId;

                this.touchX = touch.pageX;
                this.touchY = touch.pageY;

                lastTouch = this.touches[touchId];
                lastTouch.end(lastTouch.x, lastTouch.y);
                this.nbTouch--;
                this.dispatchEvent(TouchEvents.LOSE_ONE_TOUCH);

                this.actifPoints.splice(this.actifPoints.lastIndexOf(lastTouch), 1);

                if (lastTouch.firstPoint == true) {
                    lastTouch.firstPoint = false;
                    this.dispatchEvent(TouchEvents.END);
                    this.mouse.up(lastTouch.x, lastTouch.y);

                    var time = new Date().getTime();
                    if (lastTouch.lifeTime < this.tapTimeLimit) {

                        if (time - this.lastTapTime < this.doubleTimeLimit) {
                            this.dispatchEvent(TouchEvents.DOUBLE_TAP);
                            this.mouse.doubleClick(this.touchX, this.touchY);
                            this.lastTapTime = 0;
                        } else {
                            this.dispatchEvent(TouchEvents.TAP);
                            this.mouse.click(lastTouch.x, lastTouch.y);
                            this.lastTapTime = time;
                        }

                    } else {
                        if (lastTouch.lifeTime > 80 && lastTouch.lifeTime < this.swipeTimeLimit) {
                            var swipeId: number = lastTouch.swipeId;
                            if (swipeId >= 0) {
                                if (0 == swipeId) this.dispatchEvent(TouchEvents.SWIPE_RIGHT);
                                else if (1 == swipeId) this.dispatchEvent(TouchEvents.SWIPE_DOWN);
                                else if (2 == swipeId) this.dispatchEvent(TouchEvents.SWIPE_LEFT);
                                else if (3 == swipeId) this.dispatchEvent(TouchEvents.SWIPE_UP);
                            }
                        }
                    }
                }
            }
        }

        htmlCanvas.addEventListener("touchend", touchEnd, false);
        htmlCanvas.addEventListener("touchleave", touchEnd, false);

        htmlCanvas.addEventListener("touchmove", (e) => {
            e.preventDefault();

            var t: TouchList = e.changedTouches;
            var touch;
            var i, len = t.length;
            var touchId = 0;
            var lastTouch;

            for (i = 0; i < len; i++) {
                touch = t[i];
                touchId = touch.identifier;
                this.touchX = touch.pageX;
                this.touchY = touch.pageY;

                lastTouch = this.touches[touchId];
                lastTouch.move(this.touchX, this.touchY);
                this.dispatchEvent(TouchEvents.MOVE_ONE_TOUCH);

                if (lastTouch.firstPoint == true) {
                    this.dispatchEvent(TouchEvents.MOVE);
                    this.mouse.move(this.touchX, this.touchY);
                }

                if (this.nbTouch >= 2) {

                    var dx = this.secondPoint.x - this.firstPoint.x;
                    var dy = this.secondPoint.y - this.firstPoint.y;
                    var d = Math.sqrt(dx * dx + dy * dy);
                    var a = Math.atan2(dy, dx);

                    this.zoom = d / this.startDist;
                    this.rotation = a - this.startAngle;
                    this.dispatchEvent(TouchEvents.ZOOM_AND_ROTATE)
                }
            }
        }, false);
    }

    private initSecondPoint(p) {
        this.secondPoint = p;
        var dx = p.x - this.firstPoint.x;
        var dy = p.y - this.firstPoint.y;
        this.startAngle = Math.atan2(dy, dx);
        this.startDist = Math.sqrt(dx * dx + dy * dy);
    }


}
