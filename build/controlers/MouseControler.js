class MouseControler extends EventDispatcher {
    constructor(canvas) {
        super();
        this.x = 0;
        this.y = 0;
        this.isDown = false;
        var th = this;
        var mc = this.htmlCanvas = canvas;
        mc.onmouseover = function (e) {
            th.getMouseXY(e);
            th.dispatchEvent(MouseEvents.OVER);
        };
        mc.onmouseout = function (e) {
            th.getMouseXY(e);
            th.dispatchEvent(MouseEvents.OUT);
        };
        mc.onmousedown = function (e) {
            th.getMouseXY(e);
            th.isDown = true;
            th.dispatchEvent(MouseEvents.DOWN);
        };
        mc.onmouseup = function (e) {
            th.getMouseXY(e);
            th.isDown = false;
            th.dispatchEvent(MouseEvents.UP);
        };
        mc.onclick = function (e) {
            th.getMouseXY(e);
            th.dispatchEvent(MouseEvents.CLICK);
        };
        mc.ondblclick = function (e) {
            th.getMouseXY(e);
            th.dispatchEvent(MouseEvents.DOUBLE_CLICK);
        };
        mc.onmousemove = function (e) {
            th.getMouseXY(e);
            th.dispatchEvent(MouseEvents.MOVE);
        };
        /*
        (mc as any).onmousewheel = function(e){
          if(e.wheelDelta > 0)th.dispatchEvent(MouseEvents.WHEEL_DOWN);
          else th.dispatchEvent(MouseEvents.WHEEL_UP);
        }*/
    }
    down(x, y) {
        this.x = x;
        this.y = y;
        this.dispatchEvent(MouseEvents.DOWN);
    }
    move(x, y) {
        this.x = x;
        this.y = y;
        this.dispatchEvent(MouseEvents.MOVE);
    }
    up(x, y) {
        this.x = x;
        this.y = y;
        this.dispatchEvent(MouseEvents.UP);
    }
    click(x, y) {
        this.x = x;
        this.y = y;
        this.dispatchEvent(MouseEvents.CLICK);
    }
    doubleClick(x, y) {
        this.x = x;
        this.y = y;
        this.dispatchEvent(MouseEvents.DOUBLE_CLICK);
    }
    getMouseXY(e, disableMoveEvent = false) {
        //console.log(e)
        if (e)
            e.preventDefault();
        e = e || window.event;
        if (e.pageX == null && e.clientX != null) {
            var html = document.documentElement;
            var body = document.body;
            e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
            e.pageX -= html.clientLeft || 0;
            e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0);
            e.pageY -= html.clientTop || 0;
        }
        this.x = e.pageX - this.htmlCanvas.offsetLeft;
        this.y = e.pageY - this.htmlCanvas.offsetTop;
    }
}
//# sourceMappingURL=MouseControler.js.map