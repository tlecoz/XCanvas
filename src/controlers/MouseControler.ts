import { EventDispatcher } from "../events/EventDispatcher";
import { MouseEvents } from "../events/MouseEvents";

export class MouseControler extends EventDispatcher {



  public x: number = 0;
  public y: number = 0;
  public isDown: boolean = false;
  public htmlCanvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    super();


    var mc = this.htmlCanvas = canvas;

    mc.onmouseover = (e) => {
      this.getMouseXY(e);
      this.dispatchEvent(MouseEvents.OVER);
    }
    mc.onmouseout = (e) => {
      this.getMouseXY(e);
      this.dispatchEvent(MouseEvents.OUT);
    }
    mc.onmousedown = (e) => {
      this.getMouseXY(e);
      this.isDown = true;
      this.dispatchEvent(MouseEvents.DOWN);
    }
    mc.onmouseup = (e) => {
      this.getMouseXY(e);
      this.isDown = false;
      this.dispatchEvent(MouseEvents.UP);
    }
    mc.onclick = (e) => {
      this.getMouseXY(e);
      this.dispatchEvent(MouseEvents.CLICK);
    }
    mc.ondblclick = (e) => {
      this.getMouseXY(e);
      this.dispatchEvent(MouseEvents.DOUBLE_CLICK);
    }

    mc.onmousemove = (e) => {
      this.getMouseXY(e);
      this.dispatchEvent(MouseEvents.MOVE);
    }
    /*
    (mc as any).onmousewheel = function(e){
      if(e.wheelDelta > 0)th.dispatchEvent(MouseEvents.WHEEL_DOWN);
      else th.dispatchEvent(MouseEvents.WHEEL_UP);
    }*/
  }

  public down(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.dispatchEvent(MouseEvents.DOWN);
  }
  public move(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.dispatchEvent(MouseEvents.MOVE);
  }
  public up(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.dispatchEvent(MouseEvents.UP);
  }
  public click(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.dispatchEvent(MouseEvents.CLICK);
  }
  public doubleClick(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.dispatchEvent(MouseEvents.DOUBLE_CLICK);
  }
  public getMouseXY(e: any /*, disableMoveEvent: boolean = false*/): void {
    //console.log(e)
    if (e) e.preventDefault();

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
