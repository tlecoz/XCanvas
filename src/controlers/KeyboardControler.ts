import { EventDispatcher } from "../events/EventDispatcher";
import { KeyboardEvents } from "../events/KeyboardEvents";

export class KeyboardControler extends EventDispatcher {
  public isDown: boolean[];
  public keyCode: number = -1;

  constructor() {
    super();
    this.isDown = [];
    for (var i: number = 0; i < 222; i++) this.isDown[i] = false;

    var th = this;
    document.addEventListener("keydown", function (e) {
      th.keyCode = e.keyCode;
      th.isDown[th.keyCode] = true;
      th.dispatchEvent(KeyboardEvents.KEY_DOWN);
      th.dispatchEvent(KeyboardEvents.CHANGED);
    })

    document.addEventListener("keyup", function (e) {
      th.keyCode = e.keyCode;
      th.isDown[th.keyCode] = false;
      th.dispatchEvent(KeyboardEvents.KEY_DOWN);
      th.dispatchEvent(KeyboardEvents.CHANGED);
    })
  }


  public keyIsDown(keyCode: number): boolean { return this.isDown[keyCode] };
}
