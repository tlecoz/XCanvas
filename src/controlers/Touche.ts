import { EventDispatcher } from "../events/EventDispatcher";
import { TouchEvents } from "../events/TouchEvents";
import { TouchSwipe } from "./TouchSwipe";

export class Touche extends EventDispatcher {

  public x: number = 0;
  public y: number = 0;
  public vx: number = 0;
  public vy: number = 0;
  public actif: boolean = false;
  public firstPoint: boolean = false;
  public swipeId: number = TouchSwipe.NOT_DEFINED_YET;
  public startTime: number;
  public lifeTime: number;

  constructor() {
    super();
  }

  public start(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.swipeId = TouchSwipe.NOT_DEFINED_YET;

    this.actif = true;
    this.startTime = new Date().getTime();
    this.dispatchEvent(TouchEvents.START);
  }
  public end(x: number, y: number) {
    this.vx = x - this.x;
    this.vy = y - this.y;
    this.lifeTime = new Date().getTime() - this.startTime;
    this.x = x;
    this.y = y;
    this.actif = false;
    this.dispatchEvent(TouchEvents.END);
  }
  public move(x: number, y: number): void {
    this.vx = x - this.x;
    this.vy = y - this.y;

    if (this.swipeId != TouchSwipe.NOT_A_SWIPE) {
      var pi2 = Math.PI * 2;
      var pi_2 = Math.PI / 2;
      var a = (pi2 + Math.atan2(this.vy, this.vx) + Math.PI / 4) % pi2;
      var direction = Math.floor(a / pi_2)

      if (TouchSwipe.NOT_DEFINED_YET == this.swipeId) this.swipeId = direction;
      else if (this.swipeId != TouchSwipe.NOT_A_SWIPE && direction != this.swipeId) this.swipeId = TouchSwipe.NOT_A_SWIPE;
    }

    this.x = x;
    this.y = y;
    this.actif = true;
    this.dispatchEvent(TouchEvents.MOVE);
  }

  public isTap(timeLimit: number): boolean {
    return (new Date().getTime() - this.startTime) < timeLimit;
  }
}
