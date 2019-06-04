class App2 {

  constructor(){

    var stage;
    ObjectLibrary.instance.load("test.txt",function(){
      ObjectLibrary.print()
      //ObjectLibrary.printElements("RenderStackElement")

      stage = ObjectLibrary.instance.getElementsByName("Stage2D")[0];
      stage.setStage(stage);
      console.log(stage)

      animate()
    })

    function animate(){
    
        stage.drawElements();
      requestAnimationFrame(animate);
    }


  }


}
