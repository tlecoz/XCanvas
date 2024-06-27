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
    document.addEventListener("keydown", (e) => {
      this.keyCode = e.keyCode;
      this.isDown[th.keyCode] = true;
      this.dispatchEvent(KeyboardEvents.KEY_DOWN);
      this.dispatchEvent(KeyboardEvents.CHANGED);
    })

    document.addEventListener("keyup", (e) => {
      this.keyCode = e.keyCode;
      this.isDown[th.keyCode] = false;
      this.dispatchEvent(KeyboardEvents.KEY_DOWN);
      this.dispatchEvent(KeyboardEvents.CHANGED);
    })
  }


  public keyIsDown(keyCode: number): boolean { return this.isDown[keyCode] };
}
