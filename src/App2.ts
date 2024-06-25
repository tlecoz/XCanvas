import { ObjectLibrary } from "./utils/ObjectLibrary";

import * as classes from "./index";

export class App2 {

  constructor() {

    ObjectLibrary.classes = classes;
    var stage;
    ObjectLibrary.instance.load("test.txt", function () {
      ObjectLibrary.print()
      //ObjectLibrary.printElements("RenderStackElement")

      stage = ObjectLibrary.instance.getElementsByName("Stage2D")[0];
      stage.setStage(stage);
      console.log(stage)

      animate()
    })

    function animate() {

      stage.drawElements();
      requestAnimationFrame(animate);
    }


  }


}
