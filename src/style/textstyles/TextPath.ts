class TextPath extends RegisterableObject {

  public text:string;

  constructor(text:string){
    super();
    this.text = text;
  }

  public get dataString():string{return this.text;}
  public static fromDataString(data:string){return new TextPath(data);}



  public isPointInside(context,px:number,py:number,isStroke:boolean,fillrule="nonzero"):boolean{
    return false;
  }
  public isPointInPath(context:CanvasRenderingContext2D,px:number,py:number):boolean{
    return false;
  }
  public isPointInStroke(context:CanvasRenderingContext2D,px:number,py:number):boolean{
    return false;
  }
}
