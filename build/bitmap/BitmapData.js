class BitmapData extends EventDispatcher {
    constructor(w = 1, h = 1, cssColor = null) {
        super();
        this.offsetX = 0;
        this.offsetY = 0;
        this.needsUpdate = false; // can be used from an external class
        this._maskTemp = null;
        this._filterTemp = null;
        this._imageData = null;
        this.pixelDataDirty = true;
        this.sourceUrl = null;
        if (!Browser.canUseOffscreenCanvas)
            this.canvas = document.createElement("canvas");
        else
            this.canvas = new window.OffscreenCanvas(w, h);
        console.warn("createBitmapData ", w, h);
        this.canvas.width = w;
        this.canvas.height = h;
        this.ctx = this.canvas.getContext("2d");
        this.pixel = BitmapPixel.instance;
        if (cssColor) {
            this.ctx.fillStyle = cssColor;
            this.ctx.fillRect(0, 0, w, h);
        }
    }
    get htmlCanvas() { return this.canvas; }
    get context() { return this.ctx; }
    saveData() {
        var o = {
            data: this.ctx.getImageData(0, 0, this.width, this.height),
            w: this.width,
            h: this.height
        };
        this._savedData = o;
    }
    restoreData(clearSavedData = true) {
        if (!this._savedData)
            return;
        this.canvas.width = this._savedData.w;
        this.canvas.height = this._savedData.h;
        this.putImageData(this._savedData.data, 0, 0);
        if (clearSavedData)
            this._savedData = null;
    }
    setPadding(left = 0, right = 0, top = 0, bottom = 0) {
        var abstract = BitmapData.abstractCanvas;
        var ctx = BitmapData.abstractContext;
        abstract.width = this.width;
        abstract.height = this.height;
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.drawImage(this.htmlCanvas, 0, 0);
        this.canvas.width = this.width + left + right;
        this.canvas.height = this.height + top + bottom;
        this.drawImage(abstract, left, top);
    }
    createImageBitmap() {
        return createImageBitmap(this.htmlCanvas, 0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
    }
    get width() { return this.canvas.width; }
    set width(n) { this.canvas.width = n; }
    get height() { return this.canvas.height; }
    set height(n) { this.canvas.height = n; }
    getImageData(x, y, w, h) {
        this._imageData = this.ctx.getImageData(x, y, w, h);
        return this._imageData;
    }
    putImageData(data, x, y) {
        this.ctx.putImageData(data, x, y);
    }
    drawDisplayElement(displayElement, matrix = null) {
        this.context.save();
        if (matrix)
            this.context.setTransform(matrix);
        displayElement.renderStack.updateCache(this.context, displayElement);
        this.context.restore();
    }
    drawHtmlCode(htmlCodeSource, x, y, w, h) {
        /*
        Example :
        var bd = new BitmapData(800,600);
        bd.drawHtmlCode("<div>BLABLABLA</div>",200,20,0,0);
         */
        var data = "<svg xmlns='http://www.w3.org/2000/svg' width='" + w + "' height='" + h + "'>" +
            "<foreignObject width='100%' height='100%'>" +
            "<div xmlns='http://www.w3.org/1999/xhtml'>" +
            htmlCodeSource +
            "</div>" +
            "</foreignObject>" +
            "</svg>";
        var DOMURL = self.URL || self;
        var img = new Image();
        var svg = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
        var url = DOMURL.createObjectURL(svg);
        var context = this.context;
        img.onload = function () {
            context.drawImage(img, x, y);
            DOMURL.revokeObjectURL(url);
        };
        img.src = url;
    }
    /*
    public loadImage(url:string,useImageSize:boolean=true,centerInto:boolean=false):Img{
  
  
      var image = new Img(url);
      var img = image.htmlImage;
      var th = this;
      var px:number = 0,py:number = 0;
  
      image.addEventListener(Img.IMAGE_LOADED,function(){
        //console.log("img loaded")
        image.clearEvents();
        th.context.clearRect(0,0,th.width,th.height);
  
        if(useImageSize){
          th.width = img.width;
          th.height = img.height;
          th.context.drawImage(img,0,0);
        }else{
  
          if(centerInto){
            let w = img.width,h = img.height;
            let s = th.width / img.width;
            w *= s;
            h *= s;
            if(h > th.height){
              s = th.height / img.height;
              w *= s;
              h *= s;
            }
            px = (th.width - w) * 0.5;
            py = (th.height - h) * 0.5;
  
          }
          th.context.drawImage(img,0,0,img.width,img.height,px,py,th.width,th.height)
        }
  
        th.dispatchEvent(BitmapData.IMAGE_LOADED);
      })
      return image;
  
    }
    */
    clone() {
        var bd = new BitmapData(this.width, this.height);
        bd.context.drawImage(this.htmlCanvas, 0, 0, this.width, this.height);
        return bd;
    }
    resize(w, h, resultBd = null) {
        if (!resultBd)
            resultBd = this;
        var oldW = resultBd.width;
        var oldH = resultBd.height;
        var abstract = BitmapData.abstractCanvas;
        var ctx = BitmapData.abstractContext;
        abstract.width = w;
        abstract.height = h;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(this.htmlCanvas, 0, 0, this.width, this.height, 0, 0, w, h);
        resultBd.width = w;
        resultBd.height = h;
        resultBd.clear();
        resultBd.context.drawImage(abstract, 0, 0, w, h);
        return resultBd;
    }
    resizeWithAntialazing(w, h, resultBd) {
        if (!resultBd)
            resultBd = this;
        if (w >= resultBd.width && h >= resultBd.height)
            return this.resize(w, h, resultBd);
        var oldW = resultBd.width;
        var oldH = resultBd.height;
        var abstract = BitmapData.abstractCanvas;
        var ctx = BitmapData.abstractContext;
        ctx.clearRect(0, 0, abstract.width, abstract.height);
        abstract.width = oldW;
        abstract.height = oldH;
        ctx.drawImage(this.htmlCanvas, 0, 0);
        var nbPass = 0;
        while (oldW / 2 > w || oldH / 2 > h) {
            if (oldW / 2 > w)
                oldW /= 2;
            if (oldH / 2 > h)
                oldH /= 2;
            ctx.clearRect(0, 0, abstract.width, abstract.height);
            abstract.width = oldW;
            abstract.height = oldH;
            if (nbPass++ == 0)
                ctx.drawImage(this.htmlCanvas, 0, 0, this.width, this.height, 0, 0, oldW, oldH);
            else
                ctx.drawImage(resultBd.htmlCanvas, 0, 0, this.width, this.height, 0, 0, oldW, oldH);
            resultBd.clear();
            resultBd.width = oldW;
            resultBd.height = oldH;
            resultBd.context.drawImage(abstract, 0, 0);
        }
        if (w != oldW || h != oldH) {
            resultBd.clear();
            resultBd.width = w;
            resultBd.height = h;
            resultBd.context.drawImage(abstract, 0, 0, abstract.width, abstract.height, 0, 0, w, h);
        }
        return resultBd;
    }
    /*
    public applyBitmapDataAsFilter(bitmap:Bitmap,compositeOperation:string="destination-out"):void{
      if(this._filterTemp == null) this._filterTemp = this.clone();
  
      this.context.save();
      this.clear();
  
      bitmap.updateAsFilter(this.context);
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.globalCompositeOperation = compositeOperation;
      this.context.drawImage(this._filterTemp.htmlCanvas,0,0);
      this.context.restore();
    }
    */
    get pixelView() {
        if (!this._imageData)
            this._imageData = this.context.getImageData(0, 0, this.width, this.height);
        return this.pixel.init(this._imageData.data, this.width, this.height);
    }
    tint(r, g, b, a = 1) {
        var temp = BitmapData.abstractCanvas;
        var tempCtx = BitmapData.abstractContext;
        if (temp.width != this.width || temp.height != this.height) {
            temp.width = this.width;
            temp.height = this.height;
        }
        else {
            tempCtx.clearRect(0, 0, this.width, this.height);
        }
        tempCtx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
        tempCtx.fillRect(0, 0, this.width, this.height);
        tempCtx.globalCompositeOperation = "destination-atop";
        tempCtx.drawImage(this.htmlCanvas, 0, 0);
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.drawImage(temp, 0, 0);
    }
    fillRect(x, y, w, h, cssColor) {
        this.context.fillStyle = cssColor;
        this.context.fillRect(x, y, w, h);
        this.pixelDataDirty = true;
    }
    get pixelData() {
        if (!this._imageData || this.pixelDataDirty)
            this._imageData = this.context.getImageData(0, 0, this.width, this.height);
        this.pixelDataDirty = false;
        this.pixels = this._imageData.data;
        return this.pixels;
    }
    getPixels(x, y, w, h) {
        return this.context.getImageData(x, y, w, h).data;
    }
    getPixel(x, y) {
        var id = (this.width * y + x) * 4;
        var p = this.pixelData;
        var o = this.pixel;
        o.r = p[id];
        o.g = p[id + 1];
        o.b = p[id + 2];
        o.a = p[id + 3];
        return o;
    }
    getPixelRGBIntColor(x, y) {
        var id = (this.width * y + x) * 4;
        var p = this.pixelData;
        return (p[id] << 16) | (p[id + 1] << 8) | p[id + 2];
    }
    getPixelRGBAIntColor(x, y) {
        var id = (this.width * y + x) * 4;
        var p = this.pixelData;
        return p[id + 3] << 24 | p[id] << 16 | p[id + 1] << 8 | p[id + 2];
    }
    getPixelRed(x, y) { return this.pixelData[(this.width * y + x) * 4]; }
    getPixelGreen(x, y) { return this.pixelData[(this.width * y + x) * 4 + 1]; }
    getPixelBlue(x, y) { return this.pixelData[(this.width * y + x) * 4 + 2]; }
    getPixelAlpha(x, y) { return this.pixelData[(this.width * y + x) * 4 + 3]; }
    clear() { this.context.clearRect(0, 0, this.width, this.height); }
    applyFilter(cssFilterStr) {
        this.context.filter = cssFilterStr;
        this.context.drawImage(this.htmlCanvas, 0, 0);
        this.context.filter = "";
    }
    drawImage(img, srcX = 0, srcY = 0, srcW = -1, srcH = -1, destX = 0, destY = 0, destW = -1, destH = -1) {
        if (srcW == -1) {
            srcW = img.width;
            srcH = img.height;
        }
        if (destW == -1) {
            destW = srcW;
            destH = srcH;
        }
        this.context.drawImage(img, srcX, srcY, srcW, srcH, destX, destY, destW, destH);
        this.pixelDataDirty = true;
    }
    setImageData(imgData, x, y) {
        this._imageData = imgData;
        this.context.putImageData(imgData, x, y);
        this.pixelDataDirty = false;
    }
    applyImageData() {
        this.context.putImageData(this._imageData, 0, 0);
        this.pixelDataDirty = false;
    }
    //-------------FLOOD FILL ------------------------------------------------
    floodFillRGBAandReturnOutputCanvas(x, y, fillR, fillG, fillB, fillA = 255) {
        let outputCanvas = new BitmapData(this.width, this.height, 'rgba(0,0,0,0)');
        let outputDatas = outputCanvas.pixelData;
        let data = this.pixelData;
        var borderLen = 0;
        var borders = [];
        borders[0] = [{ x: x, y: y }];
        let currentBorder = borders[0];
        let nextBorder = currentBorder;
        let working = true;
        let i, nbPixel;
        let px, py, k;
        let bmpW = this.width, bmpH = this.height;
        let minX = 9999999, minY = 9999999, maxX = 0, maxY = 0;
        let id = (bmpW * y + x) * 4;
        let outputId;
        let r = data[id];
        let g = data[id + 1];
        let b = data[id + 2];
        let a = data[id + 3];
        data[id] = fillR;
        data[id + 1] = fillG;
        data[id + 2] = fillB;
        data[id + 3] = fillA;
        var w = this.width;
        var h = this.height;
        while (working) {
            currentBorder = nextBorder;
            borders[borderLen++] = nextBorder = [];
            nbPixel = currentBorder.length;
            k = 0;
            if (0 == nbPixel)
                working = false;
            for (i = 0; i < nbPixel; i++) {
                x = currentBorder[i].x;
                y = currentBorder[i].y;
                if (x < 0 || y < 0 || x >= w || y >= h)
                    continue;
                if (x > maxX)
                    maxX = x;
                if (x < minX)
                    minX = x;
                if (y > maxY)
                    maxY = y;
                if (y < minY)
                    minY = y;
                //if(x<0 || y<0) console.log("error = ",x,y);
                //topLeft
                px = x - 1;
                py = y - 1;
                //if(px >=0 && py >=0){
                id = (bmpW * py + px) * 4;
                if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
                    data[id] = outputDatas[id] = fillR;
                    data[id + 1] = outputDatas[id + 1] = fillG;
                    data[id + 2] = outputDatas[id + 2] = fillB;
                    data[id + 3] = outputDatas[id + 3] = fillA;
                    nextBorder[k++] = { x: px, y: py };
                }
                //}
                //top
                px = x;
                py = y - 1;
                //if(py >=0){
                id = (bmpW * py + px) * 4;
                if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
                    data[id] = outputDatas[id] = fillR;
                    data[id + 1] = outputDatas[id + 1] = fillG;
                    data[id + 2] = outputDatas[id + 2] = fillB;
                    data[id + 3] = outputDatas[id + 3] = fillA;
                    nextBorder[k++] = { x: px, y: py };
                }
                //}
                //topRight
                px = x + 1;
                py = y - 1;
                //if(py >=0 && px<=bmpW){
                id = (bmpW * py + px) * 4;
                if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
                    data[id] = outputDatas[id] = fillR;
                    data[id + 1] = outputDatas[id + 1] = fillG;
                    data[id + 2] = outputDatas[id + 2] = fillB;
                    data[id + 3] = outputDatas[id + 3] = fillA;
                    nextBorder[k++] = { x: px, y: py };
                }
                //}
                //right
                px = x + 1;
                py = y;
                //if(px <= bmpW){
                id = (bmpW * py + px) * 4;
                if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
                    data[id] = outputDatas[id] = fillR;
                    data[id + 1] = outputDatas[id + 1] = fillG;
                    data[id + 2] = outputDatas[id + 2] = fillB;
                    data[id + 3] = outputDatas[id + 3] = fillA;
                    nextBorder[k++] = { x: px, y: py };
                }
                //}
                //bottom right
                px = x + 1;
                py = y + 1;
                //if(px <= bmpW && py <= bmpH){
                id = (bmpW * py + px) * 4;
                if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
                    data[id] = outputDatas[id] = fillR;
                    data[id + 1] = outputDatas[id + 1] = fillG;
                    data[id + 2] = outputDatas[id + 2] = fillB;
                    data[id + 3] = outputDatas[id + 3] = fillA;
                    nextBorder[k++] = { x: px, y: py };
                }
                //}
                //bottom
                px = x;
                py = y + 1;
                id = (bmpW * py + px) * 4;
                if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
                    data[id] = outputDatas[id] = fillR;
                    data[id + 1] = outputDatas[id + 1] = fillG;
                    data[id + 2] = outputDatas[id + 2] = fillB;
                    data[id + 3] = outputDatas[id + 3] = fillA;
                    nextBorder[k++] = { x: px, y: py };
                }
                //}
                //bottomLeft
                px = x - 1;
                py = y + 1;
                id = (bmpW * py + px) * 4;
                if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
                    data[id] = outputDatas[id] = fillR;
                    data[id + 1] = outputDatas[id + 1] = fillG;
                    data[id + 2] = outputDatas[id + 2] = fillB;
                    data[id + 3] = outputDatas[id + 3] = fillA;
                    nextBorder[k++] = { x: px, y: py };
                }
                //}
                //left
                px = x - 1;
                py = y;
                id = (bmpW * py + px) * 4;
                if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
                    data[id] = outputDatas[id] = fillR;
                    data[id + 1] = outputDatas[id + 1] = fillG;
                    data[id + 2] = outputDatas[id + 2] = fillB;
                    data[id + 3] = outputDatas[id + 3] = fillA;
                    nextBorder[k++] = { x: px, y: py };
                }
                //}
            }
        }
        this.applyImageData();
        outputCanvas.applyImageData();
        var w = maxX - minX;
        var h = maxY - minY;
        BitmapData.abstractCanvas.width = w;
        BitmapData.abstractCanvas.height = h;
        BitmapData.abstractContext.drawImage(outputCanvas.htmlCanvas, -minX, -minY);
        outputCanvas.width = w;
        outputCanvas.height = h;
        outputCanvas.context.drawImage(BitmapData.abstractCanvas, 0, 0);
        outputCanvas.offsetX = minX;
        outputCanvas.offsetY = minY;
        return outputCanvas;
    }
    floodFillRGBA(x, y, fillR, fillG, fillB, fillA = 255) {
        let data = this.pixelData;
        var borderLen = 0;
        var borders = [];
        borders[0] = [{ x: x, y: y }];
        let currentBorder = borders[0];
        let nextBorder = currentBorder;
        let working = true;
        let i, nbPixel;
        let px, py, k;
        let bmpW = this.width, bmpH = this.height;
        let minX = 9999999, minY = 9999999, maxX = 0, maxY = 0;
        let id = (bmpW * y + x) * 4;
        let r = data[id];
        let g = data[id + 1];
        let b = data[id + 2];
        let a = data[id + 3];
        data[id] = fillR;
        data[id + 1] = fillG;
        data[id + 2] = fillB;
        data[id + 3] = fillA;
        while (working) {
            currentBorder = nextBorder;
            borders[borderLen++] = nextBorder = [];
            nbPixel = currentBorder.length;
            k = 0;
            if (0 == nbPixel)
                working = false;
            for (i = 0; i < nbPixel; i++) {
                x = currentBorder[i].x;
                y = currentBorder[i].y;
                if (x > maxX)
                    maxX = x;
                if (x < minX)
                    minX = x;
                if (y > maxY)
                    maxY = y;
                if (y < minY)
                    minY = y;
                //topLeft
                px = x - 1;
                py = y - 1;
                //if(px >=0 && py >=0){
                id = (bmpW * py + px) * 4;
                if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
                    data[id] = fillR;
                    data[id + 1] = fillG;
                    data[id + 2] = fillB;
                    data[id + 3] = fillA;
                    nextBorder[k++] = { x: px, y: py };
                }
                //}
                //top
                px = x;
                py = y - 1;
                //if(py >=0){
                id = (bmpW * py + px) * 4;
                if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
                    data[id] = fillR;
                    data[id + 1] = fillG;
                    data[id + 2] = fillB;
                    data[id + 3] = fillA;
                    nextBorder[k++] = { x: px, y: py };
                }
                //}
                //topRight
                px = x + 1;
                py = y - 1;
                //if(py >=0 && px<=bmpW){
                id = (bmpW * py + px) * 4;
                if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
                    data[id] = fillR;
                    data[id + 1] = fillG;
                    data[id + 2] = fillB;
                    data[id + 3] = fillA;
                    nextBorder[k++] = { x: px, y: py };
                }
                //}
                //right
                px = x + 1;
                py = y;
                //if(px <= bmpW){
                id = (bmpW * py + px) * 4;
                if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
                    data[id] = fillR;
                    data[id + 1] = fillG;
                    data[id + 2] = fillB;
                    data[id + 3] = fillA;
                    nextBorder[k++] = { x: px, y: py };
                }
                //}
                //bottom right
                px = x + 1;
                py = y + 1;
                //if(px <= bmpW && py <= bmpH){
                id = (bmpW * py + px) * 4;
                if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
                    data[id] = fillR;
                    data[id + 1] = fillG;
                    data[id + 2] = fillB;
                    data[id + 3] = fillA;
                    nextBorder[k++] = { x: px, y: py };
                }
                //}
                //bottom
                px = x;
                py = y + 1;
                //if(py <= bmpH){
                id = (bmpW * py + px) * 4;
                if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
                    data[id] = fillR;
                    data[id + 1] = fillG;
                    data[id + 2] = fillB;
                    data[id + 3] = fillA;
                    nextBorder[k++] = { x: px, y: py };
                }
                //}
                //bottomLeft
                px = x - 1;
                py = y + 1;
                //if(px >= 0 && py <= bmpH){
                id = (bmpW * py + px) * 4;
                if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
                    data[id] = fillR;
                    data[id + 1] = fillG;
                    data[id + 2] = fillB;
                    data[id + 3] = fillA;
                    nextBorder[k++] = { x: px, y: py };
                }
                //}
                //left
                px = x - 1;
                py = y;
                //if(px >= 0 && py <= bmpH){
                id = (bmpW * py + px) * 4;
                if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
                    data[id] = fillR;
                    data[id + 1] = fillG;
                    data[id + 2] = fillB;
                    data[id + 3] = fillA;
                    nextBorder[k++] = { x: px, y: py };
                }
                //}
            }
        }
        this.context.putImageData(this._imageData, 0, 0);
        this.pixelDataDirty = false;
        return { pixels: borders, bounds: new Rectangle2D(minX, minY, maxX, maxY) };
    }
    matchColor(x, y, r, g, b, a) {
        let data = this.pixelData;
        let id = (this.width * y + x) * 4;
        return r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3];
    }
    matchRed(x, y, value) { return value == this.pixelData[(this.width * y + x) * 4]; }
    matchGreen(x, y, value) { return value == this.pixelData[(this.width * y + x) * 4 + 1]; }
    matchBlue(x, y, value) { return value == this.pixelData[(this.width * y + x) * 4 + 2]; }
    matchAlpha(x, y, value) {
        //var v:number = this.pixelData[(this.w * y + x)*4+3];
        //if(v != 0 && v != 255) console.log(v);
        return value == this.pixelData[(this.width * y + x) * 4 + 3];
    }
    isOpaque(x, y) { return 255 == this.pixelData[(this.width * y + x) * 4 + 3]; }
    //---------- COLOR BOUND RECT --------------------------------
    getColorBoundRect(areaX, areaY, areaW, areaH, r, g, b, a, tolerance = 0, toleranceG = null, toleranceB = null, toleranceA = null) {
        let minX = 9999999, minY = 9999999, maxX = -99999999, maxY = -99999999;
        let p = this.getPixels(areaX, areaY, areaW, areaH);
        let i, len = p.length;
        let cr, cg, cb, ca, x, y, n;
        if (toleranceG == null)
            toleranceG = toleranceB = toleranceA = tolerance;
        else if (toleranceB == null) {
            toleranceB = tolerance;
            toleranceA = toleranceG;
        }
        else if (toleranceA == null)
            toleranceA = tolerance;
        for (i = 0; i < len; i += 4) {
            cr = p[i];
            cg = p[i + 1];
            cb = p[i + 2];
            ca = p[i + 3];
            if (cr >= r - tolerance && cr <= r + tolerance && cg >= g - toleranceG && cg <= g + toleranceG && cb >= b - toleranceB && cb <= b + toleranceB && ca >= a - toleranceA && ca <= a + toleranceA) {
                n = i * 0.25;
                x = i % areaW;
                y = (n / areaW) >> 0; // (val >> 0) ==> Math.floor
                if (x < minX)
                    minX = x;
                if (x > maxX)
                    maxX = x;
                if (y < minY)
                    minY = y;
                if (y > maxY)
                    maxY = y;
            }
        }
        if (minX == 9999999)
            return null;
        return { x: minX, y: minY, w: (maxX - minX), h: (maxY - minY) };
    }
    getRedChannelBoundRect(areaX, areaY, areaW, areaH, channelMin, channelMax) {
        return this.getChannelBoundRect(areaX, areaY, areaW, areaH, channelMin, channelMax, 0);
    }
    getGreenChannelBoundRect(areaX, areaY, areaW, areaH, channelMin, channelMax) {
        return this.getChannelBoundRect(areaX, areaY, areaW, areaH, channelMin, channelMax, 1);
    }
    getBlueChannelBoundRect(areaX, areaY, areaW, areaH, channelMin, channelMax) {
        return this.getChannelBoundRect(areaX, areaY, areaW, areaH, channelMin, channelMax, 2);
    }
    getAlphaChannelBoundRect(areaX, areaY, areaW, areaH, channelMin, channelMax) {
        return this.getChannelBoundRect(areaX, areaY, areaW, areaH, channelMin, channelMax, 3);
    }
    getChannelBoundRect(areaX, areaY, areaW, areaH, channelMin, channelMax, channelId = 3) {
        let minX = 9999999, minY = 9999999, maxX = -99999999, maxY = -99999999;
        let p = this.getPixels(areaX, areaY, areaW, areaH);
        let i, len = p.length;
        let c, x, y, n;
        let debug = "";
        for (i = 0; i < len; i += 4) {
            c = p[i + channelId];
            if (c >= channelMin && c <= channelMax) {
                n = i * 0.25;
                y = (n / areaW) >> 0; // (val >> 0) ==> Math.floor
                x = n % areaW;
                if (x < minX)
                    minX = x;
                if (x > maxX)
                    maxX = x;
                if (y < minY)
                    minY = y;
                if (y > maxY)
                    maxY = y;
            }
        }
        if (minX == 9999999 || (maxX - minX) == 0 || (maxY - minY) == 0)
            return null;
        return { x: minX, y: minY, w: (maxX - minX + 1), h: (maxY - minY + 1) };
    }
}
BitmapData.IMAGE_LOADED = "IMAGE_LOADED";
BitmapData.nameIndex = 0;
BitmapData.abstractCanvas = document.createElement("canvas");
BitmapData.abstractContext = BitmapData.abstractCanvas.getContext("2d");
//# sourceMappingURL=BitmapData.js.map