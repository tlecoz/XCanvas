class CssFilter {

  public filter:string = "";
  public offsetX:number;
  public offsetY:number;




  constructor(cssFilterValue:string=null){
    this.clear();
    if(cssFilterValue) this.filter = cssFilterValue;
  }
  public clear():void{
    this.filter = "";
    this.offsetX = this.offsetY = 0;
  }
  public dropShadow(offsetX:number,offsetY:number,radius:number,color:string):CssFilter{
    //offsetX *= this.screenScale;
    //offsetY *= this.screenScale;
    //radius *= this.screenScale;
    this.filter += "drop-shadow("+offsetX+"px "+offsetY+"px "+radius+"px "+color+") ";
    //console.log(radius)
    var ox:number = Math.abs(offsetX) + radius * 4;
    var oy:number = Math.abs(offsetY) + radius * 4;
    if(this.offsetX < ox) this.offsetX = ox;
    if(this.offsetY < oy) this.offsetY = oy

    return this;
  }
  public blur(intensity:number):CssFilter{
    //intensity *= this.screenScale;
    this.filter += "blur("+intensity+"px) ";
    intensity *= Math.sqrt(2);
    if(this.offsetX < intensity) this.offsetX = intensity;
    if(this.offsetY < intensity) this.offsetY = intensity;
    return this;
  }

  public halo(intensity:number,color:string="#ffffff"):CssFilter{
    //intensity *= this.screenScale;
    /*this.useHalo = true;
    this.haloColor = color;
    this.haloIntensity = intensity;
    if(this.offsetX < intensity) this.offsetX = intensity;
    if(this.offsetY < intensity) this.offsetY = intensity;*/
    this.dropShadow(0,0,intensity,color);
    return this;
  }


  public brightness(intensity:number=0.5):CssFilter{
    this.filter += "brightness("+intensity+") ";
    return this;
  }
  public contrast(intensity:number=1.5):CssFilter{
    intensity *= 100;
    this.filter += "contrast("+intensity+"%) ";
    return this;
  }
  public grayscale(intensity:number=0.5):CssFilter{
    intensity *= 100;
    this.filter += "grayscale("+intensity+"%) ";
    return this;
  }
  public hueRotate(angleInDegree:number=90):CssFilter{
    this.filter += "hue-rotate("+angleInDegree+"deg) ";
    return this;
  }
  public invert(intensity:number=0.5):CssFilter{
    intensity *= 100;
    this.filter += "invert("+intensity+"%) ";
    return this;
  }
  public opacity(intensity:number=0.5):CssFilter{
    intensity *= 100;
    this.filter += "opacity("+intensity+"%) ";
    return this;
  }
  public saturate(intensity:number=0.5):CssFilter{
    intensity *= 100;
    this.filter += "saturate("+intensity+"%) ";
    return this;
  }
  public sepia(intensity:number=0.5):CssFilter{
    intensity *= 100;
    this.filter += "sepia("+intensity+"%) ";
    return this;
  }
}
