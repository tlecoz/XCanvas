(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global["xcanvas-ts"] = {}));
})(this, function(exports2) {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  const _ObjectLibrary = class _ObjectLibrary {
    constructor() {
      __publicField(this, "objects");
      __publicField(this, "names");
      __publicField(this, "indexByName");
      __publicField(this, "objectById");
      __publicField(this, "nbObject", 0);
      __publicField(this, "loadObjectsByID");
      if (!_ObjectLibrary._instance) {
        _ObjectLibrary._instance = this;
        this.objects = {};
        this.names = [];
        this.indexByName = {};
        this.objectById = [];
        this.loadObjectsByID = {};
      } else {
        throw new Error("ObjectLibrary is a singleton. You must use ObjectLibrary.instance");
      }
    }
    registerObject(dataType, o) {
      if (_ObjectLibrary.creatingObjectsAfterLoad) {
        return "";
      }
      let id, typeId;
      if (!this.objects[dataType]) {
        this.indexByName[dataType] = typeId = this.names.length;
        this.names.push(dataType);
        this.objects[dataType] = {
          typeId,
          elements: [o]
        };
        id = 0;
      } else {
        var obj = this.objects[dataType];
        typeId = obj.typeId;
        id = obj.elements.length;
        obj.elements[id] = o;
      }
      var ID = typeId + "_" + id;
      this.objectById[this.nbObject++] = {
        type: typeId,
        ID,
        value: o
      };
      return ID;
    }
    /*
      public save(fileName: string = "test.txt") {
        var data: string = this.names.join(",") + "[####]";
        var i: number, len: number = this.nbObject;
        var o: any, dataString: string;
        for (i = 0; i < len; i++) {
          o = this.objectById[i];
          dataString = o.value.dataString;
          if (dataString != "") {
            //console.log(i,o.value);
            if (i != 0) data += "[#]";
            data += o.ID + "[|]" + dataString;
          } else {
            //console.log("error : ",o.value)
          }
        }
    
        var xhr = new XMLHttpRequest();
        var params = "fileName=" + fileName + "&data=" + data;
        xhr.open("POST", "saveFile.php");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {//Call a function when the state changes.
          if (xhr.readyState == 4 && xhr.status == 200) {
            //console.log(xhr.responseText);
          }
        }
        xhr.send(params);
      }*/
    save(fileName = "test.txt") {
      let data = this.names.join(",") + "[####]";
      const len = this.nbObject;
      let o, dataString;
      for (let i = 0; i < len; i++) {
        o = this.objectById[i];
        dataString = o.value.dataString;
        if (dataString !== "") {
          if (i !== 0) data += "[#]";
          data += o.ID + "[|]" + dataString;
        }
      }
      const blob = new Blob([data], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    //@ts-ignore
    load(url, onLoaded) {
      var th = this;
      this.loadObjectsByID = [];
      _ObjectLibrary.creatingObjectsAfterLoad = true;
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "test.txt");
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var datas = xhr.responseText;
          var t = datas.split("[####]");
          th.names = t[0].split(",");
          var i, len = th.names.length;
          for (i = 0; i < len; i++) th.objects[th.names[i]] = { type: i, elements: [] };
          var objects = t[1].split("[#]");
          var dataString, infos;
          var className;
          var ID, instanceId, classId;
          len = objects.length;
          var temp = [];
          for (i = 0; i < len; i++) {
            t = objects[i].split("[|]");
            ID = t[0];
            infos = ID.split("_");
            classId = Number(infos[0]);
            className = th.names[classId];
            instanceId = Number(infos[1]);
            dataString = t[1];
            th.loadObjectsByID[ID] = temp[i] = { className, instanceId, dataString };
          }
          var o;
          for (i = 0; i < len; i++) {
            o = temp[i];
            th.objects[o.className].elements[o.instanceId] = _ObjectLibrary.classes[o.className].fromDataString(o.dataString);
          }
          _ObjectLibrary.creatingObjectsAfterLoad = false;
          if (onLoaded) onLoaded(xhr.responseText);
        }
      };
      xhr.send(null);
    }
    static get instance() {
      if (!_ObjectLibrary._instance) new _ObjectLibrary();
      return _ObjectLibrary._instance;
    }
    get dataTypes() {
      return this.names;
    }
    getElementsByName(name) {
      return this.objects[name].elements;
    }
    getObjectByRegisterId(registerId) {
      let t = registerId.split("_");
      let o = this.objects[this.names[Number(t[0])]].elements[Number(t[1])];
      if (o) return o;
      if (this.loadObjectsByID) {
        let obj = this.loadObjectsByID[registerId];
        if (obj) {
          this.objects[obj.className].elements[obj.instanceId] = o = _ObjectLibrary.classes[obj.className].fromDataString(obj.dataString);
          return o;
        }
      }
      return null;
    }
    static print() {
      var lib = _ObjectLibrary.instance;
      var names = lib.dataTypes;
      var i, len = names.length;
      for (i = 0; i < len; i++) {
        names[i];
      }
    }
    static printElements(name) {
      var t = _ObjectLibrary.instance.getElementsByName(name);
      var i, len = t.length;
      for (i = 0; i < len; i++) console.log(i, " => ", t[i]);
    }
  };
  __publicField(_ObjectLibrary, "classes");
  __publicField(_ObjectLibrary, "_instance");
  __publicField(_ObjectLibrary, "creatingObjectsAfterLoad", false);
  let ObjectLibrary = _ObjectLibrary;
  class RegisterableObject {
    //classNameId_instanceId
    constructor() {
      __publicField(this, "___ID");
      this.___ID = ObjectLibrary.instance.registerObject(this.constructor.name, this);
    }
    get REGISTER_ID() {
      return this.___ID;
    }
    get dataString() {
      return "";
    }
  }
  class EventDispatcher extends RegisterableObject {
    constructor() {
      super();
      __publicField(this, "customData");
      __publicField(this, "___dispatcherNames");
      __publicField(this, "___nbDispatcher");
      __publicField(this, "___dispatcherActifById");
      __publicField(this, "___dispatcherFunctionById");
      this.customData = {};
      this.___dispatcherNames = [];
      this.___nbDispatcher = 0;
      this.___dispatcherActifById = [];
      this.___dispatcherFunctionById = [];
    }
    addEventListener(name, func, overrideExistingEventIfExists = false) {
      if (name == void 0 || func == void 0) return;
      var nameId = this.___dispatcherNames.indexOf(name);
      if (nameId == -1) {
        this.___dispatcherActifById[this.___nbDispatcher] = false;
        this.___dispatcherFunctionById[this.___nbDispatcher] = [];
        nameId = this.___nbDispatcher;
        this.___dispatcherNames[this.___nbDispatcher++] = name;
      }
      if (overrideExistingEventIfExists) this.___dispatcherFunctionById[nameId] = [func];
      else this.___dispatcherFunctionById[nameId].push(func);
    }
    clearEvents() {
      this.___dispatcherNames = [];
      this.___nbDispatcher = 0;
      this.___dispatcherActifById = [];
      this.___dispatcherFunctionById = [];
    }
    removeEventListener(name, func) {
      var id = this.___dispatcherNames.indexOf(name);
      if (id == -1) return;
      if (!func) {
        this.___dispatcherFunctionById[id] = [];
        return;
      }
      var functions = this.___dispatcherFunctionById[id];
      var id2 = functions.indexOf(func);
      if (id2 == -1) return;
      functions.splice(id2, 1);
    }
    applyEvents(object = null) {
      var len = this.___dispatcherNames.length;
      if (0 == len) return;
      var i, j, len2;
      var funcs;
      for (i = 0; i < len; i++) {
        if (this.___dispatcherActifById[i] == true) {
          this.___dispatcherActifById[i] = false;
          funcs = this.___dispatcherFunctionById[i];
          if (funcs) {
            len2 = funcs.length;
            for (j = 0; j < len2; j++) funcs[j](this, object, this.___dispatcherNames[i]);
          } else {
            console.warn("EventDispatcher.applyEvents bug ? -> ", this.___dispatcherNames[i]);
          }
        }
      }
    }
    dispatchEvent(eventName) {
      if (!this.___dispatcherNames) return;
      var id = this.___dispatcherNames.indexOf(eventName);
      if (id == -1) return;
      this.___dispatcherActifById[id] = true;
      this.applyEvents(this);
    }
  }
  class Rectangle2D {
    constructor(minX = 0, minY = 0, maxX = 0, maxY = 0) {
      __publicField(this, "minX", 999999);
      __publicField(this, "minY", 999999);
      __publicField(this, "maxX", -999999);
      __publicField(this, "maxY", -999999);
      this.init(minX, minY, maxX, maxY);
    }
    init(minX = 0, minY = 0, maxX = 0, maxY = 0) {
      this.minX = minX;
      this.minY = minY;
      this.maxX = maxX;
      this.maxY = maxY;
      return this;
    }
    get x() {
      return this.minX;
    }
    set x(n) {
      this.minX = n;
    }
    get y() {
      return this.minY;
    }
    set y(n) {
      this.minY = n;
    }
    get width() {
      return this.maxX - this.minX;
    }
    set width(n) {
      this.maxX = this.minX + n;
    }
    get height() {
      return this.maxY - this.minY;
    }
    set height(n) {
      this.maxY = this.minY + n;
    }
    clear() {
      this.x = this.y = this.width = this.height = 0;
    }
    draw(context) {
      context.save();
      context.strokeStyle = "#000000";
      context.rect(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
      context.stroke();
      context.restore();
    }
  }
  const _Browser = class _Browser {
    constructor() {
      if (!_Browser._instance) {
        _Browser._instance = this;
        _Browser._canUseImageBitmap = createImageBitmap != void 0 && createImageBitmap != null;
        _Browser._canUseWorker = Worker != void 0 && Worker != null;
        _Browser._canUseOffscreenCanvas = window.OffscreenCanvas != void 0 && window.OffscreenCanvas != null;
        var canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        createImageBitmap(canvas).then((bmp) => _Browser.emptyImageBitmap = bmp);
      }
    }
    static get canUseImageBitmap() {
      if (_Browser.disableImageBitmap) return false;
      if (!_Browser._instance) new _Browser();
      return _Browser._canUseImageBitmap;
    }
    static get canUseWorker() {
      if (_Browser.disableWorker) return false;
      if (!_Browser._instance) new _Browser();
      return _Browser._canUseWorker;
    }
    static get canUseOffscreenCanvas() {
      if (_Browser.disableOffscreenCanvas) return false;
      if (!_Browser._instance) new _Browser();
      return _Browser._canUseOffscreenCanvas;
    }
  };
  __publicField(_Browser, "_canUseWorker", false);
  __publicField(_Browser, "_canUseImageBitmap", false);
  __publicField(_Browser, "_canUseOffscreenCanvas", false);
  __publicField(_Browser, "_instance");
  //@ts-ignore
  __publicField(_Browser, "emptyImageBitmap");
  __publicField(_Browser, "disableOffscreenCanvas", false);
  __publicField(_Browser, "disableWorker", false);
  __publicField(_Browser, "disableImageBitmap", false);
  let Browser = _Browser;
  const _BitmapPixel = class _BitmapPixel {
    constructor() {
      __publicField(this, "pixelData");
      __publicField(this, "w");
      __publicField(this, "h");
      __publicField(this, "id");
      if (_BitmapPixel._instance) throw new Error("You must use BitmapPixel.instance");
      _BitmapPixel._instance = this;
    }
    static get instance() {
      if (!_BitmapPixel._instance) new _BitmapPixel();
      return _BitmapPixel._instance;
    }
    init(pixelData, w, h) {
      this.w = w;
      this.h = h;
      this.pixelData = pixelData;
      return this;
    }
    getPixelObject(x, y) {
      this.id = (y * this.w + x) * 4;
      return this;
    }
    setRGB(x, y, r, g, b) {
      var id = (y * this.w + x) * 4;
      this.pixelData[id++] = r;
      this.pixelData[id++] = g;
      this.pixelData[id++] = b;
      this.pixelData[id++] = 255;
    }
    setRGBA(x, y, r, g, b, a) {
      var id = (y * this.w + x) * 4;
      this.pixelData[id++] = r;
      this.pixelData[id++] = g;
      this.pixelData[id++] = b;
      this.pixelData[id++] = a;
    }
    setSolidColorPixel(x, y, solidColor) {
      var id = (y * this.w + x) * 4;
      this.pixelData[id++] = solidColor.r;
      this.pixelData[id++] = solidColor.g;
      this.pixelData[id++] = solidColor.b;
      this.pixelData[id++] = solidColor.a;
    }
    copyIntoSolidColor(x, y, solidColor) {
      var id = (y * this.w + x) * 4;
      solidColor.r = this.pixelData[id++];
      solidColor.b = this.pixelData[id++];
      solidColor.g = this.pixelData[id++];
      solidColor.a = this.pixelData[id++];
    }
    get r() {
      return this.pixelData[this.id];
    }
    get g() {
      return this.pixelData[this.id + 1];
    }
    get b() {
      return this.pixelData[this.id + 2];
    }
    get a() {
      return this.pixelData[this.id + 3];
    }
    set r(n) {
      this.pixelData[this.id] = n;
    }
    set g(n) {
      this.pixelData[this.id + 1] = n;
    }
    set b(n) {
      this.pixelData[this.id + 2] = n;
    }
    set a(n) {
      this.pixelData[this.id + 3] = n;
    }
  };
  __publicField(_BitmapPixel, "_instance");
  let BitmapPixel = _BitmapPixel;
  const _BitmapData = class _BitmapData extends EventDispatcher {
    constructor(w = 1, h = 1, cssColor = null) {
      super();
      //private static _defaultImageBitmap: ImageBitmap;
      __publicField(this, "offsetX", 0);
      __publicField(this, "offsetY", 0);
      __publicField(this, "pixel");
      __publicField(this, "needsUpdate", false);
      // can be used from an external class
      __publicField(this, "_maskTemp", null);
      __publicField(this, "_filterTemp", null);
      __publicField(this, "_imageData", null);
      __publicField(this, "pixels");
      __publicField(this, "pixelDataDirty", true);
      __publicField(this, "useAlphaChannel");
      __publicField(this, "sourceUrl", null);
      __publicField(this, "_savedData");
      __publicField(this, "ctx");
      __publicField(this, "canvas");
      if (!Browser.canUseOffscreenCanvas) this.canvas = document.createElement("canvas");
      else this.canvas = new window.OffscreenCanvas(w, h);
      this.canvas.width = w;
      this.canvas.height = h;
      this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
      this.pixel = BitmapPixel.instance;
      if (cssColor) {
        this.ctx.fillStyle = cssColor;
        this.ctx.fillRect(0, 0, w, h);
      }
    }
    get htmlCanvas() {
      return this.canvas;
    }
    get context() {
      return this.ctx;
    }
    saveData() {
      var o = {
        data: this.ctx.getImageData(0, 0, this.width, this.height),
        w: this.width,
        h: this.height
      };
      this._savedData = o;
    }
    restoreData(clearSavedData = true) {
      if (!this._savedData) return;
      this.canvas.width = this._savedData.w;
      this.canvas.height = this._savedData.h;
      this.putImageData(this._savedData.data, 0, 0);
      if (clearSavedData) this._savedData = null;
    }
    setPadding(left = 0, right = 0, top = 0, bottom = 0) {
      var abstract = _BitmapData.abstractCanvas;
      var ctx = _BitmapData.abstractContext;
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
    get width() {
      return this.canvas.width;
    }
    set width(n) {
      this.canvas.width = n;
    }
    get height() {
      return this.canvas.height;
    }
    set height(n) {
      this.canvas.height = n;
    }
    getImageData(x, y, w, h) {
      this._imageData = this.ctx.getImageData(x, y, w, h);
      return this._imageData;
    }
    putImageData(data, x, y) {
      this.ctx.putImageData(data, x, y);
    }
    drawDisplayElement(displayElement, matrix = null) {
      this.context.save();
      if (matrix) this.context.setTransform(matrix);
      displayElement.renderStack.updateCache(this.context, displayElement);
      this.context.restore();
    }
    drawHtmlCode(htmlCodeSource, x, y, w, h) {
      var data = "<svg xmlns='http://www.w3.org/2000/svg' width='" + w + "' height='" + h + "'><foreignObject width='100%' height='100%'><div xmlns='http://www.w3.org/1999/xhtml'>" + htmlCodeSource + "</div></foreignObject></svg>";
      var DOMURL = self.URL || self;
      var img = new Image();
      var svg = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
      var url = DOMURL.createObjectURL(svg);
      var context = this.context;
      img.onload = function() {
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
      var bd = new _BitmapData(this.width, this.height);
      bd.context.drawImage(this.htmlCanvas, 0, 0, this.width, this.height);
      return bd;
    }
    resize(w, h, resultBd = null) {
      if (!resultBd) resultBd = this;
      var abstract = _BitmapData.abstractCanvas;
      var ctx = _BitmapData.abstractContext;
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
      if (!resultBd) resultBd = this;
      if (w >= resultBd.width && h >= resultBd.height) return this.resize(w, h, resultBd);
      var oldW = resultBd.width;
      var oldH = resultBd.height;
      var abstract = _BitmapData.abstractCanvas;
      var ctx = _BitmapData.abstractContext;
      ctx.clearRect(0, 0, abstract.width, abstract.height);
      abstract.width = oldW;
      abstract.height = oldH;
      ctx.drawImage(this.htmlCanvas, 0, 0);
      var nbPass = 0;
      while (oldW / 2 > w || oldH / 2 > h) {
        if (oldW / 2 > w) oldW /= 2;
        if (oldH / 2 > h) oldH /= 2;
        ctx.clearRect(0, 0, abstract.width, abstract.height);
        abstract.width = oldW;
        abstract.height = oldH;
        if (nbPass++ == 0) ctx.drawImage(this.htmlCanvas, 0, 0, this.width, this.height, 0, 0, oldW, oldH);
        else ctx.drawImage(resultBd.htmlCanvas, 0, 0, this.width, this.height, 0, 0, oldW, oldH);
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
      if (!this._imageData) this._imageData = this.context.getImageData(0, 0, this.width, this.height);
      return this.pixel.init(this._imageData.data, this.width, this.height);
    }
    tint(r, g, b, a = 1) {
      var temp = _BitmapData.abstractCanvas;
      var tempCtx = _BitmapData.abstractContext;
      if (temp.width != this.width || temp.height != this.height) {
        temp.width = this.width;
        temp.height = this.height;
      } else {
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
      if (!this._imageData || this.pixelDataDirty) this._imageData = this.context.getImageData(0, 0, this.width, this.height);
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
      return p[id] << 16 | p[id + 1] << 8 | p[id + 2];
    }
    getPixelRGBAIntColor(x, y) {
      var id = (this.width * y + x) * 4;
      var p = this.pixelData;
      return p[id + 3] << 24 | p[id] << 16 | p[id + 1] << 8 | p[id + 2];
    }
    getPixelRed(x, y) {
      return this.pixelData[(this.width * y + x) * 4];
    }
    getPixelGreen(x, y) {
      return this.pixelData[(this.width * y + x) * 4 + 1];
    }
    getPixelBlue(x, y) {
      return this.pixelData[(this.width * y + x) * 4 + 2];
    }
    getPixelAlpha(x, y) {
      return this.pixelData[(this.width * y + x) * 4 + 3];
    }
    clear() {
      this.context.clearRect(0, 0, this.width, this.height);
    }
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
      let outputCanvas = new _BitmapData(this.width, this.height, "rgba(0,0,0,0)");
      let outputDatas = outputCanvas.pixelData;
      let data = this.pixelData;
      var borderLen = 0;
      var borders = [];
      borders[0] = [{ x, y }];
      let currentBorder = borders[0];
      let nextBorder = currentBorder;
      let working = true;
      let i, nbPixel;
      let px, py, k;
      let bmpW = this.width;
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
      var w = this.width;
      var h = this.height;
      while (working) {
        currentBorder = nextBorder;
        borders[borderLen++] = nextBorder = [];
        nbPixel = currentBorder.length;
        k = 0;
        if (0 == nbPixel) working = false;
        for (i = 0; i < nbPixel; i++) {
          x = currentBorder[i].x;
          y = currentBorder[i].y;
          if (x < 0 || y < 0 || x >= w || y >= h) continue;
          if (x > maxX) maxX = x;
          if (x < minX) minX = x;
          if (y > maxY) maxY = y;
          if (y < minY) minY = y;
          px = x - 1;
          py = y - 1;
          id = (bmpW * py + px) * 4;
          if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
            data[id] = outputDatas[id] = fillR;
            data[id + 1] = outputDatas[id + 1] = fillG;
            data[id + 2] = outputDatas[id + 2] = fillB;
            data[id + 3] = outputDatas[id + 3] = fillA;
            nextBorder[k++] = { x: px, y: py };
          }
          px = x;
          py = y - 1;
          id = (bmpW * py + px) * 4;
          if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
            data[id] = outputDatas[id] = fillR;
            data[id + 1] = outputDatas[id + 1] = fillG;
            data[id + 2] = outputDatas[id + 2] = fillB;
            data[id + 3] = outputDatas[id + 3] = fillA;
            nextBorder[k++] = { x: px, y: py };
          }
          px = x + 1;
          py = y - 1;
          id = (bmpW * py + px) * 4;
          if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
            data[id] = outputDatas[id] = fillR;
            data[id + 1] = outputDatas[id + 1] = fillG;
            data[id + 2] = outputDatas[id + 2] = fillB;
            data[id + 3] = outputDatas[id + 3] = fillA;
            nextBorder[k++] = { x: px, y: py };
          }
          px = x + 1;
          py = y;
          id = (bmpW * py + px) * 4;
          if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
            data[id] = outputDatas[id] = fillR;
            data[id + 1] = outputDatas[id + 1] = fillG;
            data[id + 2] = outputDatas[id + 2] = fillB;
            data[id + 3] = outputDatas[id + 3] = fillA;
            nextBorder[k++] = { x: px, y: py };
          }
          px = x + 1;
          py = y + 1;
          id = (bmpW * py + px) * 4;
          if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
            data[id] = outputDatas[id] = fillR;
            data[id + 1] = outputDatas[id + 1] = fillG;
            data[id + 2] = outputDatas[id + 2] = fillB;
            data[id + 3] = outputDatas[id + 3] = fillA;
            nextBorder[k++] = { x: px, y: py };
          }
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
        }
      }
      this.applyImageData();
      outputCanvas.applyImageData();
      var w = maxX - minX;
      var h = maxY - minY;
      _BitmapData.abstractCanvas.width = w;
      _BitmapData.abstractCanvas.height = h;
      _BitmapData.abstractContext.drawImage(outputCanvas.htmlCanvas, -minX, -minY);
      outputCanvas.width = w;
      outputCanvas.height = h;
      outputCanvas.context.drawImage(_BitmapData.abstractCanvas, 0, 0);
      outputCanvas.offsetX = minX;
      outputCanvas.offsetY = minY;
      return outputCanvas;
    }
    floodFillRGBA(x, y, fillR, fillG, fillB, fillA = 255) {
      let data = this.pixelData;
      var borderLen = 0;
      var borders = [];
      borders[0] = [{ x, y }];
      let currentBorder = borders[0];
      let nextBorder = currentBorder;
      let working = true;
      let i, nbPixel;
      let px, py, k;
      let bmpW = this.width;
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
        if (0 == nbPixel) working = false;
        for (i = 0; i < nbPixel; i++) {
          x = currentBorder[i].x;
          y = currentBorder[i].y;
          if (x > maxX) maxX = x;
          if (x < minX) minX = x;
          if (y > maxY) maxY = y;
          if (y < minY) minY = y;
          px = x - 1;
          py = y - 1;
          id = (bmpW * py + px) * 4;
          if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
            data[id] = fillR;
            data[id + 1] = fillG;
            data[id + 2] = fillB;
            data[id + 3] = fillA;
            nextBorder[k++] = { x: px, y: py };
          }
          px = x;
          py = y - 1;
          id = (bmpW * py + px) * 4;
          if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
            data[id] = fillR;
            data[id + 1] = fillG;
            data[id + 2] = fillB;
            data[id + 3] = fillA;
            nextBorder[k++] = { x: px, y: py };
          }
          px = x + 1;
          py = y - 1;
          id = (bmpW * py + px) * 4;
          if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
            data[id] = fillR;
            data[id + 1] = fillG;
            data[id + 2] = fillB;
            data[id + 3] = fillA;
            nextBorder[k++] = { x: px, y: py };
          }
          px = x + 1;
          py = y;
          id = (bmpW * py + px) * 4;
          if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
            data[id] = fillR;
            data[id + 1] = fillG;
            data[id + 2] = fillB;
            data[id + 3] = fillA;
            nextBorder[k++] = { x: px, y: py };
          }
          px = x + 1;
          py = y + 1;
          id = (bmpW * py + px) * 4;
          if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
            data[id] = fillR;
            data[id + 1] = fillG;
            data[id + 2] = fillB;
            data[id + 3] = fillA;
            nextBorder[k++] = { x: px, y: py };
          }
          px = x;
          py = y + 1;
          id = (bmpW * py + px) * 4;
          if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
            data[id] = fillR;
            data[id + 1] = fillG;
            data[id + 2] = fillB;
            data[id + 3] = fillA;
            nextBorder[k++] = { x: px, y: py };
          }
          px = x - 1;
          py = y + 1;
          id = (bmpW * py + px) * 4;
          if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
            data[id] = fillR;
            data[id + 1] = fillG;
            data[id + 2] = fillB;
            data[id + 3] = fillA;
            nextBorder[k++] = { x: px, y: py };
          }
          px = x - 1;
          py = y;
          id = (bmpW * py + px) * 4;
          if (r == data[id] && g == data[id + 1] && b == data[id + 2] && a == data[id + 3]) {
            data[id] = fillR;
            data[id + 1] = fillG;
            data[id + 2] = fillB;
            data[id + 3] = fillA;
            nextBorder[k++] = { x: px, y: py };
          }
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
    matchRed(x, y, value) {
      return value == this.pixelData[(this.width * y + x) * 4];
    }
    matchGreen(x, y, value) {
      return value == this.pixelData[(this.width * y + x) * 4 + 1];
    }
    matchBlue(x, y, value) {
      return value == this.pixelData[(this.width * y + x) * 4 + 2];
    }
    matchAlpha(x, y, value) {
      return value == this.pixelData[(this.width * y + x) * 4 + 3];
    }
    isOpaque(x, y) {
      return 255 == this.pixelData[(this.width * y + x) * 4 + 3];
    }
    //---------- COLOR BOUND RECT --------------------------------
    getColorBoundRect(areaX, areaY, areaW, areaH, r, g, b, a, tolerance = 0, toleranceG = null, toleranceB = null, toleranceA = null) {
      let minX = 9999999, minY = 9999999, maxX = -99999999, maxY = -99999999;
      let p = this.getPixels(areaX, areaY, areaW, areaH);
      let i, len = p.length;
      let cr, cg, cb, ca, x, y, n;
      if (toleranceG == null) toleranceG = toleranceB = toleranceA = tolerance;
      else if (toleranceB == null) {
        toleranceB = tolerance;
        toleranceA = toleranceG;
      } else if (toleranceA == null) toleranceA = tolerance;
      for (i = 0; i < len; i += 4) {
        cr = p[i];
        cg = p[i + 1];
        cb = p[i + 2];
        ca = p[i + 3];
        if (cr >= r - tolerance && cr <= r + tolerance && cg >= g - toleranceG && cg <= g + toleranceG && cb >= b - toleranceB && cb <= b + toleranceB && ca >= a - toleranceA && ca <= a + toleranceA) {
          n = i * 0.25;
          x = i % areaW;
          y = n / areaW >> 0;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
      if (minX == 9999999) return null;
      return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
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
      for (i = 0; i < len; i += 4) {
        c = p[i + channelId];
        if (c >= channelMin && c <= channelMax) {
          n = i * 0.25;
          y = n / areaW >> 0;
          x = n % areaW;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
      if (minX == 9999999 || maxX - minX == 0 || maxY - minY == 0) return null;
      return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
    }
  };
  __publicField(_BitmapData, "IMAGE_LOADED", "IMAGE_LOADED");
  //private static nameIndex: number = 0;
  __publicField(_BitmapData, "abstractCanvas", document.createElement("canvas"));
  __publicField(_BitmapData, "abstractContext", _BitmapData.abstractCanvas.getContext("2d", { willReadFrequently: true }));
  let BitmapData = _BitmapData;
  class GlobalCompositeOperations {
  }
  __publicField(GlobalCompositeOperations, "DEFAULT", "source-over");
  __publicField(GlobalCompositeOperations, "SOURCE_OVER", "source-over");
  __publicField(GlobalCompositeOperations, "SOURCE_IN", "source-in");
  __publicField(GlobalCompositeOperations, "SOURCE_OUT", "source-out");
  __publicField(GlobalCompositeOperations, "SOURCE_ATOP", "source-atop");
  __publicField(GlobalCompositeOperations, "DESTINATION_OVER", "destination-over");
  __publicField(GlobalCompositeOperations, "DESTINATION_IN", "destination-in");
  __publicField(GlobalCompositeOperations, "DESTINATION_OUT", "destination-out");
  __publicField(GlobalCompositeOperations, "DESTINATION_ATOP", "destination-atop");
  __publicField(GlobalCompositeOperations, "LIGHTER", "lighter");
  __publicField(GlobalCompositeOperations, "LIGHTEN", "lighten");
  __publicField(GlobalCompositeOperations, "OVERLAY", "overlay");
  __publicField(GlobalCompositeOperations, "DARKEN", "darken");
  __publicField(GlobalCompositeOperations, "HARD_LIGHT", "hard-light");
  __publicField(GlobalCompositeOperations, "SOFT_LIGHT", "soft-light");
  __publicField(GlobalCompositeOperations, "COPY", "copy");
  __publicField(GlobalCompositeOperations, "XOR", "xor");
  __publicField(GlobalCompositeOperations, "MULTIPLY", "mutiply");
  __publicField(GlobalCompositeOperations, "SCREEN", "screen");
  __publicField(GlobalCompositeOperations, "COLOR_DODGE", "color-dodge");
  __publicField(GlobalCompositeOperations, "COLOR_BURN", "color-burn");
  __publicField(GlobalCompositeOperations, "DIFFERENCE", "difference");
  __publicField(GlobalCompositeOperations, "EXCLUSION", "exclusion");
  __publicField(GlobalCompositeOperations, "HUE", "hue");
  __publicField(GlobalCompositeOperations, "SATURATION", "saturation");
  __publicField(GlobalCompositeOperations, "COLOR", "color");
  __publicField(GlobalCompositeOperations, "LUMINOSITY", "luminosity");
  __publicField(GlobalCompositeOperations, "MASK_OUTSIDE", "source-atop");
  __publicField(GlobalCompositeOperations, "MASK_INSIDE", "xor");
  const _EarCutting = class _EarCutting {
    constructor() {
      __publicField(this, "CONCAVE", -1);
      //private TANGENTIAL: number = 0;
      __publicField(this, "CONVEX", 1);
      __publicField(this, "indices");
      __publicField(this, "vertices");
      __publicField(this, "vertexCount");
      __publicField(this, "vertexTypes");
      __publicField(this, "triangles");
      if (_EarCutting._instance) throw new Error("You must use EarCutting.instance");
      _EarCutting._instance = this;
      this.vertexTypes = [];
      this.triangles = [];
    }
    static get instance() {
      if (!_EarCutting._instance) new _EarCutting();
      return _EarCutting._instance;
    }
    computeSpannedAreaSign(p1x, p1y, p2x, p2y, p3x, p3y) {
      var area = p1x * (p3y - p2y);
      area += p2x * (p1y - p3y);
      area += p3x * (p2y - p1y);
      if (area < 0) return -1;
      else if (area > 0) return 1;
      else return 0;
    }
    previousIndex(index) {
      return (index == 0 ? this.vertexCount : index) - 1;
    }
    nextIndex(index) {
      return (index + 1) % this.vertexCount;
    }
    classifyVertex(index) {
      let previous = this.indices[this.previousIndex(index)] * 2;
      let current = this.indices[index] * 2;
      let next = this.indices[this.nextIndex(index)] * 2;
      return this.computeSpannedAreaSign(this.vertices[previous], this.vertices[previous + 1], this.vertices[current], this.vertices[current + 1], this.vertices[next], this.vertices[next + 1]);
    }
    areVerticesClockwise(vertices, offset, count) {
      if (count <= 2) return false;
      let area = 0, p1x, p1y, p2x, p2y;
      let i, n;
      for (i = offset, n = offset + count - 3; i < n; i += 2) {
        p1x = vertices[i];
        p1y = vertices[i + 1];
        p2x = vertices[i + 2];
        p2y = vertices[i + 3];
        area += p1x * p2y - p2x * p1y;
      }
      p1x = vertices[count - 2];
      p1y = vertices[count - 1];
      p2x = vertices[0];
      p2y = vertices[1];
      return area + p1x * p2y - p2x * p1y < 0;
    }
    isEarTip(earTipIndex) {
      if (this.vertexTypes[earTipIndex] == this.CONCAVE) return false;
      let _previousIndex = this.previousIndex(earTipIndex);
      let _nextIndex = this.nextIndex(earTipIndex);
      let p1 = this.indices[_previousIndex] * 2;
      let p2 = this.indices[earTipIndex] * 2;
      let p3 = this.indices[_nextIndex] * 2;
      let p1x = this.vertices[p1], p1y = this.vertices[p1 + 1];
      let p2x = this.vertices[p2], p2y = this.vertices[p2 + 1];
      let p3x = this.vertices[p3], p3y = this.vertices[p3 + 1];
      let i, v;
      let vx, vy;
      for (i = this.nextIndex(_nextIndex); i != _previousIndex; i = this.nextIndex(i)) {
        if (this.vertexTypes[i] != this.CONVEX) {
          v = this.indices[i] * 2;
          vx = this.vertices[v];
          vy = this.vertices[v + 1];
          if (this.computeSpannedAreaSign(p3x, p3y, p1x, p1y, vx, vy) >= 0) {
            if (this.computeSpannedAreaSign(p1x, p1y, p2x, p2y, vx, vy) >= 0) {
              if (this.computeSpannedAreaSign(p2x, p2y, p3x, p3y, vx, vy) >= 0) return false;
            }
          }
        }
      }
      return true;
    }
    findEarTip() {
      let i;
      for (i = 0; i < this.vertexCount; i++) if (this.isEarTip(i)) return i;
      for (i = 0; i < this.vertexCount; i++) if (this.vertexTypes[i] != this.CONCAVE) return i;
      return 0;
    }
    cutEarTip(earTipIndex) {
      this.triangles.push(this.indices[this.previousIndex(earTipIndex)]);
      this.triangles.push(this.indices[earTipIndex]);
      this.triangles.push(this.indices[this.nextIndex(earTipIndex)]);
      this.indices.splice(earTipIndex, 1);
      this.vertexTypes.splice(earTipIndex, 1);
      this.vertexCount--;
    }
    triangulate() {
      let earTipIndex = 0;
      let _previousIndex = 0;
      let _nextIndex = 0;
      while (this.vertexCount > 3) {
        earTipIndex = this.findEarTip();
        this.cutEarTip(earTipIndex);
        _previousIndex = this.previousIndex(earTipIndex);
        _nextIndex = earTipIndex == this.vertexCount ? 0 : earTipIndex;
        this.vertexTypes[_previousIndex] = this.classifyVertex(_previousIndex);
        this.vertexTypes[_nextIndex] = this.classifyVertex(_nextIndex);
      }
      if (this.vertexCount == 3) {
        this.triangles.push(this.indices[0]);
        this.triangles.push(this.indices[1]);
        this.triangles.push(this.indices[2]);
      }
    }
    _computeTriangles(arrayXY, offset, count) {
      this.vertices = arrayXY;
      this.vertexCount = count / 2;
      this.indices = [];
      var i, n;
      if (this.areVerticesClockwise(this.vertices, offset, count)) for (i = 0; i < this.vertexCount; i++) this.indices[i] = i;
      else for (i = 0, n = this.vertexCount - 1; i < this.vertexCount; i++) this.indices[i] = n - i;
      this.vertexTypes = [];
      for (i = 0, n = this.vertexCount; i < n; ++i) this.vertexTypes[i] = this.classifyVertex(i);
      this.triangles = [];
      this.triangulate();
      return this.triangles;
    }
    computeTriangles(arrayXY) {
      return this._computeTriangles(arrayXY, 0, arrayXY.length);
    }
  };
  __publicField(_EarCutting, "_instance");
  let EarCutting = _EarCutting;
  const _Geometry = class _Geometry {
    constructor(path = null) {
      __publicField(this, "oldX");
      __publicField(this, "oldY");
      __publicField(this, "minX");
      __publicField(this, "minY");
      __publicField(this, "maxX");
      __publicField(this, "maxY");
      //private bounds: Rectangle2D;
      __publicField(this, "_shapeBounds");
      __publicField(this, "_boundPoints");
      __publicField(this, "_shapePoints");
      __publicField(this, "_shapeXYs");
      __publicField(this, "_shapeXY");
      __publicField(this, "_nbShape", 0);
      __publicField(this, "_nbBoundPoint", 0);
      __publicField(this, "_indexs");
      __publicField(this, "firstPoint");
      __publicField(this, "lastPoint");
      if (path) this.getPoints(path.pathDatas);
    }
    get trianglePoints() {
      return this._boundPoints;
    }
    get triangleIndexs() {
      return this._indexs;
    }
    getBounds(target, offsetW, offsetH) {
      let p = this.firstPoint;
      let trans;
      let tx, ty;
      let minX = 99999999;
      let minY = 99999999;
      let maxX = -99999999;
      let maxY = -99999999;
      let m = target.domMatrix;
      let ox = offsetW;
      let oy = offsetH;
      while (p) {
        trans = m.transformPoint(p);
        tx = trans.x;
        ty = trans.y;
        if (tx < minX) minX = tx;
        if (tx > maxX) maxX = tx;
        if (ty < minY) minY = ty;
        if (ty > maxY) maxY = ty;
        p = p.next;
      }
      return target.bounds.init(minX - ox, minY - oy, maxX + ox, maxY + oy);
    }
    getPoints(pathDatas) {
      this._boundPoints = [];
      this._shapeXYs = [];
      this._shapeBounds = [];
      this.oldX = 0;
      this.oldY = 0;
      let i = 0, len = pathDatas.length, type;
      while (i < len) {
        type = pathDatas[i++];
        switch (type) {
          case 0:
            this.moveTo(pathDatas[i++], pathDatas[i++]);
            break;
          case 1:
            this.lineTo(pathDatas[i++], pathDatas[i++]);
            break;
          case 2:
            this.circle(pathDatas[i++], pathDatas[i++], pathDatas[i++]);
            break;
          case 3:
            this.quadraticCurveTo(pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++]);
            break;
          case 4:
            this.rect(pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++]);
            break;
          case 5:
            this.arc(pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++]);
            break;
          case 6:
            this.arcTo(pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++]);
            break;
          case 7:
            this.bezierCurveTo(pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++], pathDatas[i++]);
            break;
        }
      }
    }
    triangulate() {
      this._indexs = [];
      this.endProcess();
      this._indexs = [];
      var i, len = this._nbShape;
      for (i = 0; i < len; i++) this._indexs[i] = EarCutting.instance.computeTriangles(this._shapeXYs[i]);
    }
    endProcess() {
      if (this._nbShape != 0) {
        this._shapeBounds[this._nbShape - 1] = { minX: this.minX, minY: this.minY, maxX: this.maxX, maxY: this.maxY };
      }
    }
    defineNewShape() {
      this.endProcess();
      this.oldX = 0;
      this.oldY = 0;
      this._shapePoints = [];
      this._shapeXY = [];
      this._boundPoints[this._nbShape] = this._shapePoints;
      this._shapeXYs[this._nbShape] = this._shapeXY;
      this._nbShape++;
      this._nbBoundPoint = 0;
    }
    registerPoint(px, py) {
      if (px < this.minX) this.minX = px;
      if (px > this.maxX) this.maxX = px;
      if (py < this.minY) this.minY = py;
      if (py > this.maxY) this.maxY = py;
      this.oldX = px;
      this.oldY = py;
      var p = this.lastPoint;
      this._shapeXY.push(px, py);
      this._shapePoints[this._nbBoundPoint++] = this.lastPoint = new DOMPoint(px, py, 0, 1);
      if (p) p.next = this.lastPoint;
      this.lastPoint.prev = p;
      if (!this.firstPoint) this.firstPoint = this.lastPoint;
    }
    moveTo(px, py) {
      this.defineNewShape();
      this.registerPoint(px, py);
    }
    lineTo(px, py) {
      this.registerPoint(px, py);
    }
    arcTo(x1, y1, x2, y2, radius) {
      var x0 = this.oldX;
      var y0 = this.oldY;
      let dx = x1 - x0;
      let dy = y1 - y0;
      let a = Math.atan2(dy, dx);
      dx = x2 - x1;
      dy = y2 - y1;
      a = Math.atan2(dy, dx);
      let _x1 = x1 + Math.cos(a) * radius;
      let _y1 = y1 + Math.sin(a) * radius;
      this.quadraticCurveTo(x1, y1, _x1, _y1);
    }
    arc(px, py, radius, startAngle, endAngle) {
      this.defineNewShape();
      let da = Math.abs(endAngle - startAngle);
      let pi4 = Math.PI / 8;
      this.registerPoint(px + Math.cos(startAngle) * radius, py + Math.sin(startAngle) * radius);
      let n = 0;
      while (n + pi4 < da) {
        n += pi4;
        this.registerPoint(px + Math.cos(startAngle + n) * radius, py + Math.sin(startAngle + n) * radius);
      }
      this.registerPoint(px + Math.cos(startAngle + da) * radius, py + Math.sin(startAngle + da) * radius);
    }
    circle(px, py, radius) {
      this.arc(px, py, radius, 0, Math.PI * 2);
    }
    rect(x, y, w, h) {
      this.defineNewShape();
      this.registerPoint(x, y);
      this.registerPoint(x + w, y);
      this.registerPoint(x + w, y + h);
      this.registerPoint(x, y + h);
    }
    getQuadraticCurveLength(ax, ay, x1, y1) {
      var x0 = this.oldX;
      var y0 = this.oldY;
      let ox = x0;
      let oy = y0;
      let dx, dy;
      let dist = 0;
      let i, nb = 10;
      let px, py, t;
      for (i = 1; i < nb; i++) {
        t = i / nb;
        px = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * ax + t * t * x1;
        py = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * ay + t * t * y1;
        dx = px - ox;
        dy = py - oy;
        dist += Math.sqrt(dx * dx + dy * dy);
        ox = px;
        oy = py;
      }
      dx = x1 - ox;
      dy = y1 - oy;
      dist += Math.sqrt(dx * dx + dy * dy);
      return dist;
    }
    quadraticCurveTo(ax, ay, x1, y1) {
      var x0 = this.oldX;
      var y0 = this.oldY;
      let n = Math.ceil(this.getQuadraticCurveLength(ax, ay, x1, y1) / _Geometry.curvePointDistance);
      let i, nb = Math.max(Math.min(n, _Geometry.curvePointMax), 4);
      let px, py, t;
      for (i = 1; i <= nb; i++) {
        t = i / nb;
        px = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * ax + t * t * x1;
        py = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * ay + t * t * y1;
        this.registerPoint(px, py);
      }
    }
    getBezierCurveLength(ax0, ay0, ax1, ay1, x1, y1) {
      var x0 = this.oldX;
      var y0 = this.oldY;
      let i, nb = 5;
      let px, py, t, cX, bX, aX, cY, bY, aY;
      let ox = x0;
      let oy = y0;
      let dx, dy, d = 0;
      for (i = 1; i < nb; i++) {
        t = i / nb;
        cX = 3 * (ax0 - x0);
        bX = 3 * (ax1 - ax0) - cX;
        aX = x1 - x0 - cX - bX;
        cY = 3 * (ay0 - y0);
        bY = 3 * (ay1 - ay0) - cY;
        aY = y1 - y0 - cY - bY;
        px = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + x0;
        py = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + y0;
        dx = px - ox;
        dy = py - oy;
        d += Math.sqrt(dx * dx + dy * dy);
        ox = px;
        oy = py;
      }
      dx = x1 - ox;
      dy = y1 - oy;
      d += Math.sqrt(dx * dx + dy * dy);
      return d;
    }
    bezierCurveTo(ax0, ay0, ax1, ay1, x1, y1) {
      var x0 = this.oldX;
      var y0 = this.oldY;
      var n = Math.ceil(this.getBezierCurveLength(ax0, ay0, ax1, ay1, x1, y1) / _Geometry.curvePointDistance);
      var i, nb = n;
      var px, py, t, cX, bX, aX, cY, bY, aY;
      for (i = 1; i <= nb; i++) {
        t = i / nb;
        cX = 3 * (ax0 - x0);
        bX = 3 * (ax1 - ax0) - cX;
        aX = x1 - x0 - cX - bX;
        cY = 3 * (ay0 - y0);
        bY = 3 * (ay1 - ay0) - cY;
        aY = y1 - y0 - cY - bY;
        px = aX * Math.pow(t, 3) + bX * Math.pow(t, 2) + cX * t + x0;
        py = aY * Math.pow(t, 3) + bY * Math.pow(t, 2) + cY * t + y0;
        this.registerPoint(px, py);
      }
    }
  };
  __publicField(_Geometry, "curvePointMax", 5);
  __publicField(_Geometry, "curvePointDistance", 10);
  let Geometry = _Geometry;
  const _Pt2D = class _Pt2D {
    constructor(x = 0, y = 0, isCurveAnchor = false) {
      __publicField(this, "x");
      __publicField(this, "y");
      __publicField(this, "isCurveAnchor");
      this.x = x;
      this.y = y;
      this.isCurveAnchor = isCurveAnchor;
    }
    equals(pt) {
      return this.x == pt.x && this.y == pt.y;
    }
    add(pt) {
      return new _Pt2D(this.x + pt.x, this.y + pt.y);
    }
    substract(pt) {
      return new _Pt2D(this.x - pt.x, this.y - pt.y);
    }
    multiply(pt) {
      return new _Pt2D(this.x * pt.x, this.y * pt.y);
    }
    divide(pt) {
      return new _Pt2D(this.x / pt.x, this.y / pt.y);
    }
    normalize() {
      let max = Math.sqrt(this.dot(this));
      return new _Pt2D(this.x / max, this.y / max);
    }
    dot(pt) {
      return this.x * pt.x + this.y * pt.y;
    }
    greaterThan(pt) {
      return this.x > pt.x || this.x == pt.x && this.y > pt.y;
    }
    static distance(a, b) {
      let dx = a.x - b.x;
      let dy = a.y - b.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  };
  __publicField(_Pt2D, "X", new _Pt2D(1, 0));
  __publicField(_Pt2D, "Y", new _Pt2D(0, 1));
  __publicField(_Pt2D, "ZERO", new _Pt2D(0, 0));
  let Pt2D = _Pt2D;
  class BorderPt extends Pt2D {
    /*
      public id2:number;
      public dist2:number;
      public dist3:number;
      public dist4:number;
      public nextAngle:number;
      public prevAngle:number;
      public pt:any;
    
      
      public quad:BorderPt[];
      public quadId:number;
      */
    constructor(x, y, id) {
      super(x, y);
      __publicField(this, "id");
      __publicField(this, "dist", 0);
      __publicField(this, "next", null);
      __publicField(this, "prev", null);
      __publicField(this, "isQuadPoint", false);
      this.id = id;
    }
    clone() {
      return new BorderPt(this.x, this.y, this.id);
    }
    distanceTo(pt) {
      var dx = pt.x - this.x;
      var dy = pt.y - this.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    distance(px, py) {
      var dx = px - this.x;
      var dy = py - this.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    angleTo(pt) {
      var dx = pt.x - this.x;
      var dy = pt.y - this.y;
      return Math.atan2(dy, dx);
    }
  }
  class BorderLinePt {
    constructor() {
      __publicField(this, "p1");
      __publicField(this, "p2");
      __publicField(this, "id");
      __publicField(this, "d");
      __publicField(this, "a");
      __publicField(this, "x");
      __publicField(this, "y");
    }
    reset() {
      this.p1 = this.p2 = null;
      this.id = this.d = this.a = this.x = this.y = 0;
    }
  }
  const _BorderVectorizer = class _BorderVectorizer {
    constructor() {
      __publicField(this, "sourcePoints");
      __publicField(this, "firstPt");
      __publicField(this, "scale");
      __publicField(this, "nbPointMax");
      __publicField(this, "points");
      __publicField(this, "width");
      __publicField(this, "height");
      __publicField(this, "minX");
      __publicField(this, "minY");
      if (_BorderVectorizer._instance) {
        throw new Error("You must use BorderVectorizer.instance");
      }
      _BorderVectorizer._instance = this;
    }
    static get instance() {
      if (!_BorderVectorizer._instance) new _BorderVectorizer();
      return _BorderVectorizer._instance;
    }
    init(maxPointWanted, borderPoints) {
      this.sourcePoints = borderPoints;
      this.nbPointMax = maxPointWanted;
      this.points = borderPoints.concat();
      this.firstPt = borderPoints[0];
      this.process();
      return this.points;
    }
    removeNearestPoints(a) {
      var i;
      var v = this.points;
      v.push(v[0]);
      v.push(v[1]);
      var limitAngle = Math.PI / 180 * a;
      var a1, a2;
      var p0x, p0y, p1x, p1y;
      var dx, dy;
      for (i = 2; i < v.length; i++) {
        p0x = v[i - 1].x;
        p0y = v[i - 1].y;
        p1x = v[i].x;
        p1y = v[i].y;
        dx = p0x - p1x;
        dy = p1y - p1y;
        a1 = Math.atan2(dy, dx);
        dx = v[i - 2].x - p0x;
        dy = v[i - 2].y - p0y;
        a2 = Math.atan2(dy, dx);
        if (a1 - a2 < limitAngle) {
          v.splice(i, 1);
        }
      }
      v.pop();
      this.points = v;
    }
    process() {
      var len = this.points.length;
      var count = 1;
      var maxPoint = this.nbPointMax;
      var num = 0;
      var numIncrement = 1;
      var oldLen = -1;
      var o12 = new BorderLinePt();
      var o23 = new BorderLinePt();
      var o31 = new BorderLinePt();
      var linePoints = [];
      linePoints[0] = o12;
      linePoints[1] = o23;
      linePoints[2] = o31;
      var points = this.points;
      while (len > maxPoint && count < 3) {
        num += numIncrement;
        if (len > maxPoint) {
          o12.reset();
          o23.reset();
          o31.reset();
          let limit = num;
          let maxRemove = len - maxPoint;
          let dx, dy;
          let i;
          let p1, p2, p3;
          let center, opposite;
          let oppositeId;
          let opposites = [];
          let o1x, o1y, o2x, o2y, o3x, o3y, a, d;
          let hypothenus;
          let multi;
          let k = 0;
          for (i = 2; i < points.length - 1; i += 2) {
            p1 = points[i - 2];
            p2 = points[i - 1];
            p3 = points[i];
            o1x = p1.x;
            o1y = p1.y;
            o2x = p2.x;
            o2y = p2.y;
            o3x = p3.x;
            o3y = p3.y;
            multi = 1e5;
            o12.id = i - 2;
            o12.p1 = p1;
            o12.p2 = p2;
            dx = p1.x - p2.x;
            dy = p1.y - p2.y;
            o12.d = Math.sqrt(dx * dx + dy * dy) * multi >> 0;
            o12.a = Math.atan2(dy, dx);
            o23.id = i - 1;
            o23.p1 = p2;
            o23.p2 = p3;
            dx = p2.x - p3.x;
            dy = p2.y - p3.y;
            o23.d = Math.sqrt(dx * dx + dy * dy) * multi >> 0;
            o23.a = Math.atan2(dy, dx);
            o31.id = i;
            o31.p1 = p3;
            o31.p2 = p1;
            dx = p3.x - p1.x;
            dy = p3.y - p1.y;
            o31.d = Math.sqrt(dx * dx + dy * dy) * multi >> 0;
            o31.a = Math.atan2(dy, dx);
            linePoints = linePoints.sort(this.sortDist);
            hypothenus = linePoints[2];
            center = hypothenus.p1;
            opposite = linePoints[0].p1;
            oppositeId = linePoints[0].id;
            if (opposite == hypothenus.p2) {
              opposite = linePoints[1].p1;
              oppositeId = linePoints[1].id;
            }
            dx = center.x - opposite.x;
            dy = center.y - opposite.y;
            a = Math.atan2(dy, dx);
            d = Math.sqrt(dx * dx + dy * dy);
            opposite.x = center.x + Math.cos(-hypothenus.a + a) * d >> 0;
            opposite.y = center.y + Math.sin(-hypothenus.a + a) * d >> 0;
            dy = Math.abs(opposite.y - center.y);
            p1.x = o1x >> 0;
            p1.y = o1y >> 0;
            p2.x = o2x >> 0;
            p2.y = o2y >> 0;
            p3.x = o3x >> 0;
            p3.y = o3y >> 0;
            if (dy < limit) opposites[k++] = { d: dy, id: oppositeId };
          }
          if (opposites.length > maxRemove) {
            opposites = opposites.sort(this.sortDist);
            opposites = opposites.slice(0, maxRemove);
          }
          opposites = opposites.sort(this.sortId);
          for (i = opposites.length - 1; i >= 0; i--) {
            oppositeId = opposites[i].id;
            this.points.splice(oppositeId, 1);
          }
        }
        oldLen = len;
        len = this.points.length;
        if (oldLen == len) count++;
        else count = 0;
      }
    }
    getBackOriginalScale() {
      this.minX = 1e5;
      var maxX = 0;
      this.minY = 1e5;
      var maxY = 0;
      var i, k = 0, len = this.sourcePoints.length;
      var point;
      for (i = 0; i < len; i++) {
        point = this.sourcePoints[i];
        if (this.sourcePoints[i] == null) continue;
        point.x /= this.scale;
        point.y /= this.scale;
      }
      if (this.points[0] == this.points[this.points.length - 1]) len--;
      len = this.points.length;
      var temp = [];
      for (i = 0; i < len; i++) {
        if (this.points[i] == null) continue;
        point = this.points[i];
        temp[k++] = new BorderPt(point.x, point.y, 0);
        if (point.x < this.minX) this.minX = point.x;
        if (point.y < this.minY) this.minY = point.y;
        if (point.x > maxX) maxX = point.x;
        if (point.y > maxY) maxY = point.y;
      }
      this.width = maxX - this.minX;
      this.height = maxY - this.minY;
      var temp2 = temp.concat();
      temp2[k - 1] = this.firstPt;
      this.points = temp2;
    }
    rescaleBorderBeforeSimplificationIfPictureIsTooSmall(forceScale = 0) {
      var _minX = 1e5, _maxX = 0;
      var _minY = 1e5, _maxY = 0;
      var i;
      var len = this.points.length;
      var point;
      for (i = 0; i < len; i++) {
        point = this.points[i];
        if (point.x < _minX) _minX = point.x;
        if (point.y < _minY) _minY = point.y;
        if (point.x > _maxX) _maxX = point.x;
        if (point.y > _maxY) _maxY = point.y;
      }
      var w = _maxX - _minX;
      var h = _maxY - _minY;
      var wh = w * h;
      if (!forceScale) this.scale = 1e3 * 1e3 / wh;
      else this.scale = forceScale;
      for (i = 0; i < this.points.length; i++) {
        this.points[i].x *= this.scale;
        this.points[i].y *= this.scale;
      }
    }
    removeSmallLines(minDist, direction, maxRemove = 9999) {
      var temp = [];
      var i, k = 0, len = this.points.length;
      if (direction) temp[k++] = this.points[0];
      else temp[k++] = this.points[this.points.length - 1];
      var p0, p1;
      var dx, dy, d;
      var oldDist = 0;
      if (direction == true) {
        for (i = 1; i < len; i++) {
          p0 = this.points[i - 1];
          p1 = this.points[i];
          dx = p0.x - p1.x;
          dy = p0.y - p1.y;
          d = Math.sqrt(dx * dx + dy * dy);
          if (oldDist + d > minDist || k >= maxRemove) {
            temp[k++] = p1;
            oldDist = (oldDist + d - minDist) % minDist;
          } else {
            oldDist += d;
          }
        }
      } else {
        for (i = len - 2; i > -1; i--) {
          p0 = this.points[i + 1];
          p1 = this.points[i];
          dx = p0.x - p1.x;
          dy = p0.y - p1.y;
          d = Math.sqrt(dx * dx + dy * dy);
          if (oldDist + d > minDist || k >= maxRemove) {
            temp[k++] = p1;
            oldDist = (oldDist + d - minDist) % minDist;
          } else {
            oldDist += d;
          }
        }
      }
      this.points = temp;
      return temp;
    }
    removeNearLine(limit, maxRemove = 9999) {
      var dx, dy;
      var i;
      var p1, p2, p3;
      var o12 = new BorderLinePt();
      var o23 = new BorderLinePt();
      var o31 = new BorderLinePt();
      var center, opposite;
      var oppositeId;
      var o1x, o1y, o2x, o2y, o3x, o3y;
      var linePoints = [];
      linePoints[0] = o12;
      linePoints[1] = o23;
      linePoints[2] = o31;
      var multi;
      var nbRemove = 0;
      for (i = 2; i < this.points.length - 1; i += 2) {
        let sortFunc = function(a2, b) {
          if (a2.d > b.d) return 1;
          if (a2.d < b.d) return -1;
          return 0;
        };
        p1 = this.points[i - 2];
        p2 = this.points[i - 1];
        p3 = this.points[i];
        o1x = p1.x;
        o1y = p1.y;
        o2x = p2.x;
        o2y = p2.y;
        o3x = p3.x;
        o3y = p3.y;
        multi = 1e5;
        o12.id = i - 2;
        o12.p1 = p1;
        o12.p2 = p2;
        dx = p1.x - p2.x;
        dy = p1.y - p2.y;
        o12.d = Math.sqrt(dx * dx + dy * dy) * multi >> 0;
        o12.a = Math.atan2(dy, dx);
        o23.id = i - 1;
        o23.p1 = p2;
        o23.p2 = p3;
        dx = p2.x - p3.x;
        dy = p2.y - p3.y;
        o23.d = Math.sqrt(dx * dx + dy * dy) * multi >> 0;
        o23.a = Math.atan2(dy, dx);
        o31.id = i;
        o31.p1 = p3;
        o31.p2 = p1;
        dx = p3.x - p1.x;
        dy = p3.y - p1.y;
        o31.d = Math.sqrt(dx * dx + dy * dy) * multi >> 0;
        o31.a = Math.atan2(dy, dx);
        linePoints = linePoints.sort(sortFunc);
        var hypothenus = linePoints[2];
        center = hypothenus.p1;
        opposite = linePoints[0].p1;
        oppositeId = linePoints[0].id;
        if (opposite == hypothenus.p2) {
          opposite = linePoints[1].p1;
          oppositeId = linePoints[1].id;
        }
        dx = center.x - opposite.x;
        dy = center.y - opposite.y;
        var a = Math.atan2(dy, dx);
        var d = Math.sqrt(dx * dx + dy * dy);
        opposite.x = center.x + Math.cos(-hypothenus.a + a) * d >> 0;
        opposite.y = center.y + Math.sin(-hypothenus.a + a) * d >> 0;
        dy = Math.abs(opposite.y - center.y);
        p1.x = o1x >> 0;
        p1.y = o1y >> 0;
        p2.x = o2x >> 0;
        p2.y = o2y >> 0;
        p3.x = o3x >> 0;
        p3.y = o3y >> 0;
        if (dy < limit) {
          this.points.splice(oppositeId, 1);
          nbRemove++;
          if (nbRemove == maxRemove) break;
        }
      }
      return this.points;
    }
    sortDist(a, b) {
      if (a.d > b.d) return 1;
      if (a.d < b.d) return -1;
      return 0;
    }
    sortId(a, b) {
      if (a.id > b.id) return 1;
      if (a.id < b.id) return -1;
      return 0;
    }
    removeNearLine2(limit, maxRemove = 9999) {
      var dx, dy;
      var i;
      var p1, p2, p3;
      var o12 = new BorderLinePt();
      var o23 = new BorderLinePt();
      var o31 = new BorderLinePt();
      var center, opposite;
      var oppositeId;
      var opposites = [];
      var o1x, o1y, o2x, o2y, o3x, o3y;
      var linePoints = [];
      linePoints[0] = o12;
      linePoints[1] = o23;
      linePoints[2] = o31;
      var multi;
      var k = 0;
      for (i = 2; i < this.points.length - 1; i += 2) {
        p1 = this.points[i - 2];
        p2 = this.points[i - 1];
        p3 = this.points[i];
        o1x = p1.x;
        o1y = p1.y;
        o2x = p2.x;
        o2y = p2.y;
        o3x = p3.x;
        o3y = p3.y;
        multi = 1e5;
        o12.id = i - 2;
        o12.p1 = p1;
        o12.p2 = p2;
        dx = p1.x - p2.x;
        dy = p1.y - p2.y;
        o12.d = Math.sqrt(dx * dx + dy * dy) * multi >> 0;
        o12.a = Math.atan2(dy, dx);
        o23.id = i - 1;
        o23.p1 = p2;
        o23.p2 = p3;
        dx = p2.x - p3.x;
        dy = p2.y - p3.y;
        o23.d = Math.sqrt(dx * dx + dy * dy) * multi >> 0;
        o23.a = Math.atan2(dy, dx);
        o31.id = i;
        o31.p1 = p3;
        o31.p2 = p1;
        dx = p3.x - p1.x;
        dy = p3.y - p1.y;
        o31.d = Math.sqrt(dx * dx + dy * dy) * multi >> 0;
        o31.a = Math.atan2(dy, dx);
        linePoints = linePoints.sort(this.sortDist);
        var hypothenus = linePoints[2];
        center = hypothenus.p1;
        opposite = linePoints[0].p1;
        oppositeId = linePoints[0].id;
        if (opposite == hypothenus.p2) {
          opposite = linePoints[1].p1;
          oppositeId = linePoints[1].id;
        }
        dx = center.x - opposite.x;
        dy = center.y - opposite.y;
        var a = Math.atan2(dy, dx);
        var d = Math.sqrt(dx * dx + dy * dy);
        opposite.x = center.x + Math.cos(-hypothenus.a + a) * d >> 0;
        opposite.y = center.y + Math.sin(-hypothenus.a + a) * d >> 0;
        dy = Math.abs(opposite.y - center.y);
        p1.x = o1x >> 0;
        p1.y = o1y >> 0;
        p2.x = o2x >> 0;
        p2.y = o2y >> 0;
        p3.x = o3x >> 0;
        p3.y = o3y >> 0;
        if (dy < limit) {
          opposites[k++] = { d: dy, id: oppositeId };
        }
      }
      if (opposites.length > maxRemove) {
        opposites = opposites.sort(this.sortDist);
        opposites = opposites.slice(0, maxRemove);
      }
      opposites = opposites.sort(this.sortId);
      for (i = opposites.length - 1; i >= 0; i--) {
        oppositeId = opposites[i].id;
        this.points.splice(oppositeId, 1);
      }
      return this.points;
    }
  };
  __publicField(_BorderVectorizer, "_instance");
  let BorderVectorizer = _BorderVectorizer;
  class FitCurve {
    constructor() {
    }
    static borderToCurve(border, maxError = 10, progressCallback = null) {
      var points = [];
      var i, len = border.length;
      for (i = 0; i < len; i++) {
        points[i] = [border[i].x, border[i].y];
      }
      return this.fitCurve(points, maxError, progressCallback);
    }
    static drawCurves(ctx, curves) {
      ctx.strokeStyle = "#ff0000";
      ctx.beginPath();
      var i, len = curves.length;
      var curve;
      for (i = 0; i < len; i++) {
        curve = curves[i];
        ctx.moveTo(curve[0][0], curve[0][1]);
        ctx.bezierCurveTo(curve[1][0], curve[1][1], curve[2][0], curve[2][1], curve[3][0], curve[3][1]);
      }
      ctx.stroke();
    }
    static fitCurve(points, maxError = 5, progressCallback = null) {
      if (!Array.isArray(points)) {
        throw new TypeError("First argument should be an array");
      }
      points.forEach((point) => {
        if (!Array.isArray(point) || point.length !== 2 || typeof point[0] !== "number" || typeof point[1] !== "number") {
          throw Error("Each point should be an array of two numbers");
        }
      });
      points = points.filter(
        (point, i) => i === 0 || !(point[0] === points[i - 1][0] && point[1] === points[i - 1][1])
      );
      if (points.length < 2) {
        return [];
      }
      const len = points.length;
      const leftTangent = this.createTangent(points[1], points[0]);
      const rightTangent = this.createTangent(points[len - 2], points[len - 1]);
      return this.fitCubic(points, leftTangent, rightTangent, maxError, progressCallback);
    }
    static fitCubic(points, leftTangent, rightTangent, error, progressCallback) {
      const MaxIterations = 20;
      var bezCurve, u, uPrime, maxError, prevErr, splitPoint, prevSplit, centerVector, toCenterTangent, fromCenterTangent, beziers, dist, i;
      if (points.length === 2) {
        dist = this.vectorLen(this.subtract(points[0], points[1])) / 3;
        bezCurve = [
          points[0],
          this.addArrays(points[0], this.mulItems(leftTangent, dist)),
          this.addArrays(points[1], this.mulItems(rightTangent, dist)),
          points[1]
        ];
        return [bezCurve];
      }
      u = this.chordLengthParameterize(points);
      [bezCurve, maxError, splitPoint] = this.generateAndReport(points, u, u, leftTangent, rightTangent, progressCallback);
      if (maxError < error) {
        return [bezCurve];
      }
      if (maxError < error * error) {
        uPrime = u;
        prevErr = maxError;
        prevSplit = splitPoint;
        for (i = 0; i < MaxIterations; i++) {
          uPrime = this.reparameterize(bezCurve, points, uPrime);
          [bezCurve, maxError, splitPoint] = this.generateAndReport(points, u, uPrime, leftTangent, rightTangent, progressCallback);
          if (maxError < error) {
            return [bezCurve];
          } else if (splitPoint === prevSplit) {
            let errChange = maxError / prevErr;
            if (errChange > 0.9999 && errChange < 1.0001) {
              break;
            }
          }
          prevErr = maxError;
          prevSplit = splitPoint;
        }
      }
      beziers = [];
      centerVector = this.subtract(points[splitPoint - 1], points[splitPoint + 1]);
      if (centerVector[0] === 0 && centerVector[1] === 0) {
        centerVector = this.subtract(points[splitPoint - 1], points[splitPoint]);
        [centerVector[0], centerVector[1]] = [-centerVector[1], centerVector[0]];
      }
      toCenterTangent = this.normalize(centerVector);
      fromCenterTangent = this.mulItems(toCenterTangent, -1);
      beziers = beziers.concat(this.fitCubic(points.slice(0, splitPoint + 1), leftTangent, toCenterTangent, error, progressCallback));
      beziers = beziers.concat(this.fitCubic(points.slice(splitPoint), fromCenterTangent, rightTangent, error, progressCallback));
      return beziers;
    }
    static generateAndReport(points, paramsOrig, paramsPrime, leftTangent, rightTangent, progressCallback) {
      var bezCurve, maxError, splitPoint;
      bezCurve = this.generateBezier(points, paramsPrime, leftTangent, rightTangent, progressCallback);
      [maxError, splitPoint] = this.computeMaxError(points, bezCurve, paramsOrig);
      if (progressCallback) {
        progressCallback({
          bez: bezCurve,
          points,
          params: paramsOrig,
          maxErr: maxError,
          maxPoint: splitPoint
        });
      }
      return [bezCurve, maxError, splitPoint];
    }
    //@ts-ignore
    static generateBezier(points, parameters, leftTangent, rightTangent, progressCallback) {
      var bezCurve, A, a, C, X, det_C0_C1, det_C0_X, det_X_C1, alpha_l, alpha_r, epsilon, segLength, i, len, tmp, u, ux, firstPoint = points[0], lastPoint = points[points.length - 1];
      bezCurve = [firstPoint, null, null, lastPoint];
      A = this.zeros_Xx2x2(parameters.length);
      for (i = 0, len = parameters.length; i < len; i++) {
        u = parameters[i];
        ux = 1 - u;
        a = A[i];
        a[0] = this.mulItems(leftTangent, 3 * u * (ux * ux));
        a[1] = this.mulItems(rightTangent, 3 * ux * (u * u));
      }
      C = [[0, 0], [0, 0]];
      X = [0, 0];
      for (i = 0, len = points.length; i < len; i++) {
        u = parameters[i];
        a = A[i];
        C[0][0] += this.dot(a[0], a[0]);
        C[0][1] += this.dot(a[0], a[1]);
        C[1][0] += this.dot(a[0], a[1]);
        C[1][1] += this.dot(a[1], a[1]);
        tmp = this.subtract(points[i], this.q([firstPoint, firstPoint, lastPoint, lastPoint], u));
        X[0] += this.dot(a[0], tmp);
        X[1] += this.dot(a[1], tmp);
      }
      det_C0_C1 = C[0][0] * C[1][1] - C[1][0] * C[0][1];
      det_C0_X = C[0][0] * X[1] - C[1][0] * X[0];
      det_X_C1 = X[0] * C[1][1] - X[1] * C[0][1];
      alpha_l = det_C0_C1 === 0 ? 0 : det_X_C1 / det_C0_C1;
      alpha_r = det_C0_C1 === 0 ? 0 : det_C0_X / det_C0_C1;
      segLength = this.vectorLen(this.subtract(firstPoint, lastPoint));
      epsilon = 1e-6 * segLength;
      if (alpha_l < epsilon || alpha_r < epsilon) {
        bezCurve[1] = this.addArrays(firstPoint, this.mulItems(leftTangent, segLength / 3));
        bezCurve[2] = this.addArrays(lastPoint, this.mulItems(rightTangent, segLength / 3));
      } else {
        bezCurve[1] = this.addArrays(firstPoint, this.mulItems(leftTangent, alpha_l));
        bezCurve[2] = this.addArrays(lastPoint, this.mulItems(rightTangent, alpha_r));
      }
      return bezCurve;
    }
    static reparameterize(bezier, points, parameters) {
      return parameters.map((p, i) => this.newtonRaphsonRootFind(bezier, points[i], p));
    }
    static newtonRaphsonRootFind(bez, point, u) {
      var d = this.subtract(this.q(bez, u), point), qprime = this.qprime(bez, u), numerator = this.mulMatrix(d, qprime), denominator = this.sum(this.squareItems(qprime)) + 2 * this.mulMatrix(d, this.qprimeprime(bez, u));
      if (denominator === 0) {
        return u;
      } else {
        return u - numerator / denominator;
      }
    }
    static chordLengthParameterize(points) {
      var u = [], currU, prevU, prevP;
      points.forEach((p, i) => {
        currU = i ? prevU + this.vectorLen(this.subtract(p, prevP)) : 0;
        u.push(currU);
        prevU = currU;
        prevP = p;
      });
      u = u.map((x) => x / prevU);
      return u;
    }
    static computeMaxError(points, bez, parameters) {
      var dist, maxDist, splitPoint, v, i, count, point, t;
      maxDist = 0;
      splitPoint = points.length / 2;
      const t_distMap = this.mapTtoRelativeDistances(bez, 10);
      for (i = 0, count = points.length; i < count; i++) {
        point = points[i];
        t = this.find_t(bez, parameters[i], t_distMap, 10);
        v = this.subtract(this.q(bez, t), point);
        dist = v[0] * v[0] + v[1] * v[1];
        if (dist > maxDist) {
          maxDist = dist;
          splitPoint = i;
        }
      }
      return [maxDist, splitPoint];
    }
    static mapTtoRelativeDistances(bez, B_parts) {
      var B_t_curr;
      var B_t_dist = [0];
      var B_t_prev = bez[0];
      var sumLen = 0;
      for (var i = 1; i <= B_parts; i++) {
        B_t_curr = this.q(bez, i / B_parts);
        sumLen += this.vectorLen(this.subtract(B_t_curr, B_t_prev));
        B_t_dist.push(sumLen);
        B_t_prev = B_t_curr;
      }
      B_t_dist = B_t_dist.map((x) => x / sumLen);
      return B_t_dist;
    }
    //@ts-ignore
    static find_t(bez, param, t_distMap, B_parts) {
      if (param < 0) {
        return 0;
      }
      if (param > 1) {
        return 1;
      }
      var lenMax, lenMin, tMax, tMin, t;
      for (var i = 1; i <= B_parts; i++) {
        if (param <= t_distMap[i]) {
          tMin = (i - 1) / B_parts;
          tMax = i / B_parts;
          lenMin = t_distMap[i - 1];
          lenMax = t_distMap[i];
          t = (param - lenMin) / (lenMax - lenMin) * (tMax - tMin) + tMin;
          break;
        }
      }
      return t;
    }
    static createTangent(pointA, pointB) {
      return this.normalize(this.subtract(pointA, pointB));
    }
    //--math --
    static zeros_Xx2x2(x) {
      var zs = [];
      while (x--) {
        zs.push([0, 0]);
      }
      return zs;
    }
    //multiply = logAndRun(math.multiply);
    static mulItems(items, multiplier) {
      return [items[0] * multiplier, items[1] * multiplier];
    }
    static mulMatrix(m1, m2) {
      return m1[0] * m2[0] + m1[1] * m2[1];
    }
    //Only used to subract to points (or at least arrays):
    //  subtract = logAndRun(math.subtract);
    static subtract(arr1, arr2) {
      return [arr1[0] - arr2[0], arr1[1] - arr2[1]];
    }
    //add = logAndRun(math.add);
    static addArrays(arr1, arr2) {
      return [arr1[0] + arr2[0], arr1[1] + arr2[1]];
    }
    //@ts-ignore
    static addItems(items, addition) {
      return [items[0] + addition, items[1] + addition];
    }
    //var sum = logAndRun(math.sum);
    static sum(items) {
      return items.reduce((sum, x) => sum + x);
    }
    //chain = math.chain;
    //Only used on two arrays. The dot product is equal to the matrix product in this case:
    //  dot = logAndRun(math.dot);
    static dot(m1, m2) {
      return this.mulMatrix(m1, m2);
    }
    //https://en.wikipedia.org/wiki/Norm_(mathematics)#Euclidean_norm
    //  var norm = logAndRun(math.norm);
    static vectorLen(v) {
      var a = v[0], b = v[1];
      return Math.sqrt(a * a + b * b);
    }
    //math.divide = logAndRun(math.divide);
    static divItems(items, divisor) {
      return [items[0] / divisor, items[1] / divisor];
    }
    //var dotPow = logAndRun(math.dotPow);
    static squareItems(items) {
      var a = items[0], b = items[1];
      return [a * a, b * b];
    }
    static normalize(v) {
      return this.divItems(v, this.vectorLen(v));
    }
    //--- bezier
    //Evaluates cubic bezier at t, return point
    static q(ctrlPoly, t) {
      var tx = 1 - t;
      var pA = this.mulItems(ctrlPoly[0], tx * tx * tx), pB = this.mulItems(ctrlPoly[1], 3 * tx * tx * t), pC = this.mulItems(ctrlPoly[2], 3 * tx * t * t), pD = this.mulItems(ctrlPoly[3], t * t * t);
      return this.addArrays(this.addArrays(pA, pB), this.addArrays(pC, pD));
    }
    //Evaluates cubic bezier first derivative at t, return point
    static qprime(ctrlPoly, t) {
      var tx = 1 - t;
      var pA = this.mulItems(this.subtract(ctrlPoly[1], ctrlPoly[0]), 3 * tx * tx), pB = this.mulItems(this.subtract(ctrlPoly[2], ctrlPoly[1]), 6 * tx * t), pC = this.mulItems(this.subtract(ctrlPoly[3], ctrlPoly[2]), 3 * t * t);
      return this.addArrays(this.addArrays(pA, pB), pC);
    }
    //Evaluates cubic bezier second derivative at t, return point
    static qprimeprime(ctrlPoly, t) {
      return this.addArrays(
        this.mulItems(this.addArrays(this.subtract(ctrlPoly[2], this.mulItems(ctrlPoly[1], 2)), ctrlPoly[0]), 6 * (1 - t)),
        this.mulItems(this.addArrays(this.subtract(ctrlPoly[3], this.mulItems(ctrlPoly[2], 2)), ctrlPoly[1]), 6 * t)
      );
    }
  }
  const _BorderFinder = class _BorderFinder {
    //private minX: number;
    //private minY: number;
    //private maxX: number;
    //private maxY: number;
    //private scaleRatio: number;
    //private bugScale: number = 1.25;
    constructor() {
      __publicField(this, "borderPoints");
      __publicField(this, "directions", "");
      __publicField(this, "bd");
      __publicField(this, "center");
      __publicField(this, "pt");
      __publicField(this, "diago");
      __publicField(this, "n");
      __publicField(this, "tab");
      __publicField(this, "count");
      __publicField(this, "working");
      __publicField(this, "firstId");
      __publicField(this, "directionDatas");
      __publicField(this, "offsetX");
      __publicField(this, "offsetY");
      __publicField(this, "_width");
      __publicField(this, "bug");
      __publicField(this, "pixelUsed");
      __publicField(this, "radian", Math.PI / 180);
      //private outColor: number;
      //private colorTracking: boolean;
      __publicField(this, "trackCol");
      //private offsetAngle: number;
      //private secondPass: boolean = false;
      __publicField(this, "holeBd");
      _BorderFinder._instance = this;
      this.diago = Math.sqrt(2);
      var offsetX = _BorderFinder.offsetX = [];
      var offsetY = _BorderFinder.offsetY = [];
      offsetX[0] = 1;
      offsetY[0] = -1;
      offsetX[45] = 1;
      offsetY[45] = 0;
      offsetX[90] = 1;
      offsetY[90] = 1;
      offsetX[135] = 0;
      offsetY[135] = 1;
      offsetX[180] = -1;
      offsetY[180] = 1;
      offsetX[225] = -1;
      offsetY[225] = 0;
      offsetX[270] = -1;
      offsetY[270] = -1;
      offsetX[315] = 0;
      offsetY[315] = -1;
      offsetX[360] = 1;
      offsetY[360] = -1;
      offsetX[405] = 1;
      offsetY[405] = 0;
      offsetX[450] = 1;
      offsetY[450] = 1;
      offsetX[495] = 0;
      offsetY[495] = 1;
      offsetX[540] = -1;
      offsetY[540] = 1;
      offsetX[585] = -1;
      offsetY[585] = 0;
      offsetX[630] = -1;
      offsetY[630] = -1;
      offsetX[675] = 0;
      offsetY[675] = -1;
      offsetX[720] = 1;
      offsetY[720] = -1;
      offsetX[765] = 1;
      offsetY[765] = 0;
    }
    reset() {
      this.directionDatas = [];
      this.borderPoints = null;
      this.directions = "";
      this.bd = null;
      this.center = null;
      this.pt = null;
      this.diago = null;
      this.n = null;
      this.tab = null;
      this.count = null;
      this.working = null;
      this.firstId = null;
      this.offsetX = null;
      this.offsetY = null;
      this._width = null;
      this.bug = null;
      this.pixelUsed = null;
      this.trackCol = null;
      this.holeBd = null;
    }
    static get instance() {
      if (!_BorderFinder._instance) new _BorderFinder();
      return _BorderFinder._instance;
    }
    get holePicture() {
      return this.holeBd;
    }
    getOutsideBorder(source) {
      var r = source.getAlphaChannelBoundRect(0, 0, source.width, source.height, 0, 0);
      var _temp = new BitmapData(r.w, r.h, "rgba(0,0,0,0)");
      _temp.drawImage(source.htmlCanvas, r.x, r.y, r.w, r.h, 0, 0, r.w, r.h);
      var res = this.getBorderFromBitmapData(_temp, false);
      if (res) {
        let i, len = res.length;
        for (i = 0; i < len; i++) {
          res[i].x += r.x;
          res[i].y += r.y;
        }
      }
      return res;
    }
    createGraphicsGeometryFromBitmapData(source, firstPassPrecision = 0.2, fitCurvePrecision = 1) {
      var geom = new Geometry();
      var border = this.getBorderFromBitmapData(source);
      var vectoBorder = BorderVectorizer.instance.init(border.length * firstPassPrecision >> 0, border);
      var curves = FitCurve.borderToCurve(vectoBorder, fitCurvePrecision);
      var i, len = curves.length;
      var bezier;
      for (i = 0; i < len; i++) {
        bezier = curves[i];
        if (i == 0) geom.moveTo(bezier[0][0], bezier[0][1]);
        geom.bezierCurveTo(
          bezier[1][0],
          bezier[1][1],
          bezier[2][0],
          bezier[2][1],
          bezier[3][0],
          bezier[3][1]
        );
      }
      return geom;
    }
    getBorderFromBitmapData(source, trackColor = false, colorTracked = { r: 255, g: 0, b: 255, a: 0 }, areaRect = null, secondPass = false, borderX = 0, borderY = 0) {
      this.reset();
      this.directions = "";
      let tab = this.tab = [];
      this.n = 0;
      this.count = 0;
      this.offsetX = _BorderFinder.offsetX;
      this.offsetY = _BorderFinder.offsetY;
      let colorTracking = trackColor;
      let trackCol = this.trackCol = colorTracked;
      var area = source.width * source.height;
      if (areaRect) area = areaRect.w * areaRect.h;
      var s = 300 * 300 / area;
      if (s < 1) s = 1;
      else if (s > 2) s = 2;
      if (secondPass) s += 1;
      var pw2 = source.width * s >> 0;
      var ph2 = source.height * s >> 0;
      if (!this.bd) this.bd = new BitmapData(pw2 + 4, ph2 + 4, "rgba(0,0,0,0)");
      else this.bd.resize(pw2 + 4, ph2 + 4);
      let bd = this.bd;
      bd.drawImage(source.htmlCanvas, 0, 0, source.width, source.height, 2, 2, pw2, ph2);
      this.pixelUsed = [];
      let pixelUsed = this.pixelUsed;
      var i, len = bd.width * bd.height;
      for (i = 0; i < len; i++) pixelUsed[i] = false;
      var px = bd.width >> 1;
      var py = 2;
      var r;
      if (colorTracking == false) {
        r = bd.getAlphaChannelBoundRect(0, 0, bd.width, bd.height, 0, 0);
        len = r.w + 1;
        px = r.x - 1;
        py = r.y + r.w / 2 >> 0;
        for (i = 0; i < r.w; i++) {
          if (0 == bd.getPixelAlpha(px, py)) px++;
          else break;
        }
      } else {
        r = bd.getColorBoundRect(0, 0, bd.width, bd.height, trackCol.r, trackCol.g, trackCol.b, trackCol.a);
        len = r.w + 1;
        px = r.x;
        py = r.y;
        for (i = 0; i < len; i++) {
          if (!bd.matchColor(px, py, trackCol.r, trackCol.g, trackCol.b, trackCol.a)) px++;
          else break;
        }
      }
      tab = this.tab = [];
      this.directions = "";
      this.count = 0;
      this.center = new BorderPt(px, py, 0);
      let pt = this.pt = new BorderPt(px - 1, py, 0);
      let id = this.firstId = py * bd.width + px >> 0;
      pixelUsed[id] = true;
      this._width = bd.width;
      this.bug = false;
      this.working = true;
      if (colorTracking == false) {
        while (this.working && this.bug == false) {
          this.getBorder();
          this.bug = this.count > 100;
        }
      } else {
        while (this.working && this.bug == false) {
          this.getBorderColorTracking();
          this.bug = this.count > 100;
        }
      }
      this.borderPoints = null;
      if (this.bug == true) {
        if (secondPass == true || colorTracking) {
          return null;
        }
        var temp = source.clone();
        temp.applyFilter("blur(0.05px)");
        return this.getBorderFromBitmapData(temp, colorTracking, trackCol, areaRect, true);
      }
      len = tab.length;
      var prev = tab[tab.length - 1];
      for (i = 0; i < len; i++) {
        pt = tab[i];
        pt.x = borderX + pt.x / s >> 0;
        pt.y = borderY + pt.y / s >> 0;
        pt.id = i;
        pt.prev = prev;
        prev.next = pt;
        prev = pt;
      }
      this.borderPoints = tab;
      return tab;
    }
    returnAngle(p0, p1) {
      return Math.atan2(p1.y - p0.y, p1.x - p0.x) / (Math.PI / 180) >> 0;
    }
    getBorder() {
      let _angle = this.returnAngle(this.center, this.pt) + 45;
      let a = _angle;
      let len = a + 315;
      let px = 0, py = 0;
      let temp;
      let bool = false;
      let pixelIndex;
      let center = this.center;
      let pixelUsed = this.pixelUsed;
      let _width = this._width;
      let bd = this.bd;
      let directionDatas = this.directionDatas;
      let firstId = this.firstId;
      let tab = this.tab;
      let offsetX = this.offsetX;
      let offsetY = this.offsetY;
      while (a < len) {
        px = center.x + offsetX[a + 135];
        py = center.y + offsetY[a + 135];
        pixelIndex = py * _width + px;
        if (0 != bd.getPixelAlpha(px, py)) {
          if (true == pixelUsed[pixelIndex]) {
            if (pixelIndex == firstId) {
              bool = false;
              this.working = false;
              this.count = 0;
              break;
            }
          } else {
            if (!pixelUsed[pixelIndex]) {
              this.directions += directionDatas[a + 45];
              pixelUsed[pixelIndex] = true;
              tab.push(new BorderPt(px, py, this.n++));
              bool = true;
              break;
            }
          }
        }
        a += 45;
      }
      if (bool) {
        temp = new BorderPt(center.x, center.y, 0);
        this.center = new BorderPt(px, py, 0);
        this.pt = new BorderPt(temp.x, temp.y, 0);
        this.count = 0;
      } else {
        center = new BorderPt(this.pt.x, this.pt.y, 0);
        this.count++;
        var d = tab.length - this.count;
        if (d >= 0) this.pt = tab[d];
        else {
          this.working = false;
        }
      }
    }
    getBorderColorTracking() {
      let _angle = this.returnAngle(this.center, this.pt) + 45;
      let a = _angle;
      let len = a + 450;
      let r;
      let px = 0, py = 0;
      let temp;
      let bool = false;
      let pixelIndex;
      let radian = this.radian;
      let center = this.center;
      let pixelUsed = this.pixelUsed;
      let diago = this.diago;
      let _width = this._width;
      let bd = this.bd;
      let directionDatas = this.directionDatas;
      let firstId = this.firstId;
      let tab = this.tab;
      let red = this.trackCol.r;
      let green = this.trackCol.g;
      let blue = this.trackCol.b;
      let alpha = this.trackCol.a;
      while (a < len) {
        r = radian * a;
        if (a % 45 != 0) {
          px = center.x + Math.cos(r) * diago >> 0;
          py = center.y + Math.sin(r) * diago >> 0;
        } else {
          px = center.x + Math.cos(r) >> 0;
          py = center.y + Math.sin(r) >> 0;
        }
        pixelIndex = py * _width + px;
        if (bd.matchColor(px, py, red, green, blue, alpha)) {
          if (true == pixelUsed[pixelIndex]) {
            if (pixelIndex == firstId) {
              bool = false;
              this.working = false;
              this.count = 0;
              break;
            }
          } else {
            if (!pixelUsed[pixelIndex]) {
              this.directions += directionDatas[a + 45];
              pixelUsed[pixelIndex] = true;
              tab.push(new BorderPt(px, py, this.n++));
              bool = true;
              break;
            }
          }
        }
        a += 45;
      }
      if (bool) {
        temp = new BorderPt(center.x, center.y, 0);
        this.center = new BorderPt(px, py, 0);
        this.pt = new BorderPt(temp.x, temp.y, 0);
        this.count = 0;
      } else {
        center = new BorderPt(this.pt.x, this.pt.y, 0);
        this.count++;
        var d = tab.length - this.count;
        if (d >= 0) this.pt = tab[d];
        else {
          this.working = false;
        }
      }
    }
    getNumberOfHoles(source) {
      var picture = source.clone();
      var r = picture.getAlphaChannelBoundRect(0, 0, picture.width, picture.height, 0, 0);
      var i, len;
      var floodColor = { r: 100, g: 0, b: 255, a: 255 };
      var count = 0;
      var sw = source.width;
      var sh = source.height;
      while (r != null && r.w != 0 && r.h != 0) {
        len = r.w;
        for (i = 0; i < len; i++) {
          if (picture.matchAlpha(r.x + i, r.y, 0)) {
            var bounds = picture.floodFillRGBA(r.x + i, r.y, floodColor.r, floodColor.g, floodColor.b, floodColor.a).bounds;
            floodColor.g = Math.random() * 255 >> 0;
            floodColor.b = Math.random() * 255 >> 0;
            floodColor.r = Math.random() * 255 >> 0;
            if (bounds.x > 0 && bounds.y > 0 && bounds.x + bounds.width < sw && bounds.y + bounds.height < sh) count++;
            break;
          }
        }
        r = picture.getAlphaChannelBoundRect(0, 0, picture.width, picture.height, 0, 0);
      }
      console.log("nbHole = ", count);
      return count;
    }
    getHoleBorders(source) {
      var result = [];
      var picture = source;
      var r = picture.getAlphaChannelBoundRect(0, 0, picture.width, picture.height, 0, 0);
      var i, len;
      var floodColor = { r: 255, g: 0, b: 255, a: 255 };
      floodColor.g = Math.random() * 255 >> 0;
      floodColor.b = Math.random() * 255 >> 0;
      floodColor.r = Math.random() * 255 >> 0;
      var count = 0;
      var sw = source.width;
      var sh = source.height;
      var holeBd;
      while (r != null && r.w != 0 && r.h != 0) {
        len = r.w;
        for (i = 0; i < len; i++) {
          if (picture.matchAlpha(r.x + i, r.y, 0)) {
            holeBd = picture.floodFillRGBAandReturnOutputCanvas(r.x + i, r.y, floodColor.r, floodColor.g, floodColor.b, floodColor.a);
            if (holeBd.offsetX > 0 && holeBd.offsetY > 0 && holeBd.offsetX + holeBd.width < sw - 1 && holeBd.offsetY + holeBd.height < sh - 1) {
              result[count++] = holeBd;
            }
            floodColor.g = Math.random() * 255 >> 0;
            floodColor.b = Math.random() * 255 >> 0;
            floodColor.r = Math.random() * 255 >> 0;
            break;
          }
        }
        r = picture.getAlphaChannelBoundRect(0, 0, picture.width, picture.height, 0, 0);
      }
      var i;
      var borders = [];
      for (i = 0; i < result.length; i++) {
        holeBd = result[i];
        holeBd.offsetX;
        holeBd.offsetY;
        borders[i] = this.getBorderFromBitmapData(holeBd, false, { r: 0, g: 0, b: 0, a: 0 }, null, false, holeBd.offsetX, holeBd.offsetY);
      }
      return borders;
    }
    debugBorder(ctx, border, strokeStyle = "#000000", b = true, px = 0, py = 0) {
      ctx.strokeStyle = ctx.fillStyle = strokeStyle;
      ctx.beginPath();
      ctx.moveTo(border[0].x + px, border[0].y + py);
      if (b) for (var i = 1; i < border.length; i++) ctx.lineTo(border[i].x + px, border[i].y + py);
      else for (var i = border.length - 1; i >= 0; i--) ctx.lineTo(border[i].x + px, border[i].y + py);
      ctx.stroke();
    }
  };
  __publicField(_BorderFinder, "_instance");
  //private static directionDatas: number[];
  __publicField(_BorderFinder, "offsetX");
  __publicField(_BorderFinder, "offsetY");
  let BorderFinder = _BorderFinder;
  class BorderLine {
    constructor(p0, p1) {
      __publicField(this, "start");
      __publicField(this, "end");
      __publicField(this, "points");
      __publicField(this, "dist", 9999999999);
      __publicField(this, "sens");
      __publicField(this, "actif");
      __publicField(this, "color", "#ff0000");
      this.actif = true;
      this.start = p0;
      this.end = p1;
      this.points = [p0, p1];
    }
    addPointToStart(pt) {
      this.start = pt;
      this.points.unshift(pt);
    }
    addPointToEnd(pt) {
      this.end = pt;
      this.points.push(pt);
    }
    findNearestPoint(px, py) {
      var i, len = this.points.length;
      var dx, dy;
      var pt;
      for (i = 0; i < len; i++) {
        pt = this.points[i];
        dx = pt.x - px;
        dy = pt.y - py;
        pt.dist = Math.sqrt(dx * dx + dy * dy);
      }
      var v = this.points.concat();
      v.sort(function(p0, p1) {
        if (p0.dist < p1.dist) return -1;
        else return 1;
      });
      i = 0;
      while (v[i].isQuadPoint && i < v.length - 1) i++;
      v[i].isQuadPoint = true;
      return v[i];
    }
    draw(ctx, offsetX = 0, offsetY = 0) {
      ctx.strokeStyle = this.color;
      ctx.moveTo(offsetX + this.points[0].x, offsetY + this.points[0].y);
      var i, len = this.points.length;
      for (i = 1; i < len; i++) ctx.lineTo(offsetX + this.points[i].x, offsetY + this.points[i].y);
      ctx.stroke();
    }
    getDistanceFromPoint(px, py) {
      var d = 1e6;
      var n;
      var points = this.points;
      var i, len = points.length;
      for (i = 1; i < len; i++) {
        n = this.distanceFromPointToLine(px, py, points[i - 1].x, points[i].x, points[i - 1].y, points[i].y);
        if (n < d) d = n;
      }
      this.dist = d;
      return this.dist;
    }
    distanceFromPointToLine(x, y, x1, x2, y1, y2) {
      var A = x - x1;
      var B = y - y1;
      var C = x2 - x1;
      var D = y2 - y1;
      var dot = A * C + B * D;
      var len_sq = C * C + D * D;
      var param = -1;
      if (len_sq != 0) {
        param = dot / len_sq;
      }
      var xx, yy;
      if (param < 0) {
        xx = x1;
        yy = y1;
      } else if (param > 1) {
        xx = x2;
        yy = y2;
      } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
      }
      var dx = x - xx;
      var dy = y - yy;
      return Math.sqrt(dx * dx + dy * dy);
    }
    orientationIsCorrect(p0, p1, a) {
      var angle = p0.angleTo(p1);
      var da = angle - a;
      if (da > Math.PI) angle -= Math.PI * 2;
      else if (da < -Math.PI) a -= Math.PI * 2;
      da = Math.abs(angle - a);
      a += Math.PI;
      var da2 = angle - a;
      if (da2 > Math.PI) angle -= Math.PI * 2;
      else if (da2 < -Math.PI) a -= Math.PI * 2;
      da2 = Math.abs(angle - a);
      return da < 0.1 || da2 < 0.1;
    }
    lookForNearLines(lines, a) {
      if (a == 0 || a == Math.PI) this.color = "#ff0000";
      else this.color = "#00ff00";
      if (this.actif == false) return;
      var i, len;
      var working = true;
      var currentLine;
      var minDist = 10;
      var pt;
      var j, len2;
      while (working) {
        working = false;
        len = lines.length;
        for (i = 0; i < len; i++) {
          currentLine = lines[i];
          if (currentLine == this || currentLine.actif == false) continue;
          pt = currentLine.start;
          if (this.start.distanceTo(pt) < minDist && this.orientationIsCorrect(pt, this.start, a)) {
            len2 = currentLine.points.length;
            for (j = 0; j < len2; j++) this.addPointToStart(currentLine.points[j]);
            currentLine.actif = false;
            currentLine.points = null;
            currentLine.start = currentLine.end = null;
            working = true;
            break;
          }
          pt = currentLine.end;
          if (this.start.distanceTo(pt) < minDist && this.orientationIsCorrect(pt, this.start, a)) {
            len2 = currentLine.points.length - 1;
            for (j = len2; j > -1; j--) this.addPointToStart(currentLine.points[j]);
            currentLine.actif = false;
            currentLine.points = null;
            currentLine.start = currentLine.end = null;
            working = true;
            break;
          }
          pt = currentLine.start;
          if (this.end.distanceTo(pt) < minDist && this.orientationIsCorrect(this.end, pt, a)) {
            len2 = currentLine.points.length;
            for (j = 0; j < len2; j++) this.addPointToEnd(currentLine.points[j]);
            currentLine.actif = false;
            currentLine.points = null;
            currentLine.start = currentLine.end = null;
            working = true;
            break;
          }
          pt = currentLine.end;
          if (this.end.distanceTo(pt) < minDist && this.orientationIsCorrect(this.end, pt, a)) {
            len2 = currentLine.points.length - 1;
            for (j = len2; j > -1; j--) this.addPointToEnd(currentLine.points[j]);
            currentLine.actif = false;
            currentLine.points = null;
            currentLine.start = currentLine.end = null;
            working = true;
            break;
          }
        }
      }
    }
  }
  const _SolidColor = class _SolidColor extends EventDispatcher {
    constructor(r, g = -1, b = 0, a = 1) {
      super();
      __publicField(this, "_r");
      __publicField(this, "_g");
      __publicField(this, "_b");
      __publicField(this, "_a");
      __publicField(this, "_style");
      __publicField(this, "useAlpha", false);
      var red = void 0;
      if (g == -1) {
        if (typeof r == "string") {
          var s = r.split("#").join("0x");
          r = Number(s);
        }
        var color = r;
        if (r > 16777215) {
          a = color >>> 24;
          red = color >>> 16 & 255;
          g = color >>> 8 & 255;
          b = color & 255;
        } else {
          red = color >> 16;
          g = color >> 8 & 255;
          b = color & 255;
          a = 1;
        }
      }
      if (red == void 0) red = r;
      this._r = red;
      this._g = g;
      this._b = b;
      this._a = a;
      this.updateStyle();
    }
    clone() {
      return new _SolidColor(this._r, this._g, this._b, this._a);
    }
    get dataString() {
      return this._r + "," + this._g + "," + this._b + "," + this._a;
    }
    static fromDataString(data) {
      const t = data.split(",");
      return new _SolidColor(Number(t[0]), Number(t[1]), Number(t[2]), Number(t[3]));
    }
    get r() {
      return this._r;
    }
    set r(n) {
      if (this._r != n) {
        this._r = n;
        this.updateStyle();
      }
    }
    get g() {
      return this._g;
    }
    set g(n) {
      if (this._g != n) {
        this._g = n;
        this.updateStyle();
      }
    }
    get b() {
      return this._b;
    }
    set b(n) {
      if (this._b != n) {
        this._b = n;
        this.updateStyle();
      }
    }
    get a() {
      return this._a;
    }
    set a(n) {
      if (this._a != n) {
        this._a = n;
        this.updateStyle();
      }
    }
    setRGB(r, g, b) {
      this.useAlpha = false;
      this._r = r;
      this._g = g;
      this._b = b;
      this.updateStyle();
    }
    setRGBA(r, g, b, a) {
      this.useAlpha = true;
      this._r = r;
      this._g = g;
      this._b = b;
      this._a = a;
      this.updateStyle();
    }
    createBrighterColor(pct) {
      var r = this._r + (255 - this._r) * pct;
      var g = this._g + (255 - this._g) * pct;
      var b = this._b + (255 - this._b) * pct;
      return new _SolidColor(r, g, b);
    }
    createDarkerColor(pct) {
      var r = this._r * (1 - pct);
      var g = this._g * (1 - pct);
      var b = this._b * (1 - pct);
      return new _SolidColor(r, g, b);
    }
    updateStyle(dispatchEvent = true) {
      if (this.useAlpha) this._style = "rgba(" + this._r + "," + this._g + "," + this._b + "," + this._a + ")";
      else this._style = "rgb(" + this._r + "," + this._g + "," + this._b + ")";
      if (dispatchEvent) this.dispatchEvent(_SolidColor.UPDATE_STYLE);
    }
    get style() {
      return this._style;
    }
  };
  __publicField(_SolidColor, "UPDATE_STYLE", "UPDATE_STYLE");
  __publicField(_SolidColor, "INVISIBLE_COLOR", new _SolidColor(0, 0, 0, 0));
  let SolidColor = _SolidColor;
  const _GradientColor = class _GradientColor extends EventDispatcher {
    constructor(colors = null, ratios = null, isLinear = true) {
      super();
      __publicField(this, "colors", null);
      __publicField(this, "ratios", null);
      __publicField(this, "nbStep", 0);
      __publicField(this, "x0", 0);
      __publicField(this, "y0", 0);
      __publicField(this, "r0", 0);
      __publicField(this, "x1", 0);
      __publicField(this, "y1", 0);
      __publicField(this, "r1", 0);
      __publicField(this, "style", null);
      __publicField(this, "ctx", null);
      __publicField(this, "onUpdateStyle", null);
      __publicField(this, "dirty", true);
      __publicField(this, "isLinear");
      __publicField(this, "scaleX", 1);
      __publicField(this, "scaleY", 1);
      __publicField(this, "x", 0);
      //-> -0.999...+0.999
      __publicField(this, "y", 0);
      //-> -0.999...+0.999
      __publicField(this, "rotation", 0);
      // radian
      __publicField(this, "radialFlareX", 0);
      //-> -0.999...+0.999
      __publicField(this, "radialFlareY", 0);
      //-> -0.999...+0.999
      __publicField(this, "radialFlareStrength", 1);
      __publicField(this, "_scaleX", 1);
      __publicField(this, "_scaleY", 1);
      __publicField(this, "_x", 0);
      //-> -0.999...+0.999
      __publicField(this, "_y", 0);
      //-> -0.999...+0.999
      __publicField(this, "_rotation", 0);
      // radian
      __publicField(this, "_radialFlareX", 0);
      //-> -0.999...+0.999
      __publicField(this, "_radialFlareY", 0);
      //-> -0.999...+0.999
      __publicField(this, "_radialFlareStrength", 1);
      if (colors) this.setColorStep(colors, ratios);
      else {
        this.colors = [];
        this.ratios = [];
      }
      this.isLinear = isLinear;
    }
    get dataString() {
      if (!this.colors || !this.ratios) return "";
      let i, len = this.colors.length;
      let colors = "", ratios = "";
      for (i = 0; i < len; i++) {
        if (i != 0) {
          colors += ",";
          ratios += ",";
        }
        colors += this.colors[i].REGISTER_ID;
        ratios += this.ratios[i];
      }
      let b = 0;
      if (this.isLinear) b = 1;
      return colors + "|" + ratios + "|" + b;
    }
    static fromDataString(data) {
      let t = data.split("|");
      let c = t[0].split(",");
      let r = t[1].split(",");
      let linear = t[2] == "1";
      let i, len = c.length;
      let colors = [];
      let ratios = [];
      for (i = 0; i < len; i++) {
        colors[i] = ObjectLibrary.instance.getObjectByRegisterId(c[i]);
        ratios[i] = Number(r[i]);
      }
      return new _GradientColor(colors, ratios, linear);
    }
    clone(cloneColors = false) {
      if (!this.colors || !this.ratios) return null;
      let c;
      if (cloneColors) {
        c = [];
        let i, len = this.colors.length;
        for (i = 0; i < len; i++) c[i] = this.colors[i].clone();
        return new _GradientColor(c, this.ratios.concat(), this.isLinear);
      } else {
        return new _GradientColor(this.colors.concat(), this.ratios.concat(), this.isLinear);
      }
    }
    transformValues(x = 0, y = 0, scaleX = 1, scaleY = 1, rotation = 0, flareX = 0, flareY = 0, flareStrength = 0) {
      this._x = x;
      this._y = y;
      this._scaleX = scaleX;
      this._scaleY = scaleY;
      this._rotation = rotation;
      this._radialFlareX = flareX;
      this._radialFlareY = flareY;
      this._radialFlareStrength = flareStrength;
      this.dirty = true;
    }
    initFromPoints(x0, y0, x1, y1, r0 = 0, r1 = 0) {
      this.x0 = x0;
      this.y0 = y0;
      this.r0 = r0;
      this.x1 = x1;
      this.y1 = y1;
      this.r1 = r1;
      this.dirty = true;
    }
    initLinearFromRect(x, y, w, h, angle) {
      const w2 = w / 2;
      const h2 = h / 2;
      const d = Math.sqrt(w2 * w2 + h2 * h2);
      const a1 = angle + Math.PI;
      const a2 = angle;
      x += w2;
      y += h2;
      this.x0 = x + Math.cos(a1) * d;
      this.y0 = y + Math.sin(a1) * d;
      this.x1 = x + Math.cos(a2) * d;
      this.y1 = y + Math.sin(a2) * d;
      this.dirty = true;
    }
    initRadialFromRect(x, y, w, h, radialFlareX = 0, radialFlareY = 0, flareStrength = 1) {
      if (radialFlareX <= -1) radialFlareX = -0.999;
      if (radialFlareY <= -1) radialFlareY = -0.999;
      if (radialFlareX >= 1) radialFlareX = 0.999;
      if (radialFlareY >= 1) radialFlareY = 0.999;
      const w2 = w / 2;
      const h2 = h / 2;
      const radius = Math.sqrt(w2 * w2 + h2 * h2);
      x += w2;
      y += h2;
      const a = Math.atan2(radialFlareY, radialFlareX);
      const dx = Math.cos(a) * (radius * radialFlareX);
      const dy = Math.sin(a) * (radius * radialFlareY);
      const d = Math.sqrt(dx * dx + dy * dy);
      this.x0 = x + Math.cos(a) * d;
      this.x1 = x;
      this.y0 = y + Math.sin(a) * d;
      this.y1 = y;
      this.r0 = 0;
      this.r1 = radius * flareStrength;
      this.dirty = true;
    }
    setColorStep(colors, ratios) {
      let i, nbStep, ratio, n;
      if (colors.length > 1) {
        if (ratios && colors.length <= ratios.length) {
          this.ratios = ratios;
          this.nbStep = colors.length;
          this.colors = colors;
        } else {
          this.nbStep = nbStep = colors.length;
          ratio = 0;
          n = 1 / (nbStep - 1);
          this.ratios = [];
          for (i = 0; i < nbStep; i++) {
            this.ratios[i] = ratio;
            ratio += n;
          }
        }
      } else {
        colors.push(colors[0]);
        this.nbStep = 2;
        this.ratios = [0, 1];
      }
      nbStep = this.nbStep;
      const updateCol = () => {
        var _a;
        this.dirty = true;
        if (this.ctx) this.getGradientStyle(this.ctx);
        (_a = this.onUpdateStyle) == null ? void 0 : _a.call(this);
      };
      for (i = 0; i < nbStep; i++) {
        if (this.colors && this.colors[i]) this.colors[i].removeEventListener(SolidColor.UPDATE_STYLE, updateCol);
        colors[i].addEventListener(SolidColor.UPDATE_STYLE, updateCol);
      }
      this.colors = colors;
      this.dirty = true;
    }
    addColorStep(ratio, r = 0, g = 0, b = 0, a = 1) {
      if (!this.colors || !this.ratios) return null;
      var color = this.colors[this.nbStep] = new SolidColor(r, g, b, a);
      this.ratios[this.nbStep++] = ratio;
      return color;
    }
    getColorById(id) {
      return this.colors ? this.colors[id] : null;
    }
    setColorById(id, color) {
      if (!this.colors || !this.ratios) return "";
      if (this.colors[id] != null) {
        this.colors[id].removeEventListener(SolidColor.UPDATE_STYLE, this.onUpdateStyle);
        this.colors[id] = color;
        color.addEventListener(SolidColor.UPDATE_STYLE, this.onUpdateStyle);
      }
    }
    getRatioById(id) {
      return this.ratios ? this.ratios[id] : 0;
    }
    setRatioById(id, ratio) {
      this.ratios[id] = ratio;
    }
    //@ts-ignore
    getGradientStyle(context2D, target) {
      if (!this.colors || !this.ratios) return null;
      let obj;
      if (this.dirty || this.ctx != context2D) {
        this.ctx = context2D;
        const x = this.x + this._x;
        const y = this.y + this._y;
        const scaleX = this.scaleX * this._scaleX;
        const scaleY = this.scaleY * this._scaleY;
        const rotation = this.rotation + this._rotation;
        const flareX = this.radialFlareX * this._radialFlareX;
        const flareY = this.radialFlareY * this._radialFlareY;
        const flareStrength = this.radialFlareStrength * this._radialFlareStrength;
        if (this.isLinear) {
          this.initLinearFromRect(x, y, scaleX, scaleY, rotation);
          obj = context2D.createLinearGradient(this.x0, this.y0, this.x1, this.y1);
        } else {
          this.initRadialFromRect(x, y, scaleX, scaleY, flareX, flareY, flareStrength);
          obj = context2D.createRadialGradient(this.x0, this.y0, this.r0, this.x1, this.y1, this.r1);
        }
        let i, nb = this.nbStep;
        const ratios = this.ratios;
        const colors = this.colors;
        for (i = 0; i < nb; i++) obj.addColorStop(ratios[i], colors[i].style);
        this.style = obj;
        this.dirty = false;
        this.dispatchEvent(_GradientColor.UPDATE_STYLE);
      }
      return this.style;
    }
  };
  __publicField(_GradientColor, "UPDATE_STYLE", "UPDATE_STYLE");
  let GradientColor = _GradientColor;
  const _ShadowFilter = class _ShadowFilter {
    constructor(solidColor, blur, offsetX, offsetY) {
      __publicField(this, "solidColor");
      __publicField(this, "blur");
      __publicField(this, "offsetX");
      __publicField(this, "offsetY");
      this.solidColor = solidColor;
      this.blur = blur;
      this.offsetX = offsetX;
      this.offsetY = offsetY;
    }
    apply(context2D) {
      context2D.shadowColor = this.solidColor.style;
      context2D.shadowBlur = this.blur;
      context2D.shadowOffsetX = this.offsetX;
      context2D.shadowOffsetY = this.offsetY;
    }
  };
  __publicField(_ShadowFilter, "NO_SHADOW", new _ShadowFilter(SolidColor.INVISIBLE_COLOR, 0, 0, 0));
  let ShadowFilter = _ShadowFilter;
  class KeyboardEvents {
  }
  __publicField(KeyboardEvents, "KEY_DOWN", "KEY_DOWN");
  __publicField(KeyboardEvents, "KEY_UP", "KEY_UP");
  __publicField(KeyboardEvents, "CHANGED", "CHANGED");
  class KeyboardControler extends EventDispatcher {
    constructor() {
      super();
      __publicField(this, "isDown");
      __publicField(this, "keyCode", -1);
      this.isDown = [];
      for (var i = 0; i < 222; i++) this.isDown[i] = false;
      var th = this;
      document.addEventListener("keydown", function(e) {
        th.keyCode = e.keyCode;
        th.isDown[th.keyCode] = true;
        th.dispatchEvent(KeyboardEvents.KEY_DOWN);
        th.dispatchEvent(KeyboardEvents.CHANGED);
      });
      document.addEventListener("keyup", function(e) {
        th.keyCode = e.keyCode;
        th.isDown[th.keyCode] = false;
        th.dispatchEvent(KeyboardEvents.KEY_DOWN);
        th.dispatchEvent(KeyboardEvents.CHANGED);
      });
    }
    keyIsDown(keyCode) {
      return this.isDown[keyCode];
    }
  }
  class MouseEvents {
  }
  __publicField(MouseEvents, "CLICK", "CLICK");
  __publicField(MouseEvents, "DOUBLE_CLICK", "DOUBLE_CLICK");
  __publicField(MouseEvents, "DOWN", "DOWN");
  __publicField(MouseEvents, "UP", "UP");
  __publicField(MouseEvents, "MOVE", "MOVE");
  __publicField(MouseEvents, "OVER", "OVER");
  __publicField(MouseEvents, "OUT", "OUT");
  __publicField(MouseEvents, "WHEEL_UP", "WHEEL_UP");
  __publicField(MouseEvents, "WHEEL_DOWN", "WHEEL_DOWN");
  class MouseControler extends EventDispatcher {
    constructor(canvas) {
      super();
      __publicField(this, "x", 0);
      __publicField(this, "y", 0);
      __publicField(this, "isDown", false);
      __publicField(this, "htmlCanvas");
      var th = this;
      var mc = this.htmlCanvas = canvas;
      mc.onmouseover = function(e) {
        th.getMouseXY(e);
        th.dispatchEvent(MouseEvents.OVER);
      };
      mc.onmouseout = function(e) {
        th.getMouseXY(e);
        th.dispatchEvent(MouseEvents.OUT);
      };
      mc.onmousedown = function(e) {
        th.getMouseXY(e);
        th.isDown = true;
        th.dispatchEvent(MouseEvents.DOWN);
      };
      mc.onmouseup = function(e) {
        th.getMouseXY(e);
        th.isDown = false;
        th.dispatchEvent(MouseEvents.UP);
      };
      mc.onclick = function(e) {
        th.getMouseXY(e);
        th.dispatchEvent(MouseEvents.CLICK);
      };
      mc.ondblclick = function(e) {
        th.getMouseXY(e);
        th.dispatchEvent(MouseEvents.DOUBLE_CLICK);
      };
      mc.onmousemove = function(e) {
        th.getMouseXY(e);
        th.dispatchEvent(MouseEvents.MOVE);
      };
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
    getMouseXY(e) {
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
  class TouchEvents {
  }
  __publicField(TouchEvents, "START", "START");
  __publicField(TouchEvents, "END", "END");
  __publicField(TouchEvents, "CANCEL", "CANCEL");
  __publicField(TouchEvents, "LEAVE", "LEAVE");
  __publicField(TouchEvents, "MOVE", "MOVE");
  __publicField(TouchEvents, "ADD_ONE_TOUCH", "ADD_ONE_TOUCH");
  __publicField(TouchEvents, "LOSE_ONE_TOUCH", "LOSE_ONE_TOUCH");
  __publicField(TouchEvents, "MOVE_ONE_TOUCH", "MOVE_ONE_TOUCH");
  __publicField(TouchEvents, "ZOOM_AND_ROTATE", "ZOOM_AND_ROTATE");
  __publicField(TouchEvents, "TAP", "TAP");
  __publicField(TouchEvents, "DOUBLE_TAP", "DOUBLE_TAP");
  __publicField(TouchEvents, "SWIPE_LEFT", "SWIPE_LEFT");
  __publicField(TouchEvents, "SWIPE_RIGHT", "SWIPE_RIGHT");
  __publicField(TouchEvents, "SWIPE_UP", "SWIPE_UP");
  __publicField(TouchEvents, "SWIPE_DOWN", "SWIPE_DOWN");
  class TouchSwipe {
  }
  __publicField(TouchSwipe, "NOT_A_SWIPE", -2);
  __publicField(TouchSwipe, "NOT_DEFINED_YET", -1);
  __publicField(TouchSwipe, "SWIPE_RIGHT", 0);
  __publicField(TouchSwipe, "SWIPE_DOWN", 1);
  __publicField(TouchSwipe, "SWIPE_LEFT", 2);
  __publicField(TouchSwipe, "SWIPE_UP", 3);
  class Touche extends EventDispatcher {
    constructor() {
      super();
      __publicField(this, "x", 0);
      __publicField(this, "y", 0);
      __publicField(this, "vx", 0);
      __publicField(this, "vy", 0);
      __publicField(this, "actif", false);
      __publicField(this, "firstPoint", false);
      __publicField(this, "swipeId", TouchSwipe.NOT_DEFINED_YET);
      __publicField(this, "startTime");
      __publicField(this, "lifeTime");
    }
    start(x, y) {
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
      this.swipeId = TouchSwipe.NOT_DEFINED_YET;
      this.actif = true;
      this.startTime = (/* @__PURE__ */ new Date()).getTime();
      this.dispatchEvent(TouchEvents.START);
    }
    end(x, y) {
      this.vx = x - this.x;
      this.vy = y - this.y;
      this.lifeTime = (/* @__PURE__ */ new Date()).getTime() - this.startTime;
      this.x = x;
      this.y = y;
      this.actif = false;
      this.dispatchEvent(TouchEvents.END);
    }
    move(x, y) {
      this.vx = x - this.x;
      this.vy = y - this.y;
      if (this.swipeId != TouchSwipe.NOT_A_SWIPE) {
        var pi2 = Math.PI * 2;
        var pi_2 = Math.PI / 2;
        var a = (pi2 + Math.atan2(this.vy, this.vx) + Math.PI / 4) % pi2;
        var direction = Math.floor(a / pi_2);
        if (TouchSwipe.NOT_DEFINED_YET == this.swipeId) this.swipeId = direction;
        else if (this.swipeId != TouchSwipe.NOT_A_SWIPE && direction != this.swipeId) this.swipeId = TouchSwipe.NOT_A_SWIPE;
      }
      this.x = x;
      this.y = y;
      this.actif = true;
      this.dispatchEvent(TouchEvents.MOVE);
    }
    isTap(timeLimit) {
      return (/* @__PURE__ */ new Date()).getTime() - this.startTime < timeLimit;
    }
  }
  class TouchControler extends EventDispatcher {
    constructor(htmlCanvas, mouseControler) {
      super();
      __publicField(this, "tapTimeLimit", 60);
      __publicField(this, "doubleTimeLimit", 300);
      __publicField(this, "swipeTimeLimit", 400);
      __publicField(this, "lastTapTime", 0);
      __publicField(this, "startDist", 0);
      __publicField(this, "startAngle", 0);
      __publicField(this, "mouse");
      __publicField(this, "zoom", 1);
      __publicField(this, "rotation", 0);
      __publicField(this, "firstPoint", null);
      __publicField(this, "secondPoint", null);
      __publicField(this, "actifPoints", []);
      __publicField(this, "touches", []);
      __publicField(this, "indexs");
      __publicField(this, "touchX");
      __publicField(this, "touchY");
      __publicField(this, "nbTouch", 0);
      __publicField(this, "lastTouch", null);
      __publicField(this, "htmlCanvas");
      this.mouse = mouseControler;
      this.htmlCanvas = htmlCanvas;
      var th = this;
      htmlCanvas.addEventListener("touchstart", function(e) {
        e.preventDefault();
        var t = e.changedTouches;
        var touch;
        var i, len = t.length;
        var touchId = 0;
        for (i = 0; i < len; i++) {
          touch = t[i];
          touchId = touch.identifier;
          th.touchX = touch.pageX;
          th.touchY = touch.pageY;
          if (void 0 == th.touches[touchId]) th.touches[touchId] = th.lastTouch = new Touche();
          else th.lastTouch = th.touches[touchId];
          th.lastTouch.start(th.touchX, th.touchY);
          if (th.nbTouch == 0) {
            th.lastTouch.firstPoint = true;
            th.firstPoint = th.lastTouch;
          } else if (th.nbTouch == 1) {
            th.initSecondPoint(th.lastTouch);
          }
          th.actifPoints[th.nbTouch++] = th.lastTouch;
          th.dispatchEvent(TouchEvents.ADD_ONE_TOUCH);
          if (true == th.lastTouch.firstPoint) {
            th.dispatchEvent(TouchEvents.START);
            th.mouse.down(th.touchX, th.touchY);
          }
        }
      }, false);
      function touchEnd(e) {
        e.preventDefault();
        var t = e.changedTouches;
        var touch;
        var i, len = t.length;
        var touchId = 0;
        var lastTouch;
        var oldTouchId = Number.MAX_VALUE;
        for (i = 0; i < len; i++) {
          touch = t[i];
          touchId = touch.identifier;
          if (touchId == oldTouchId) continue;
          oldTouchId = touchId;
          th.touchX = touch.pageX;
          th.touchY = touch.pageY;
          lastTouch = th.touches[touchId];
          lastTouch.end(lastTouch.x, lastTouch.y);
          th.nbTouch--;
          th.dispatchEvent(TouchEvents.LOSE_ONE_TOUCH);
          th.actifPoints.splice(th.actifPoints.lastIndexOf(lastTouch), 1);
          if (lastTouch.firstPoint == true) {
            lastTouch.firstPoint = false;
            th.dispatchEvent(TouchEvents.END);
            th.mouse.up(lastTouch.x, lastTouch.y);
            var time = (/* @__PURE__ */ new Date()).getTime();
            if (lastTouch.lifeTime < th.tapTimeLimit) {
              if (time - th.lastTapTime < th.doubleTimeLimit) {
                th.dispatchEvent(TouchEvents.DOUBLE_TAP);
                th.mouse.doubleClick(th.touchX, th.touchY);
                th.lastTapTime = 0;
              } else {
                th.dispatchEvent(TouchEvents.TAP);
                th.mouse.click(lastTouch.x, lastTouch.y);
                th.lastTapTime = time;
              }
            } else {
              if (lastTouch.lifeTime > 80 && lastTouch.lifeTime < th.swipeTimeLimit) {
                var swipeId = lastTouch.swipeId;
                if (swipeId >= 0) {
                  if (0 == swipeId) th.dispatchEvent(TouchEvents.SWIPE_RIGHT);
                  else if (1 == swipeId) th.dispatchEvent(TouchEvents.SWIPE_DOWN);
                  else if (2 == swipeId) th.dispatchEvent(TouchEvents.SWIPE_LEFT);
                  else if (3 == swipeId) th.dispatchEvent(TouchEvents.SWIPE_UP);
                }
              }
            }
          }
        }
      }
      htmlCanvas.addEventListener("touchend", touchEnd, false);
      htmlCanvas.addEventListener("touchleave", touchEnd, false);
      htmlCanvas.addEventListener("touchmove", function(e) {
        e.preventDefault();
        var t = e.changedTouches;
        var touch;
        var i, len = t.length;
        var touchId = 0;
        var lastTouch;
        for (i = 0; i < len; i++) {
          touch = t[i];
          touchId = touch.identifier;
          th.touchX = touch.pageX;
          th.touchY = touch.pageY;
          lastTouch = th.touches[touchId];
          lastTouch.move(th.touchX, th.touchY);
          th.dispatchEvent(TouchEvents.MOVE_ONE_TOUCH);
          if (lastTouch.firstPoint == true) {
            th.dispatchEvent(TouchEvents.MOVE);
            th.mouse.move(th.touchX, th.touchY);
          }
          if (th.nbTouch >= 2) {
            var dx = th.secondPoint.x - th.firstPoint.x;
            var dy = th.secondPoint.y - th.firstPoint.y;
            var d = Math.sqrt(dx * dx + dy * dy);
            var a = Math.atan2(dy, dx);
            th.zoom = d / th.startDist;
            th.rotation = a - th.startAngle;
            th.dispatchEvent(TouchEvents.ZOOM_AND_ROTATE);
          }
        }
      }, false);
    }
    initSecondPoint(p) {
      this.secondPoint = p;
      var dx = p.x - this.firstPoint.x;
      var dy = p.y - this.firstPoint.y;
      this.startAngle = Math.atan2(dy, dx);
      this.startDist = Math.sqrt(dx * dx + dy * dy);
    }
  }
  class Keyboard {
  }
  __publicField(Keyboard, "SPACE", 8);
  __publicField(Keyboard, "TAB", 9);
  __publicField(Keyboard, "ENTER", 13);
  __publicField(Keyboard, "SHIFT", 16);
  __publicField(Keyboard, "CTRL", 17);
  __publicField(Keyboard, "ALT", 18);
  __publicField(Keyboard, "ESCAPE", 27);
  __publicField(Keyboard, "PAGE_UP", 33);
  __publicField(Keyboard, "PAGE_DOWN", 34);
  __publicField(Keyboard, "END", 35);
  __publicField(Keyboard, "HOME", 36);
  __publicField(Keyboard, "LEFT", 37);
  __publicField(Keyboard, "UP", 38);
  __publicField(Keyboard, "RIGHT", 39);
  __publicField(Keyboard, "DOWN", 40);
  __publicField(Keyboard, "INSERT", 45);
  __publicField(Keyboard, "DELETE", 46);
  __publicField(Keyboard, "NUM_0", 48);
  __publicField(Keyboard, "NUM_1", 49);
  __publicField(Keyboard, "NUM_2", 50);
  __publicField(Keyboard, "NUM_3", 51);
  __publicField(Keyboard, "NUM_4", 52);
  __publicField(Keyboard, "NUM_5", 53);
  __publicField(Keyboard, "NUM_6", 54);
  __publicField(Keyboard, "NUM_7", 55);
  __publicField(Keyboard, "NUM_8", 56);
  __publicField(Keyboard, "NUM_9", 57);
  __publicField(Keyboard, "A", 65);
  __publicField(Keyboard, "B", 66);
  __publicField(Keyboard, "C", 67);
  __publicField(Keyboard, "D", 68);
  __publicField(Keyboard, "E", 69);
  __publicField(Keyboard, "F", 70);
  __publicField(Keyboard, "G", 71);
  __publicField(Keyboard, "H", 72);
  __publicField(Keyboard, "I", 73);
  __publicField(Keyboard, "J", 74);
  __publicField(Keyboard, "K", 75);
  __publicField(Keyboard, "L", 76);
  __publicField(Keyboard, "M", 77);
  __publicField(Keyboard, "N", 78);
  __publicField(Keyboard, "O", 79);
  __publicField(Keyboard, "P", 80);
  __publicField(Keyboard, "Q", 81);
  __publicField(Keyboard, "R", 82);
  __publicField(Keyboard, "S", 83);
  __publicField(Keyboard, "T", 84);
  __publicField(Keyboard, "U", 85);
  __publicField(Keyboard, "V", 86);
  __publicField(Keyboard, "W", 87);
  __publicField(Keyboard, "X", 88);
  __publicField(Keyboard, "Y", 89);
  __publicField(Keyboard, "Z", 90);
  __publicField(Keyboard, "NUMPAD_0", 96);
  __publicField(Keyboard, "NUMPAD_1", 97);
  __publicField(Keyboard, "NUMPAD_2", 98);
  __publicField(Keyboard, "NUMPAD_3", 99);
  __publicField(Keyboard, "NUMPAD_4", 100);
  __publicField(Keyboard, "NUMPAD_5", 101);
  __publicField(Keyboard, "NUMPAD_6", 102);
  __publicField(Keyboard, "NUMPAD_7", 103);
  __publicField(Keyboard, "NUMPAD_8", 104);
  __publicField(Keyboard, "NUMPAD_9", 105);
  __publicField(Keyboard, "MULTIPLY", 106);
  __publicField(Keyboard, "ADD", 107);
  __publicField(Keyboard, "SUBSTRACT", 109);
  __publicField(Keyboard, "DIVIDE", 111);
  __publicField(Keyboard, "DECIMAL_POINT", 110);
  class FillStroke extends RegisterableObject {
    constructor() {
      super();
      __publicField(this, "fillPathRule", "nonzero");
      __publicField(this, "styleType");
      __publicField(this, "alpha", 1);
      __publicField(this, "lineStyle", null);
      __publicField(this, "textStyle", null);
      //public filter:CssFilter = null;
      __publicField(this, "filters", null);
      __publicField(this, "needsUpdate", true);
      __publicField(this, "offsetW", 0);
      __publicField(this, "offsetH", 0);
      __publicField(this, "dirty", true);
      __publicField(this, "_cacheAsBitmap", false);
      __publicField(this, "cacheDirty", false);
      __publicField(this, "cache", null);
    }
    //@ts-ignore
    apply(context, path, target) {
      if (target.fillStrokeDrawable) context.globalAlpha = this.alpha * target.globalAlpha;
      let css = this.filters;
      if (css) {
        this.dirty = css.dirty;
        if (target.fillStrokeDrawable) context.filter = css.value;
        this.offsetW = css.boundOffsetW;
        this.offsetH = css.boundOffsetH;
      } else {
        context.filter = "none";
      }
    }
    get cacheAsBitmap() {
      return this._cacheAsBitmap;
    }
    set cacheAsBitmap(b) {
      if (this._cacheAsBitmap != b) {
        this._cacheAsBitmap = b;
        if (b) this.cacheDirty = true;
      }
    }
    get isFill() {
      return this.styleType == "fillStyle";
    }
    get isStroke() {
      return this.styleType == "strokeStyle";
    }
    get globalOffsetW() {
      return this.offsetW + this.lineWidth;
    }
    get globalOffsetH() {
      return this.offsetH + this.lineWidth;
    }
    get lineWidth() {
      if (null == this.lineStyle) return 0;
      return this.lineStyle.lineWidth;
    }
  }
  __publicField(FillStroke, "radian", Math.PI / 180);
  class BitmapCache extends BitmapData {
    constructor(target, renderStackElement = null) {
      super(1, 1);
      __publicField(this, "target");
      __publicField(this, "renderStackElement");
      __publicField(this, "needsUpdate", false);
      this.target = target;
      this.renderStackElement = renderStackElement;
    }
    draw(context, offsetW, offsetH) {
      const target = this.target;
      context.save();
      if (!this.renderStackElement) context.globalAlpha = target.globalAlpha;
      context.scale(1 / (this.width - offsetW * 2), 1 / (this.height - offsetH * 2));
      context.translate(-offsetW, -offsetH);
      context.drawImage(this.canvas, 0, 0);
      context.restore();
    }
    /*
    FillStroke / FilterStack / renderStack :
     => ajout de propriété
       public cacheAsBitmap => indique qu'il faut créer un cache au niveau du Display2D quand on génére le rendu
       protected sharedCacheAsBitmap et une fonction setSharedBitmapCache(target:Display2D)
              ###> un cache doit avoir des dimension et nécessite donc un Display2D
    
              sharedCacheAsBitmap permet d'affecter un cache directement à l'objet FillStroke / FilterStack / renderStack
               => il sera donc utilisé lors du rendu de chaque Display2D qui l'utilise sans créer de cache au niveau du display2D;
    
              par exemple si je crée une renderStack et que j'appelle setSharedBitmapCache avec un Display2D qui fait 100x100
    
              si je transmet ce renderStack vers un Display2D de 400x400, sa qualité sera détérioré car son cache ne sera que de 100x100
    
      faire en sore que chaque FillStroke / FilterStack / renderStack ai un id unique
      |-> cet id fera la liaison entre le Display2D et le cache associé
    
      deplacer les fonction update/updateBounds/updateCache de RenderStack
      pour les mettre dans Display2D
      |-> cela permet de gérer tout les cachesAsBitmap au niveau de Display2D et d'assurer le partage de RenderStack
          |=> L'objet renderStack & renderStackElement peuvent être defini comme cacheAsBitmap
             ||==> quand le renderStack est associé a un Display2D, les cachesAsBitmap sont appliqué sur le Display2D
    
    
    
    
    
      ||=> pour customiser un FillStroke / filter issu d'un renderStack partagé, il faut le cloner
    
    
      TODO :
         mettre une propriété cacheAsBitmap sur RenderStack;
         |-> Display2D.cacheAsBitmap pointe sur RenderStack.cacheAsBitmap (?)
    
    
                  |-> on garde en mémoire les dimension & scale du premier Display2D a recevoir le cacheAsBitmap
                      ==> si le display2D target a les meme dimension/scale, on pointe vers le bitmapData du cacheAsBitmap source
                          sinon, on applique le cacheAsBitmap sur le display2D
    
    
    
      */
    updateCache(forceUpdate = false) {
      if (this.needsUpdate == true || forceUpdate) {
        const w = this.target.width * this.target.scaleX;
        const h = this.target.height * this.target.scaleY;
        const context = this.context;
        const target = this.target;
        if (this.renderStackElement) {
          if (this.renderStackElement.value instanceof FillStroke) {
            const o = this.renderStackElement.value;
            this.width = w + o.offsetW * 2;
            this.height = h + o.offsetH * 2;
            context.save();
            var m = new DOMMatrix().translate(o.offsetW, o.offsetH).scale(w, h);
            context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
            o.apply(context, this.renderStackElement.lastPath, target);
            this.context.restore();
          }
        } else {
          const renderStack = target.renderStack;
          renderStack.updateBounds(target);
          this.width = w + renderStack.offsetW * 2;
          this.height = h + renderStack.offsetH * 2;
          context.save();
          var m = new DOMMatrix().translate(renderStack.offsetW, renderStack.offsetH).scale(w, h);
          context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
          let o;
          let path;
          let text;
          let elements = target.renderStack.elements;
          let i, nb = elements.length;
          for (i = 0; i < nb; i++) {
            o = elements[i];
            context.save();
            if (o.enabled) {
              if (o.isShape) o.value.apply(context, target);
              else {
                if (o.isPath) path = o.value;
                else if (o.isTextPath) text = o.value;
                else {
                  if (o.isTextFillStroke) o.value.apply(context, text, target);
                  else o.value.apply(context, path, target);
                }
              }
            }
            context.restore();
          }
          context.restore();
        }
        this.needsUpdate = false;
      }
    }
    /*
      public updateCacheWithoutRotation():BitmapData{
    
      }
    
      */
  }
  class Align {
  }
  __publicField(Align, "TOP_LEFT", new Pt2D(0, 0));
  __publicField(Align, "TOP_CENTER", new Pt2D(0.5, 0));
  __publicField(Align, "TOP_RIGHT", new Pt2D(1, 0));
  __publicField(Align, "CENTER_LEFT", new Pt2D(0, 0.5));
  __publicField(Align, "CENTER", new Pt2D(0.5, 0.5));
  __publicField(Align, "CENTER_RIGHT", new Pt2D(1, 0.5));
  __publicField(Align, "BOTTOM_LEFT", new Pt2D(0, 1));
  __publicField(Align, "BOTTOM_CENTER", new Pt2D(0.5, 1));
  __publicField(Align, "BOTTOM_RIGHT", new Pt2D(1, 1));
  const _Matrix2D = class _Matrix2D extends EventDispatcher {
    constructor() {
      super();
      __publicField(this, "x", 0);
      __publicField(this, "y", 0);
      __publicField(this, "xAxis", 0);
      __publicField(this, "yAxis", 0);
      __publicField(this, "rotation", 0);
      __publicField(this, "scaleX", 1);
      __publicField(this, "scaleY", 1);
      __publicField(this, "width", 1);
      __publicField(this, "height", 1);
      __publicField(this, "offsetW", 0);
      __publicField(this, "offsetH", 0);
      __publicField(this, "matrix");
      __publicField(this, "savedMatrixs");
      this.savedMatrixs = [];
      this.matrix = new DOMMatrix();
    }
    get dataString() {
      var data = [this.x, this.y, this.xAxis, this.yAxis, this.rotation, this.scaleX, this.scaleY, this.width, this.height, this.offsetW, this.offsetH].join(",");
      data += "#";
      data += [this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.e, this.matrix.f].join(",");
      return data;
    }
    static fromDataString(data, target) {
      var t = data.split("#");
      var p = t[0].split(",");
      var m = t[1].split(",");
      var o;
      if (!target) o = new _Matrix2D();
      else o = target;
      o.x = Number(p[0]);
      o.y = Number(p[1]);
      o.xAxis = Number(p[2]);
      o.yAxis = Number(p[3]);
      o.rotation = Number(p[4]);
      o.scaleX = Number(p[5]);
      o.scaleY = Number(p[6]);
      o.width = Number(p[7]);
      o.height = Number(p[8]);
      o.offsetW = Number(p[9]);
      o.offsetH = Number(p[10]);
      o.domMatrix.a = Number(m[0]);
      o.domMatrix.b = Number(m[1]);
      o.domMatrix.c = Number(m[2]);
      o.domMatrix.d = Number(m[3]);
      o.domMatrix.e = Number(m[4]);
      o.domMatrix.f = Number(m[5]);
      return o;
    }
    save() {
      let o = this.savedMatrixs, next = null;
      if (o) next = o;
      var obj = {
        matrix: this.matrix.toString(),
        next
      };
      this.savedMatrixs = obj;
    }
    restore() {
      this.setMatrixValue(this.savedMatrixs.matrix);
      this.savedMatrixs = this.savedMatrixs.next;
    }
    get realWidth() {
      return this.width;
    }
    get realHeight() {
      return this.height;
    }
    clone() {
      var m = new _Matrix2D();
      m.x = this.x;
      m.y = this.y;
      m.rotation = this.rotation;
      m.scaleX = this.scaleX;
      m.scaleY = this.scaleY;
      m.xAxis = this.xAxis;
      m.yAxis = this.yAxis;
      m.width = this.width;
      m.height = this.height;
      m.setMatrixValue(this.matrix.toString());
      return m;
    }
    applyTransform() {
      const m = this.matrix;
      m.translateSelf(this.x, this.y);
      m.rotateSelf(this.rotation);
      m.translateSelf(-this.xAxis * this.scaleX, -this.yAxis * this.scaleY);
      m.scaleSelf(this.width * this.scaleX, this.height * this.scaleY);
      return m;
    }
    setMatrixValue(s = "matrix(1, 0, 0, 1, 0, 0)") {
      return this.matrix.setMatrixValue(s);
    }
    translate(x, y) {
      return this.matrix.translateSelf(x, y);
    }
    rotate(angle) {
      return this.matrix.rotateSelf(angle);
    }
    scale(x, y) {
      return this.matrix.scaleSelf(x, y);
    }
    invert() {
      return this.matrix.invertSelf();
    }
    rotateFromVector(x, y) {
      return this.matrix.rotateFromVectorSelf(x, y);
    }
    multiply(m) {
      this.matrix.multiplySelf(m.domMatrix);
    }
    preMultiply(m) {
      this.matrix.preMultiplySelf(m.domMatrix);
    }
    identity() {
      this.matrix.setMatrixValue("matrix(1, 0, 0, 1, 0, 0)");
    }
    get domMatrix() {
      return this.matrix;
    }
  };
  __publicField(_Matrix2D, "IDENTITY", new DOMMatrix("matrix(1, 0, 0, 1, 0, 0)"));
  let Matrix2D = _Matrix2D;
  const _Path = class _Path extends RegisterableObject {
    constructor(pathData = null) {
      super();
      __publicField(this, "_path");
      __publicField(this, "_originalW");
      __publicField(this, "_originalH");
      __publicField(this, "_originalX");
      __publicField(this, "_originalY");
      __publicField(this, "_geom");
      __publicField(this, "datas");
      __publicField(this, "bounds", { x: 0, y: 0, w: 0, h: 0 });
      this._path = new Path2D();
      if (!pathData) this.datas = [];
      else {
        this.datas = pathData;
        this.computePath();
      }
    }
    get dataString() {
      return this.datas.join(",");
    }
    static fromDataString(data) {
      var t = data.split(",");
      var t2 = [];
      let i, len = t.length;
      for (i = 0; i < len; i++) t2[i] = Number(t[i]);
      return new _Path(t2);
    }
    newPath() {
      this._path = new Path2D();
      return this._path;
    }
    isPointInPath(context, px, py, fillrule = "nonzero") {
      return context.isPointInPath(this.path, px, py, fillrule);
    }
    isPointInStroke(context, px, py) {
      return context.isPointInStroke(this.path, px, py);
    }
    isPointInside(context, px, py, isStroke, fillrule = "nonzero") {
      if (isStroke) return context.isPointInStroke(this.path, px, py);
      return context.isPointInPath(this.path, px, py, fillrule);
    }
    get originalW() {
      return this._originalW;
    }
    get originalH() {
      return this._originalH;
    }
    get originalX() {
      return this._originalX;
    }
    get originalY() {
      return this._originalY;
    }
    moveTo(x, y) {
      this.datas.push(0, x, y);
    }
    //0
    lineTo(x, y) {
      this.datas.push(1, x, y);
    }
    //1
    circle(x, y, radius) {
      this.arc(x, y, radius);
    }
    //2
    quadraticCurveTo(ax, ay, x, y) {
      this.datas.push(3, ax, ay, x, y);
    }
    //3
    rect(x, y, w, h) {
      this.datas.push(4, x, y, w, h);
    }
    //4
    arc(x, y, radius, startAngle = 0, endAngle = Math.PI * 2) {
      this.datas.push(5, x, y, radius, startAngle, endAngle);
    }
    //5
    arcTo(x0, y0, x1, y1, radius) {
      this.datas.push(6, x0, y0, x1, y1, radius);
    }
    //6
    bezierCurveTo(ax0, ay0, ax1, ay1, x1, y1) {
      this.datas.push(7, ax0, ay0, ax1, ay1, x1, y1);
    }
    //7
    static moveTo(path, datas, i) {
      path.moveTo(datas[i + 1], datas[i + 2]);
    }
    static lineTo(path, datas, i) {
      path.lineTo(datas[i + 1], datas[i + 2]);
    }
    //@ts-ignore
    static circle(path, datas, i) {
      path.arc(datas[i + 1], datas[i + 2], datas[i + 3], 0, Math.PI * 2);
    }
    static rect(path, datas, i) {
      path.rect(datas[i + 1], datas[i + 2], datas[i + 3], datas[i + 4]);
    }
    static quadraticCurveTo(path, datas, i) {
      path.quadraticCurveTo(datas[i + 1], datas[i + 2], datas[i + 3], datas[i + 4]);
    }
    static arc(path, datas, i) {
      path.arc(datas[i + 1], datas[i + 2], datas[i + 3], datas[i + 4], datas[i + 5]);
    }
    static arcTo(path, datas, i) {
      path.arc(datas[i + 1], datas[i + 2], datas[i + 3], datas[i + 4], datas[i + 5]);
    }
    static bezierCurveTo(path, datas, i) {
      path.bezierCurveTo(datas[i + 1], datas[i + 2], datas[i + 3], datas[i + 4], datas[i + 5], datas[i + 6]);
    }
    get path() {
      return this._path;
    }
    get geometry() {
      return this._geom;
    }
    get pathDatas() {
      return this.datas;
    }
    computePath() {
      let i, j, type, minX = 9999999, minY = 9999999, maxX = -9999999, maxY = -9999999;
      let nb, start, val;
      let datas = this.datas;
      let func;
      let count, countOffset;
      let useRadius;
      let o;
      const len = datas.length;
      const objByType = _Path.objByType;
      for (i = 0; i < len; i += count + 1) {
        type = datas[i];
        o = objByType[type];
        count = o.count;
        countOffset = o.countOffset;
        useRadius = o.useRadius;
        start = i + 1;
        nb = count - countOffset;
        nb += start;
        if (useRadius) nb--;
        for (j = start; j < nb; j++) {
          val = datas[j];
          if (val < minX) minX = val;
          if (val < minY) minY = val;
          if (val > maxX) maxX = val;
          if (val > maxY) maxY = val;
        }
        if (useRadius) {
          val = datas[nb];
        }
      }
      let dx = maxX - minX;
      let dy = maxY - minY;
      if (useRadius) {
        dx = 1;
        dy = 1;
        minX = minY = 0;
      }
      this._originalW = Math.abs(dx);
      this._originalH = Math.abs(dy);
      this._originalX = minX;
      this._originalY = minY;
      const path = this._path;
      for (i = 0; i < len; i += count + 1) {
        type = datas[i];
        o = objByType[type];
        func = o.func;
        count = o.count;
        countOffset = o.countOffset;
        useRadius = o.useRadius;
        start = i + 1;
        nb = start + count - countOffset;
        if (useRadius) nb--;
        for (j = start; j < nb; j++) {
          val = datas[j];
          if (j % 2 == 0) {
            val -= minX;
            val /= dx;
          } else {
            val -= minY;
            val /= dy;
          }
          datas[j] = val;
        }
        if (useRadius) {
          val = datas[nb];
          datas[nb] = val;
        }
        func(path, datas, start - 1);
      }
      this._geom = new Geometry(this);
      return this._geom;
    }
  };
  __publicField(_Path, "objByType", [
    { func: _Path.moveTo, count: 2, endXY: 3, countOffset: 0, useRadius: false },
    { func: _Path.lineTo, count: 2, endXY: 3, countOffset: 0, useRadius: false },
    { func: _Path.arc, count: 3, endXY: 3, countOffset: 0, useRadius: true },
    { func: _Path.quadraticCurveTo, count: 4, endXY: 5, countOffset: 0, useRadius: false },
    { func: _Path.rect, count: 4, endXY: 3, countOffset: 0, useRadius: false },
    { func: _Path.arc, count: 5, endXY: 3, countOffset: 2, useRadius: true },
    { func: _Path.arcTo, count: 2, endXY: 3, countOffset: 2, useRadius: true },
    { func: _Path.bezierCurveTo, count: 6, endXY: 7, countOffset: 0, useRadius: false }
  ]);
  let Path = _Path;
  class TextPath extends RegisterableObject {
    constructor(text) {
      super();
      __publicField(this, "text");
      this.text = text;
    }
    get dataString() {
      return this.text;
    }
    static fromDataString(data) {
      return new TextPath(data);
    }
    //@ts-ignore
    isPointInside(context, px, py, isStroke, fillrule = "nonzero") {
      return false;
    }
    //@ts-ignore
    isPointInPath(context, px, py) {
      return false;
    }
    //@ts-ignore
    isPointInStroke(context, px, py) {
      return false;
    }
  }
  class BitmapCacheFill extends FillStroke {
    //@ts-ignore
    constructor(bd, centerInto = true) {
      super();
      __publicField(this, "bd");
      this.bd = bd;
      this.styleType = "fillStyle";
    }
    get width() {
      return this.bd.width;
    }
    get height() {
      return this.bd.height;
    }
    //@ts-ignore
    apply(context, path, target) {
      context.drawImage(this.bd.htmlCanvas, 0, 0);
    }
  }
  class BitmapFill extends FillStroke {
    constructor(bd, centerInto = true) {
      super();
      __publicField(this, "bd");
      __publicField(this, "centerInto", false);
      __publicField(this, "x", 0);
      __publicField(this, "y", 0);
      __publicField(this, "scaleX", 1);
      __publicField(this, "scaleY", 1);
      __publicField(this, "rotation", 0);
      this.bd = bd;
      this.centerInto = centerInto;
      this.styleType = "fillStyle";
    }
    get dataString() {
      var centerInto = 0;
      if (this.centerInto) centerInto = 1;
      return this.bd.REGISTER_ID + "," + centerInto;
    }
    static fromDataString(data) {
      var t = data.split(",");
      return new BitmapFill(ObjectLibrary.instance.getObjectByRegisterId(t[0]), t[1] == "1");
    }
    clone(cloneMedia = false, cloneLineStyle = true) {
      var o;
      if (cloneMedia) o = new BitmapFill(this.bd.clone());
      else o = new BitmapFill(this.bd);
      o.x = this.x;
      o.y = this.y;
      o.scaleX = this.scaleX;
      o.scaleY = this.scaleY;
      o.rotation = this.rotation;
      if (this.lineStyle) {
        if (cloneLineStyle) o.lineStyle = this.lineStyle.clone();
        else o.lineStyle = this.lineStyle;
      }
      return o;
    }
    apply(context, path, target) {
      const bd = this.bd.htmlCanvas;
      context.save();
      context.clip(path.path);
      context.scale(target.inverseW * this.scaleX, target.inverseH * this.scaleY);
      context.translate(target.xAxis, target.yAxis);
      context.rotate(this.rotation);
      if (this.centerInto) context.translate((target.width - bd.width) * 0.5, (target.height - bd.height) * 0.5);
      context.translate(this.x, this.y);
      super.apply(context, path, target);
      if (target.fillStrokeDrawable) context.drawImage(bd, 0, 0);
      context.restore();
    }
  }
  class Gradient extends FillStroke {
    constructor(gradient, isLinear = true) {
      super();
      __publicField(this, "_gradient");
      __publicField(this, "_isLinear");
      __publicField(this, "_x", 0);
      //-> -0.999...+0.999
      __publicField(this, "_y", 0);
      //-> -0.999...+0.999
      __publicField(this, "_scaleX", 1);
      __publicField(this, "_scaleY", 1);
      __publicField(this, "_rotation", 0);
      // radian
      __publicField(this, "_radialFlareX", 0);
      //-> -0.999...+0.999
      __publicField(this, "_radialFlareY", 0);
      //-> -0.999...+0.999
      __publicField(this, "_radialFlareStrength", 1);
      __publicField(this, "dirty", true);
      //@ts-ignore
      __publicField(this, "_name");
      __publicField(this, "gradientCanvas");
      this._gradient = gradient;
      this._isLinear = isLinear;
      gradient.addEventListener(GradientColor.UPDATE_STYLE, () => {
        this.dirty = true;
      });
    }
    clone(cloneGradient = false, cloneColors = false, cloneLineStyle = true, cloneTextStyle = true, cloneTextLineStyle = true) {
      var o;
      if (cloneGradient) o = new Gradient(this._gradient.clone(cloneColors));
      else o = new Gradient(this._gradient);
      o.fillPathRule = this.fillPathRule;
      o.styleType = this.styleType;
      o.x = this.x;
      o.y = this.y;
      o.scaleX = this.scaleX;
      o.scaleY = this.scaleY;
      o.rotation = this.rotation;
      o.radialFlareX = this.radialFlareX;
      o.radialFlareY = this.radialFlareY;
      o.radialFlareStrength = this.radialFlareStrength;
      o.alpha = this.alpha;
      if (this.lineStyle) {
        if (cloneLineStyle) o.lineStyle = this.lineStyle.clone();
        else o.lineStyle = this.lineStyle;
      }
      if (this.textStyle) {
        if (cloneTextStyle) o.textStyle = this.textStyle.clone(cloneTextLineStyle);
        else o.textStyle = this.textStyle;
      }
      return o;
    }
    get gradient() {
      return this._gradient;
    }
    set gradient(n) {
      this._gradient = n;
      this.dirty = true;
    }
    get isLinear() {
      return this._isLinear;
    }
    set isLinear(n) {
      this._isLinear = n;
      this.dirty = true;
    }
    get x() {
      return this._x;
    }
    set x(n) {
      this._x = n;
      this.dirty = true;
    }
    get y() {
      return this._x;
    }
    set y(n) {
      this._y = n;
      this.dirty = true;
    }
    get scaleX() {
      return this._scaleX;
    }
    set scaleX(n) {
      this._scaleX = n;
      this.dirty = true;
    }
    get scaleY() {
      return this._scaleY;
    }
    set scaleY(n) {
      this._scaleY = n;
      this.dirty = true;
    }
    get rotation() {
      return this._rotation;
    }
    set rotation(n) {
      this._rotation = n;
      this.dirty = true;
    }
    get radialFlareX() {
      return this._radialFlareX;
    }
    set radialFlareX(n) {
      this._radialFlareX = n;
      this.dirty = true;
    }
    get radialFlareY() {
      return this._radialFlareY;
    }
    set radialFlareY(n) {
      this._radialFlareY = n;
      this.dirty = true;
    }
    get radialFlareStrength() {
      return this._radialFlareStrength;
    }
    set radialFlareStrength(n) {
      this._radialFlareStrength = n;
      this.dirty = true;
    }
    apply(context, path, target) {
      if (this.dirty || this._gradient.dirty) {
        this._gradient.transformValues(this._x, this._y, this._scaleX, this._scaleY, this._rotation, this._radialFlareX, this._radialFlareY, this._radialFlareStrength);
        this.gradientCanvas = this._gradient.getGradientStyle(context, target);
        this.dirty = false;
      }
      super.apply(context, path, target);
      context[this.styleType] = this.gradientCanvas;
    }
  }
  class GradientFill extends Gradient {
    constructor(gradient, isLinear = true) {
      super(gradient, isLinear);
      this.styleType = "fillStyle";
    }
    get dataString() {
      var linear = 0;
      if (this.isLinear) linear = 1;
      return this.gradient.REGISTER_ID + "," + linear;
    }
    static fromDataString(data) {
      var t = data.split(",");
      return new GradientFill(ObjectLibrary.instance.getObjectByRegisterId(t[0]), t[1] == "1");
    }
    apply(context, path, target) {
      super.apply(context, path, target);
      if (target.fillStrokeDrawable) context.fill(path.path, this.fillPathRule);
    }
  }
  class Video extends BitmapData {
    constructor(w, h, url = "", muted = true, autoplay = true) {
      super(1, 1);
      __publicField(this, "video");
      __publicField(this, "playerW");
      __publicField(this, "playerH");
      __publicField(this, "videoW");
      __publicField(this, "videoH");
      __publicField(this, "duration");
      __publicField(this, "playing", false);
      __publicField(this, "canPlay", false);
      __publicField(this, "useBitmapData", false);
      __publicField(this, "bmp");
      __publicField(this, "firstFrameRendered", false);
      __publicField(this, "oldTime", -1e4);
      __publicField(this, "crop", true);
      __publicField(this, "loop", true);
      __publicField(this, "fps", 30);
      __publicField(this, "url");
      this.playerW = w;
      this.playerH = h;
      var video = this.video = document.createElement("video");
      video.style.visibility = "hidden";
      video.width = w;
      video.height = h;
      video.muted = muted;
      video.autoplay = autoplay;
      video.src = this.url = url;
      this.useNativeBitmapData = true;
      var th = this;
      var started = false;
      video.onpause = function() {
        th.playing = false;
      };
      video.onwaiting = function() {
        th.playing = false;
      };
      video.onplay = function() {
        th.playing = true;
      };
      video.onended = function() {
        th.playing = false;
        if (th.loop) video.play();
      };
      video.oncanplay = function() {
        th.videoW = video.videoWidth;
        th.videoH = video.videoHeight;
        th.canPlay = true;
        if (!started && autoplay) {
          started = true;
          document.body.appendChild(video);
        }
        if (!th.firstFrameRendered) th.update();
      };
    }
    get dataString() {
      return [
        this.playerW,
        this.playerH,
        this.video.src,
        Number(this.video.muted),
        Number(this.video.autoplay),
        Number(this.crop),
        Number(this.loop),
        this.fps
      ].join(",");
    }
    static fromDataString(data) {
      let t = data.split(",");
      let v = new Video(Number(t[0]), Number(t[1]), t[2], t[3] == "1", t[4] == "1");
      v.crop = t[5] == "1";
      v.loop = t[6] == "1";
      v.fps = Number(t[7]);
      return v;
    }
    update() {
      if (this.playing || this.firstFrameRendered == false) {
        if (Math.abs(this.video.currentTime - this.oldTime) < 1 / this.fps) return;
        this.oldTime = this.video.currentTime;
        if (this.useBitmapData) {
          var s;
          var w = this.videoW;
          var h = this.videoH;
          var srcX = 0, srcY = 0;
          var srcW = w, srcH = h;
          var destX = 0, destY = 0;
          var destW = this.playerW, destH = this.playerH;
          s = w / this.playerW;
          w *= s;
          h *= s;
          if (!this.crop) {
            s = this.playerH / h;
            w *= s;
            h *= s;
            if (w > this.playerW) {
              s = this.playerW / w;
              w *= s;
              h *= s;
            }
            destX = (this.playerW - w) * 0.5;
            destY = (this.playerH - h) * 0.5;
            destW = this.playerW - destX * 2;
            destH = this.playerH - destY * 2;
          } else {
            s = this.playerW / w;
            w *= s;
            h *= s;
            if (h < this.playerH) {
              s = this.playerH / h;
              w *= s;
              h *= s;
            }
            var scale = w / this.videoW;
            srcX = (w - this.playerW) * 0.5 / scale;
            srcY = (h - this.playerH) * 0.5 / scale;
            srcW = this.videoW - srcX * 2;
            srcH = this.videoH - srcY * 2;
          }
          this.context.drawImage(this.video, srcX, srcY, srcW, srcH, destX, destY, destW, destH);
          this.dispatchEvent(BitmapData.IMAGE_LOADED);
        } else {
          createImageBitmap(this.video).then((bmp) => {
            this.bmp = bmp;
            this.dispatchEvent(BitmapData.IMAGE_LOADED);
          });
        }
        return true;
      }
    }
    get htmlCanvas() {
      if (this.useBitmapData) return this.canvas;
      else {
        if (this.bmp) return this.bmp;
        return this.canvas;
      }
    }
    get useNativeBitmapData() {
      return this.useBitmapData;
    }
    set useNativeBitmapData(b) {
      if (this.useBitmapData != b) {
        if (b) {
          this.canvas.width = this.video.width;
          this.canvas.height = this.video.height;
        } else {
          this.canvas.width = this.canvas.height = 1;
        }
        this.useBitmapData = b;
      }
    }
    get ready() {
      return this.canPlay;
    }
    get htmlVideo() {
      return this.video;
    }
    play() {
      if (!document.body.contains(this.video)) document.body.appendChild(this.video);
      this.video.play();
    }
    stop() {
      if (document.body.contains(this.video)) document.body.removeChild(this.video);
      this.video.src = "";
    }
    seekPercent(pct) {
      this.video.currentTime = this.duration * pct;
    }
    seekTime(timeInSecond) {
      this.video.currentTime = timeInSecond;
    }
  }
  class Pattern extends FillStroke {
    //private videoUpdate: boolean = false;
    constructor(source, crop = true, applyTargetScale = false) {
      super();
      __publicField(this, "source");
      __publicField(this, "matrix");
      __publicField(this, "dirty", true);
      __publicField(this, "dirtyMatrix", true);
      __publicField(this, "patternCanvas");
      __publicField(this, "canvas");
      __publicField(this, "center");
      __publicField(this, "targetW");
      __publicField(this, "targetH");
      __publicField(this, "imageBmp", null);
      __publicField(this, "rotationInDegree", 0);
      __publicField(this, "onImageLoaded");
      __publicField(this, "_crop", true);
      __publicField(this, "_applyTargetScale", false);
      this.source = source;
      var th = this;
      this.onImageLoaded = function(e) {
        th.imageBmp = null;
        th.dirty = th.dirtyMatrix = true;
      };
      source.addEventListener(BitmapData.IMAGE_LOADED, this.onImageLoaded);
      this.canvas = source.htmlCanvas;
      this.matrix = new Matrix2D();
      this._crop = crop;
      this._applyTargetScale = applyTargetScale;
    }
    get crop() {
      return this._crop;
    }
    set crop(b) {
      if (this._crop != b) {
        this.dirty = this.dirtyMatrix = true;
        this._crop = b;
      }
    }
    get applyTargetScale() {
      return this._applyTargetScale;
    }
    set applyTargetScale(b) {
      if (this._applyTargetScale != b) {
        this.dirty = this.dirtyMatrix = true;
        this._crop = b;
      }
    }
    clone(cloneMedia = false, cloneLineStyle = true, cloneTextStyle = true, cloneTextLineStyle = true) {
      var o;
      if (!cloneMedia) o = new Pattern(this.source);
      else {
        if (this.source instanceof BitmapData) o = new Pattern(this.source.clone());
        else o = new Pattern(this.source);
      }
      o.mat.x = this.matrix.x;
      o.mat.y = this.matrix.y;
      o.mat.scaleX = this.matrix.scaleX;
      o.mat.scaleY = this.matrix.scaleY;
      o.mat.rotation = this.matrix.rotation;
      o.mat.width = this.matrix.width;
      o.mat.height = this.matrix.height;
      o.mat.setMatrixValue(this.matrix.toString());
      o.fillPathRule = this.fillPathRule;
      o.styleType = this.styleType;
      if (this.lineStyle) {
        if (cloneLineStyle) o.lineStyle = this.lineStyle.clone();
        else o.lineStyle = this.lineStyle;
      }
      if (this.textStyle) {
        if (cloneTextStyle) o.textStyle = this.textStyle.clone(cloneTextLineStyle);
        else o.textStyle = this.textStyle;
      }
      o.alpha = this.alpha;
      return o;
    }
    get mat() {
      return this.matrix;
    }
    get imageSource() {
      return this.source;
    }
    set bitmapData(n) {
      if (n != this.source) {
        if (this.source && this.source instanceof BitmapData) this.source.removeEventListener(BitmapData.IMAGE_LOADED, this.onImageLoaded);
        this.source = n;
        this.source.addEventListener(BitmapData.IMAGE_LOADED, this.onImageLoaded);
        this.canvas = this.source.htmlCanvas;
        this.dirty = true;
      }
    }
    get centerInto() {
      return this.center;
    }
    set centerInto(n) {
      if (n != this.center) {
        this.center = n;
        this.dirtyMatrix = true;
      }
    }
    get targetWidth() {
      return this.targetW;
    }
    set targetWidth(n) {
      if (n != this.targetW) {
        this.targetW = n;
        this.dirtyMatrix = true;
      }
    }
    get targetHeight() {
      return this.targetW;
    }
    set targetHeight(n) {
      if (n != this.targetH) {
        this.targetH = n;
        this.dirtyMatrix = true;
      }
    }
    get x() {
      return this.matrix.x;
    }
    set x(n) {
      if (this.x != n) {
        this.matrix.x = n;
        this.dirtyMatrix = true;
      }
    }
    get y() {
      return this.matrix.y;
    }
    set y(n) {
      if (this.y != n) {
        this.matrix.y = n;
        this.dirtyMatrix = true;
      }
    }
    get scaleX() {
      return this.matrix.scaleX;
    }
    set scaleX(n) {
      if (this.scaleX != n) {
        this.matrix.scaleX = n;
        this.dirtyMatrix = true;
      }
    }
    get scaleY() {
      return this.matrix.scaleY;
    }
    set scaleY(n) {
      if (this.scaleY != n) {
        this.matrix.scaleY = n;
        this.dirtyMatrix = true;
      }
    }
    get rotation() {
      return this.matrix.rotation;
    }
    set rotation(n) {
      if (this.rotation != n) {
        this.rotationInDegree = n;
        this.matrix.rotation = n;
        this.dirtyMatrix = true;
      }
    }
    /*
    
    
      - Display2D.stack -> ajouter parametre cacheAsBitmap=false,cacheAsBitmapFilter=false
                          => gestion du cachesource des FillStroke
    
                          ==> faire en sorte que le cache des FillStroke / Filter soit associé au Display2D
                              -> creer un id unique par FillStroke/Filter
    
                          ##>>>> créer un objet StyleStack associé à la renderStack
                                 => on recréé une renderStack qui contiendra une liste d'objet permettant d'utiliser
                                    soit un element de la renderStack source, soit un clone de l'objet source
                                    => on garde la référence de la source
                                    => c'est cet objet qui contiendra le cachesource du fillStroke/filter
    
    
                                 ===> c'est l'objet qui sera utilisé pour générer le rendu final du Display2D
    
    
                                 -> contient les cachesource des FillStroke/Filter
    
    
      */
    apply(context, path, target) {
      let canvas = this.canvas;
      if (this.source instanceof BitmapData) {
        canvas = this.source.htmlCanvas;
        if (this.source instanceof Video) {
          this.dirty = this.source.update();
        }
      } else {
        canvas = this.source;
      }
      if (this.dirty) {
        this.patternCanvas = context.createPattern(canvas, "repeat");
        this.dirty = false;
      }
      if (!this.patternCanvas) return;
      this.targetW = target.width;
      this.targetH = target.height;
      var w = canvas.width;
      var h = canvas.height;
      let tw = target.width * target.scaleX;
      let th = target.height * target.scaleY;
      if (this.dirtyMatrix) {
        this.matrix.identity();
        let stx = 1, sty = 1;
        if (this.applyTargetScale) {
          stx = target.scaleX;
          sty = target.scaleY;
        }
        let sx = 1, sy = 1;
        if (this.crop) {
          let s = tw / w;
          w *= s;
          h *= s;
          if (h < th) {
            s = th / h;
            w *= s;
            h *= s;
          }
          sx = w / canvas.width;
          sy = w / canvas.width;
          this.matrix.scale(sx * target.inverseW / target.scaleX, sy * target.inverseH / target.scaleY);
          this.matrix.translate(-((w - tw) / sx) * 0.5, -((h - th) / sy) * 0.5);
          this.matrix.translate(w / sx / 2, h / sy / 2);
          this.matrix.scale(this.scaleX * stx, this.scaleY * sty);
          this.matrix.rotate(this.rotation / FillStroke.radian);
          this.matrix.translate(-(w / sx) / 2, -(h / sy) / 2);
          this.matrix.translate(this.x, this.y);
        } else {
          this.matrix.scale(sx * stx * target.inverseW * this.scaleX, sy * sty * target.inverseH * this.scaleY);
          this.matrix.rotate(this.rotation / FillStroke.radian);
          this.matrix.translate(this.x, this.y);
        }
        this.dirtyMatrix = false;
      }
      super.apply(context, path, target);
      let pattern = this.patternCanvas;
      pattern.setTransform(this.matrix.domMatrix);
      context[this.styleType] = pattern;
    }
  }
  class PatternFill extends Pattern {
    constructor(source, crop = true, applyTargetScale = false) {
      super(source, crop, applyTargetScale);
      this.styleType = "fillStyle";
    }
    get dataString() {
      var crop = 0;
      var targetScale = 0;
      if (this.crop) crop = 1;
      if (this.applyTargetScale) targetScale = 1;
      return this.source.REGISTER_ID + "," + crop + "," + targetScale;
    }
    static fromDataString(data) {
      var t = data.split(",");
      return new PatternFill(ObjectLibrary.instance.getObjectByRegisterId(t[0]), t[1] == "1", t[1] == "1");
    }
    apply(context, path, target) {
      super.apply(context, path, target);
      if (target.fillStrokeDrawable) context.fill(path.path, this.fillPathRule);
    }
  }
  class Solid extends FillStroke {
    constructor(r = "#000000", g = null, b = null, a = null) {
      super();
      __publicField(this, "color");
      if (r instanceof SolidColor) this.color = r;
      else {
        this.color = new SolidColor(r, g, b, a);
      }
    }
    clone(cloneColor = false, cloneLineStyle = true, cloneTextStyle = true, cloneTextLineStyle = true) {
      var o;
      if (cloneColor) o = new Solid(this.color.clone());
      else o = new Solid(this.color);
      o.fillPathRule = this.fillPathRule;
      o.styleType = this.styleType;
      o.alpha = this.alpha;
      if (this.lineStyle) {
        if (cloneLineStyle) o.lineStyle = this.lineStyle.clone();
        else o.lineStyle = this.lineStyle;
      }
      if (this.textStyle) {
        if (cloneTextStyle) o.textStyle = this.textStyle.clone(cloneTextLineStyle);
        else o.textStyle = this.textStyle;
      }
      return o;
    }
    apply(context, path, target) {
      super.apply(context, path, target);
      context[this.styleType] = this.color.style;
    }
  }
  class SolidFill extends Solid {
    constructor(r = "#000000", g = null, b = null, a = null) {
      super(r, g, b, a);
      this.styleType = "fillStyle";
    }
    get dataString() {
      return this.color.REGISTER_ID;
    }
    static fromDataString(data) {
      return new SolidFill(ObjectLibrary.instance.getObjectByRegisterId(data));
    }
    apply(context, path, target) {
      super.apply(context, path, target);
      if (target.fillStrokeDrawable) context.fill(path.path, this.fillPathRule);
    }
  }
  class LineStyle extends RegisterableObject {
    constructor(lineWidth = null) {
      super();
      __publicField(this, "cap", null);
      __publicField(this, "dashOffset", null);
      __publicField(this, "dashLineDist", null);
      __publicField(this, "dashHoleDist", null);
      __publicField(this, "join", null);
      __publicField(this, "lineWidth", null);
      __publicField(this, "miterLimit", null);
      __publicField(this, "allowScaleTransform", true);
      this.lineWidth = lineWidth;
    }
    get dataString() {
      const dataStr = [this.lineWidth, this.cap, this.dashOffset, this.dashLineDist, this.dashHoleDist, this.join, this.miterLimit, Number(this.allowScaleTransform)].join(",");
      console.log("LineStyle get dataString = ", dataStr);
      return dataStr;
    }
    static fromDataString(data) {
      var t = data.split(",");
      var o = new LineStyle(Number(t[0]));
      if (t[1] != "") o.cap = t[1];
      if (t[2] != "") o.dashOffset = Number(t[2]);
      if (t[3] != "") o.dashLineDist = Number(t[3]);
      if (t[4] != "") o.dashHoleDist = Number(t[4]);
      if (t[5] != "") o.join = t[5];
      if (t[6] != "") o.miterLimit = Number(t[6]);
      o.allowScaleTransform = t[7] == "1";
      console.log("LineStyle fromDataString = ", o, t);
      return o;
    }
    clone() {
      var o = new LineStyle(this.lineWidth);
      o.cap = this.cap;
      o.dashOffset = this.dashOffset;
      o.dashHoleDist = this.dashHoleDist;
      o.dashLineDist = this.dashLineDist;
      o.join = this.join;
      o.miterLimit = this.miterLimit;
      return o;
    }
    //@ts-ignore
    apply(context, path, target) {
      if (this.cap) context.lineCap = this.cap;
      if (this.join) context.lineJoin = this.join;
      if (this.lineWidth) context.lineWidth = this.lineWidth;
      if (this.miterLimit) context.miterLimit = this.miterLimit;
      let sx = 1, sy = 1;
      if (this.allowScaleTransform) {
        sx = target.scaleX;
        sy = target.scaleY;
      }
      let s = Math.max(target.width / sx, target.height / sy);
      let s2 = Math.min(target.width, target.height);
      if (this.dashOffset) context.lineDashOffset = this.dashOffset;
      if (this.dashLineDist) {
        if (this.dashHoleDist) context.setLineDash([this.dashLineDist / s, this.dashHoleDist / s]);
        else context.setLineDash([this.dashLineDist / s]);
      }
      context.lineWidth = this.lineWidth / s2;
    }
  }
  class GradientStroke extends Gradient {
    constructor(gradient, isLinear = true, lineStyle = null) {
      super(gradient, isLinear);
      this.styleType = "strokeStyle";
      this.lineStyle = lineStyle ? lineStyle : new LineStyle(2);
    }
    get dataString() {
      var linear = 0;
      if (this.isLinear) linear = 1;
      console.log("GradientStroke lineStyle = ", this.lineStyle);
      return this.gradient.REGISTER_ID + "," + linear + "," + (this.lineStyle ? this.lineStyle.REGISTER_ID : "null");
    }
    static fromDataString(data) {
      var t = data.split(",");
      return new GradientStroke(ObjectLibrary.instance.getObjectByRegisterId(t[0]), t[1] == "1", ObjectLibrary.instance.getObjectByRegisterId(t[2]));
    }
    apply(context, path, target) {
      if (this.lineStyle) this.lineStyle.apply(context, path, target);
      super.apply(context, path, target);
      if (target.fillStrokeDrawable) context.stroke(path.path);
    }
  }
  class PatternStroke extends Pattern {
    constructor(source, crop = true, applyTargetScale = false, lineStyle = null) {
      super(source, crop, applyTargetScale);
      this.styleType = "strokeStyle";
      this.lineStyle = lineStyle ? lineStyle : new LineStyle(2);
    }
    get dataString() {
      var crop = 0;
      var targetScale = 0;
      if (this.crop) crop = 1;
      if (this.applyTargetScale) targetScale = 1;
      return this.source.REGISTER_ID + "," + crop + "," + targetScale + "," + this.lineStyle.REGISTER_ID;
    }
    static fromDataString(data) {
      var t = data.split(",");
      return new PatternStroke(ObjectLibrary.instance.getObjectByRegisterId(t[0]), t[1] == "1", t[2] == "1", ObjectLibrary.instance.getObjectByRegisterId(t[3]));
    }
    apply(context, path, target) {
      if (this.lineStyle) this.lineStyle.apply(context, path, target);
      super.apply(context, path, target);
      if (target.fillStrokeDrawable) context.stroke(path.path);
    }
  }
  class SolidStroke extends Solid {
    constructor(r = "#000000", g = null, b = null, a = null, lineStyle = null) {
      if (g instanceof LineStyle) {
        lineStyle = g;
        g = null;
      }
      super(r, g, b, a);
      this.styleType = "strokeStyle";
      if (!lineStyle) this.lineStyle = new LineStyle(2);
      else this.lineStyle = lineStyle;
    }
    get dataString() {
      return this.color.REGISTER_ID + "," + (this.lineStyle ? this.lineStyle.REGISTER_ID : "null");
    }
    static fromDataString(data) {
      const t = data.split(",");
      return new SolidStroke(ObjectLibrary.instance.getObjectByRegisterId(t[0]), null, null, null, ObjectLibrary.instance.getObjectByRegisterId(t[1]));
    }
    apply(context, path, target) {
      if (this.lineStyle) this.lineStyle.apply(context, path, target);
      super.apply(context, path, target);
      if (target.fillStrokeDrawable) context.stroke(path.path);
    }
  }
  class GradientTextFill extends Gradient {
    constructor(textStyle, gradient, isLinear = true) {
      super(gradient, isLinear);
      this.styleType = "fillStyle";
      this.textStyle = textStyle;
    }
    get dataString() {
      var linear = 0;
      if (this.isLinear) linear = 1;
      return this.textStyle.REGISTER_ID + "," + this.gradient.REGISTER_ID + "," + linear;
    }
    static fromDataString(data) {
      var t = data.split(",");
      return new GradientTextFill(ObjectLibrary.instance.getObjectByRegisterId(t[0]), ObjectLibrary.instance.getObjectByRegisterId(t[1]), t[2] == "1");
    }
    apply(context, path, target) {
      this.textStyle.apply(context, path, target);
      super.apply(context, path, target);
      if (target.fillStrokeDrawable) context.fillText(path.text, this.textStyle.offsetX / target.width, this.textStyle.offsetY / target.height);
    }
  }
  class PatternTextFill extends Pattern {
    constructor(textStyle, bd, crop = true, applyTargetScale = false) {
      super(bd, crop, applyTargetScale);
      this.styleType = "fillStyle";
      this.textStyle = textStyle;
    }
    get dataString() {
      var crop = 0;
      var targetScale = 0;
      if (this.crop) crop = 1;
      if (this.applyTargetScale) targetScale = 1;
      return this.textStyle.REGISTER_ID + "," + this.source.REGISTER_ID + "," + crop + "," + targetScale;
    }
    static fromDataString(data) {
      var t = data.split(",");
      return new PatternTextFill(ObjectLibrary.instance.getObjectByRegisterId(t[0]), ObjectLibrary.instance.getObjectByRegisterId(t[1]), t[2] == "1", t[3] == "1");
    }
    apply(context, path, target) {
      this.textStyle.apply(context, path, target);
      super.apply(context, path, target);
      if (target.fillStrokeDrawable) context.fillText(path.text, this.textStyle.offsetX / target.width, this.textStyle.offsetY / target.height);
    }
  }
  class SolidTextFill extends Solid {
    constructor(textStyle, r = "#000000", g = null, b = null, a = null) {
      super(r, g, b, a);
      this.styleType = "fillStyle";
      this.textStyle = textStyle;
    }
    get dataString() {
      return this.textStyle.REGISTER_ID + "," + this.color.REGISTER_ID;
    }
    static fromDataString(data) {
      var t = data.split(",");
      return new SolidTextFill(ObjectLibrary.instance.getObjectByRegisterId(t[0]), ObjectLibrary.instance.getObjectByRegisterId(t[1]));
    }
    apply(context, path, target) {
      this.textStyle.apply(context, path, target);
      super.apply(context, path, target);
      if (target.fillStrokeDrawable) context.fillText(path.text, this.textStyle.offsetX / target.width, this.textStyle.offsetY / target.height);
    }
  }
  class GradientTextStroke extends Gradient {
    constructor(textStyle, gradient, isLinear = true) {
      super(gradient, isLinear);
      this.styleType = "strokeStyle";
      this.textStyle = textStyle;
    }
    get dataString() {
      var linear = 0;
      if (this.isLinear) linear = 1;
      return this.textStyle.REGISTER_ID + "," + this.gradient.REGISTER_ID + "," + linear;
    }
    static fromDataString(data) {
      var t = data.split(",");
      return new GradientTextStroke(ObjectLibrary.instance.getObjectByRegisterId(t[0]), ObjectLibrary.instance.getObjectByRegisterId(t[1]), t[2] == "1");
    }
    apply(context, path, target) {
      this.textStyle.apply(context, path, target);
      super.apply(context, path, target);
      if (target.fillStrokeDrawable) context.strokeText(path.text, this.textStyle.offsetX / target.width, this.textStyle.offsetY / target.height);
    }
  }
  class PatternTextStroke extends Pattern {
    constructor(textStyle, bd, centerInto = true, applyTargetScale = false) {
      super(bd, centerInto, applyTargetScale);
      this.styleType = "strokeStyle";
      this.textStyle = textStyle;
    }
    get dataString() {
      var crop = 0;
      var targetScale = 0;
      if (this.crop) crop = 1;
      if (this.applyTargetScale) targetScale = 1;
      return this.textStyle.REGISTER_ID + "," + this.source.REGISTER_ID + "," + crop + "," + targetScale;
    }
    static fromDataString(data) {
      var t = data.split(",");
      return new PatternTextStroke(ObjectLibrary.instance.getObjectByRegisterId(t[0]), ObjectLibrary.instance.getObjectByRegisterId(t[1]), t[2] == "1", t[3] == "1");
    }
    apply(context, path, target) {
      this.textStyle.apply(context, path, target);
      super.apply(context, path, target);
      if (target.fillStrokeDrawable) context.strokeText(path.text, this.textStyle.offsetX / target.width, this.textStyle.offsetY / target.height);
    }
  }
  class SolidTextStroke extends Solid {
    constructor(textStyle, r = "#000000", g = null, b = null, a = null) {
      super(r, g, b, a);
      this.styleType = "strokeStyle";
      this.textStyle = textStyle;
    }
    get dataString() {
      console.log("SolidTextStroke get dataString textStyle = ", this.textStyle);
      console.log("SolidTextStroke get dataString color = ", this.color);
      return this.textStyle.REGISTER_ID + "," + this.color.REGISTER_ID;
    }
    static fromDataString(data) {
      var t = data.split(",");
      console.log("SolidTextStroke fromDataString textStyle  = ", ObjectLibrary.instance.getObjectByRegisterId(t[0]));
      console.log("SolidTextStroke fromDataString color = ", ObjectLibrary.instance.getObjectByRegisterId(t[1]));
      return new SolidTextStroke(ObjectLibrary.instance.getObjectByRegisterId(t[0]), ObjectLibrary.instance.getObjectByRegisterId(t[1]));
    }
    apply(context, path, target) {
      this.textStyle.apply(context, path, target);
      super.apply(context, path, target);
      if (target.fillStrokeDrawable) context.strokeText(path.text, this.textStyle.offsetX / target.width, this.textStyle.offsetY / target.height);
    }
  }
  class Shape extends RegisterableObject {
    constructor(x, y, w, h, renderStack) {
      super();
      __publicField(this, "x");
      __publicField(this, "y");
      __publicField(this, "w");
      __publicField(this, "h");
      __publicField(this, "renderStack");
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.renderStack = renderStack;
    }
    get dataString() {
      return [this.x, this.y, this.w, this.h, this.renderStack.REGISTER_ID].join(",");
    }
    static fromDataString(data) {
      var t = data.split(",");
      return new Shape(Number(t[0]), Number(t[1]), Number(t[2]), Number(t[3]), ObjectLibrary.instance.getObjectByRegisterId(t[4]));
    }
    apply(context, target, mouseX = Number.MAX_VALUE, mouseY = Number.MAX_VALUE) {
      context.save();
      context.translate(this.x * target.inverseW, this.y * target.inverseH);
      context.scale(this.w / target.width, this.h / target.height);
      var b;
      if (target.mouseEnabled) b = this.renderStack.updateWithHitTest(context, target, mouseX, mouseY, true);
      else {
        b = this.renderStack.update(context, target, true);
      }
      context.restore();
      return b;
    }
  }
  class RenderStackElement extends RegisterableObject {
    constructor(element, mouseEnabled = true) {
      super();
      __publicField(this, "value");
      __publicField(this, "enabled", true);
      __publicField(this, "mouseEnabled");
      __publicField(this, "lastPath", null);
      __publicField(this, "lastFillStroke", null);
      __publicField(this, "isShape");
      __publicField(this, "isPath");
      __publicField(this, "isTextPath");
      __publicField(this, "isPathFill");
      __publicField(this, "isPathStroke");
      __publicField(this, "isTextFill");
      __publicField(this, "isTextStroke");
      __publicField(this, "isTextFillStroke");
      __publicField(this, "isPathFillStroke");
      __publicField(this, "isStroke");
      this.value = element;
      this.mouseEnabled = mouseEnabled;
      this.isShape = this.value instanceof Shape;
      if (this.isShape) return;
      this.isPath = this.value instanceof Path;
      this.isTextPath = this.value instanceof TextPath;
      if (this.isPath || this.isTextPath) return;
      this.isPathFill = this.value instanceof SolidFill || this.value instanceof GradientFill || this.value instanceof PatternFill || this.value instanceof BitmapFill || this.value instanceof BitmapCacheFill;
      this.isPathStroke = this.value instanceof SolidStroke || this.value instanceof GradientStroke || this.value instanceof PatternStroke;
      this.isTextFill = this.value instanceof SolidTextFill || this.value instanceof GradientTextFill || this.value instanceof PatternTextFill;
      this.isTextStroke = this.value instanceof SolidTextStroke || this.value instanceof GradientTextStroke || this.value instanceof PatternTextStroke;
      this.isTextFillStroke = this.value instanceof SolidTextFill || this.value instanceof GradientTextFill || this.value instanceof PatternTextFill || this.value instanceof SolidTextStroke || this.value instanceof GradientTextStroke || this.value instanceof PatternTextStroke;
      this.isPathFillStroke = this.value instanceof SolidStroke || this.value instanceof GradientStroke || this.value instanceof PatternStroke || this.value instanceof SolidFill || this.value instanceof GradientFill || this.value instanceof PatternFill || this.value instanceof BitmapFill;
      this.isStroke = this.isTextStroke || this.isPathStroke;
    }
    get dataString() {
      var mouseEnabled = 0;
      var lastPath = "0";
      var lastFillStroke = "0";
      if (this.mouseEnabled) mouseEnabled = 1;
      if (this.lastPath) lastPath = this.lastPath.REGISTER_ID;
      if (this.lastFillStroke) lastFillStroke = this.lastFillStroke.REGISTER_ID;
      return [this.value.REGISTER_ID, mouseEnabled, lastPath, lastFillStroke, Number(this.enabled)].join(",");
    }
    static fromDataString(data) {
      var t = data.split(",");
      var r = new RenderStackElement(ObjectLibrary.instance.getObjectByRegisterId(t[0]), t[1] == "1");
      if (t[2] != "0") r.lastPath = ObjectLibrary.instance.getObjectByRegisterId(t[2]);
      if (t[3] != "0") r.lastFillStroke = ObjectLibrary.instance.getObjectByRegisterId(t[3]);
      r.enabled = t[4] == "1";
      return r;
    }
    clone() {
      var o = new RenderStackElement(this.value, this.mouseEnabled);
      o.init(this.lastPath, this.lastFillStroke);
      return o;
    }
    init(lastPath, lastFillStroke) {
      this.lastPath = lastPath;
      this.lastFillStroke = lastFillStroke;
    }
  }
  class RenderStack extends RegisterableObject {
    constructor() {
      super();
      __publicField(this, "lastPath");
      __publicField(this, "lastFillStroke");
      __publicField(this, "_elements");
      __publicField(this, "offsetW", 0);
      __publicField(this, "offsetH", 0);
      __publicField(this, "mouse");
      this._elements = [];
    }
    get dataString() {
      var s = "";
      var lastPath = "0";
      var lastFillStroke = "0";
      if (this.lastPath) lastPath = this.lastPath.REGISTER_ID;
      if (this.lastFillStroke) lastFillStroke = this.lastFillStroke.REGISTER_ID;
      s = lastPath + "," + lastFillStroke + "#";
      var i, len = this._elements.length;
      if (len == 0) return "";
      for (i = 0; i < len; i++) {
        if (i > 0) s += ",";
        s += this._elements[i].REGISTER_ID;
      }
      return s;
    }
    static fromDataString(data) {
      var t2 = data.split("#");
      var t3 = t2[0].split(",");
      var t = t2[1].split(",");
      var i, len = t.length;
      var r = new RenderStack();
      for (i = 0; i < len; i++) {
        r.elements[i] = ObjectLibrary.instance.getObjectByRegisterId(t[i]);
      }
      if (t3[0] != "0") r.lastPath = ObjectLibrary.instance.getObjectByRegisterId(t3[0]);
      if (t3[1] != "0") r.lastFillStroke = ObjectLibrary.instance.getObjectByRegisterId(t3[1]);
      return r;
    }
    get elements() {
      return this._elements;
    }
    clone() {
      var o = new RenderStack();
      var i, len = this.elements.length;
      for (i = 0; i < len; i++) o.elements[i] = this.elements[i].clone();
      return o;
    }
    //##############
    //la renderStack ne peut pas etre une linked-list de telle manière qu'on puisse cloner le tableau contenant les objets sans cloner les objets
    //et de cloner un élément dans le tableau sans affecter tout le to
    //#################
    push(renderStackElement, mouseEnabled = true) {
      var o = new RenderStackElement(renderStackElement, mouseEnabled);
      this._elements.push(o);
      if (renderStackElement instanceof Path || renderStackElement instanceof TextPath) this.lastPath = renderStackElement;
      else if (renderStackElement instanceof FillStroke) this.lastFillStroke = renderStackElement;
      o.init(this.lastPath, this.lastFillStroke);
      return o;
    }
    updateWithHitTest(context, target, mouseX = Number.MAX_VALUE, mouseY = Number.MAX_VALUE, updateFromShape = false) {
      let o;
      let path;
      let hitTest = false;
      let i, nb = this.elements.length;
      let b;
      for (i = 0; i < nb; i++) {
        o = this.elements[i];
        context.save();
        if (o.enabled) {
          if (o.isShape) {
            b = o.value.apply(context, target, mouseX, mouseY);
            if (!hitTest) hitTest = b;
          } else {
            if (o.isPath || o.isTextPath) path = o.value;
            else {
              o.value.apply(context, path, target);
              if (!hitTest && o.mouseEnabled && target.useComplexHitTest) hitTest = path.isPointInside(context, mouseX, mouseY, o.isStroke);
            }
          }
        }
        context.restore();
      }
      if (!updateFromShape && target.cacheAsBitmap) {
        this.updateBounds(target);
        target.bitmapCache.draw(context, this.offsetW, this.offsetH);
      }
      if (target.mouseIsOver == false && hitTest) target.onMouseOver();
      if (target.mouseIsOver && hitTest == false) target.onMouseOut();
      return hitTest;
    }
    update(context, target, updateFromShape = false) {
      let o;
      let path;
      if (updateFromShape || target.cacheAsBitmap == false) {
        let i, nb = this.elements.length;
        for (i = 0; i < nb; i++) {
          o = this.elements[i];
          context.save();
          if (o.enabled) {
            if (o.isPath || o.isTextPath) path = o.value;
            else o.value.apply(context, path, target);
          }
          context.restore();
        }
      } else {
        this.updateBounds(target);
        target.bitmapCache.draw(context, this.offsetW, this.offsetH);
      }
      return false;
    }
    /*
      public update(context:CanvasRenderingContext2D,target:Display2D,mouseX:number=Number.MAX_VALUE,mouseY:number=Number.MAX_VALUE):void{
        let o:RenderStackElement;
        let path:Path;
        let text:TextPath;
        let hitTest:boolean = false;
        let fillStroke:FillStroke;
    
    
    
        let i:number,nb:number = this.elements.length;
        for(i=0;i<nb;i++){
          o = this.elements[i];
    
    
            //context.beginPath();
            context.save();
            if(o.enabled){
              if(o.isPath) path = o.value as Path
              else if(o.isTextPath) text = o.value as TextPath;
              else {
    
    
                if(o.isTextFillStroke){
                  (o.value as TextRenderable).apply(context,text,target);
                  if(!hitTest && o.mouseEnabled && target.useComplexHitTest) {
                       hitTest = (o.isTextFill && text.isPointInPath(context,mouseX,mouseY)) || (o.isTextStroke && text.isPointInStroke(context,mouseX,mouseY));
                  }
    
                }else{
    
                  fillStroke = o.value as FillStroke;
                  (fillStroke as PathRenderable).apply(context,path,target);
    
                   if(!hitTest && o.mouseEnabled && target.useComplexHitTest) {
                       hitTest = (o.isPathFill && path.isPointInPath(context,mouseX,mouseY,(o.value as FillStroke).fillPathRule)) || (o.isPathStroke && path.isPointInStroke(context,mouseX,mouseY));
                   }
                }
              }
            }
    
            context.restore();
        }
        //console.log(this.offsetW,this.offsetH)
    
    
        if(target.cacheAsBitmap){
          this.updateBounds(target);
          target.bitmapCache.draw(context,this.offsetW,this.offsetH);
        }
    
    
        if(target.mouseIsOver == false && hitTest) target.onMouseOver();
        if(target.mouseIsOver && hitTest == false) target.onMouseOut();
    
      }
      */
    updateBounds(target) {
      let o;
      let path;
      let fillStroke;
      let offsetW = 0;
      let offsetH = 0;
      let lineW = 0;
      let i, nb = this.elements.length;
      for (i = 0; i < nb; i++) {
        o = this.elements[i];
        if (o.enabled) {
          if (o.isPath) path = o.value;
          else if (o.isTextPath) o.value;
          else {
            fillStroke = o.value;
            if (fillStroke.offsetW > offsetW) offsetW = fillStroke.offsetW;
            if (fillStroke.offsetH > offsetH) offsetH = fillStroke.offsetH;
            if (fillStroke.lineWidth > lineW) lineW = fillStroke.lineWidth;
          }
        }
      }
      var r = path.geometry.getBounds(target, (offsetW + lineW) * Math.sqrt(2), (offsetH + lineW) * Math.sqrt(2));
      this.offsetW = lineW + offsetW * (Math.sqrt(2) + 1);
      this.offsetH = lineW + offsetH * (Math.sqrt(2) + 1);
      return r;
    }
    updateCache(context, target) {
      let o;
      let path;
      let text;
      let i, nb = this.elements.length;
      for (i = 0; i < nb; i++) {
        o = this.elements[i];
        context.save();
        if (o.enabled) {
          if (o.isPath) path = o.value;
          else if (o.isTextPath) text = o.value;
          else {
            if (o.isTextFillStroke) o.value.apply(context, text, target);
            else o.value.apply(context, path, target);
          }
        }
        context.restore();
      }
    }
  }
  const _Display2D = class _Display2D extends Matrix2D {
    constructor(w, h, renderStack) {
      super();
      __publicField(this, "cache");
      __publicField(this, "_stage", null);
      __publicField(this, "_cacheAsBitmap", false);
      __publicField(this, "renderStack");
      __publicField(this, "width", 1);
      __publicField(this, "height", 1);
      __publicField(this, "alpha", 1);
      __publicField(this, "inverseW", 1);
      //used for filling process;
      __publicField(this, "inverseH", 1);
      //used for filling process;
      __publicField(this, "mouse", null);
      __publicField(this, "mouseIsOver", false);
      __publicField(this, "mouseEnabled", true);
      __publicField(this, "useBasicHitTest", false);
      __publicField(this, "parent", null);
      __publicField(this, "render", null);
      __publicField(this, "currentTransform", null);
      __publicField(this, "_bounds");
      __publicField(this, "_display2dName");
      this._display2dName = "o" + _Display2D.display2dIndex++;
      this.width = w;
      this.height = h;
      if (!renderStack) this.renderStack = new RenderStack();
      else this.renderStack = renderStack;
      this._bounds = new Rectangle2D(0, 0, w, h);
      this.cache = new BitmapCache(this);
    }
    get dataString() {
      var datas = super.dataString;
      datas += "#";
      datas += [this.width, this.height, this.alpha, this.renderStack.REGISTER_ID].join(",");
      return datas;
    }
    static fromDataString(data, target) {
      var t = data.split("#")[2].split(",");
      var o;
      if (!target) o = new _Display2D(Number(t[0]), Number(t[1]), ObjectLibrary.instance.getObjectByRegisterId(t[3]));
      else o = target;
      o.alpha = Number(t[2]);
      Matrix2D.fromDataString(data, o);
      return o;
    }
    /*
    
         bitmap to geometry
    
        //----------------
    
        faire en sorte qu'on puisse pusher une RenderStack dans une RenderStack
    
        gérer les stack de
          - globalCompositeOperation
          - pixel manipulation
    
        fx basé sur une renderstack
           - tint --> source + globalCompositeOperation +(SquarePath + Fill)
    
      */
    get fillStrokeDrawable() {
      return this._cacheAsBitmap == false || this.cache.needsUpdate == true;
    }
    get display2dName() {
      return this._display2dName;
    }
    get useComplexHitTest() {
      return this.useBasicHitTest == false && this.mouseEnabled;
    }
    setStage(stage) {
      this._stage = stage;
      if (stage) this.mouse = stage.mouseControler;
      else this.mouse = null;
    }
    get stage() {
      return this._stage;
    }
    align(displayAlign = Align.CENTER) {
      this.xAxis = this.width * displayAlign.x;
      this.yAxis = this.height * displayAlign.y;
    }
    stack(renderStackElement) {
      return this.renderStack.push(renderStackElement);
    }
    get cacheAsBitmap() {
      return this._cacheAsBitmap;
    }
    set cacheAsBitmap(b) {
      if (b != this._cacheAsBitmap) {
        this._cacheAsBitmap = b;
        if (b) this.cache.needsUpdate = true;
      }
    }
    get bitmapCache() {
      return this.cache;
    }
    get bounds() {
      return this._bounds;
    }
    get globalAlpha() {
      if (!this.parent) return this.alpha;
      return this.parent.globalAlpha * this.alpha;
    }
    get globalX() {
      return this.parent ? this.parent.globalX + this.x : this.x;
    }
    get globalY() {
      return this.parent ? this.parent.globalY + this.y : this.y;
    }
    get globalScaleX() {
      return this.parent ? this.parent.globalScaleX * this.scaleX : this.scaleX;
    }
    get globalScaleY() {
      return this.parent ? this.parent.globalScaleY * this.scaleY : this.scaleY;
    }
    get globalRotation() {
      return this.parent ? this.parent.globalRotation + this.rotation : this.rotation;
    }
    onMouseOver() {
      this.mouseIsOver = true;
      this.dispatchEvent(_Display2D.MOUSE_OVER);
    }
    onMouseOut() {
      this.mouseIsOver = false;
      this.dispatchEvent(_Display2D.MOUSE_OUT);
    }
    resetBoundsOffsets() {
      this.offsetW = this.offsetH = 0;
    }
    update(context) {
      this.identity();
      this.inverseW = 1 / this.width;
      this.inverseH = 1 / this.height;
      context.save();
      if (this.parent) this.multiply(this.parent);
      let m = this.currentTransform = this.applyTransform();
      context.setTransform(m.a, m.b, m.c, m.d, m.e, m.f);
      this.cache.updateCache();
      if (this.mouseEnabled && this.mouse) this.renderStack.updateWithHitTest(context, this, this.mouse.x, this.mouse.y);
      else this.renderStack.update(context, this);
      context.restore();
    }
  };
  __publicField(_Display2D, "display2dIndex", 0);
  __publicField(_Display2D, "MOUSE_OVER", "MOUSE_OVER");
  __publicField(_Display2D, "MOUSE_OUT", "MOUSE_OUT");
  __publicField(_Display2D, "CLICK", "CLICK");
  __publicField(_Display2D, "pathManager", new Path());
  let Display2D = _Display2D;
  class Group2D extends Display2D {
    constructor() {
      super(1, 1);
      /*
        TODO : faire marcher la sauvegarde
               => gerer le chargement en deux temps
                  => d'abord on créé tout les objets, on les appendChild ou les association avec d'autre objets dans un second temps
                     ==> trouver un moyen de créer les objets sans utiliser les références d'objets de manière synchrone
      
             - correction du cacheAsBitmap & bounds de Shape
      
             - triangulation
      
        */
      __publicField(this, "_numChildren", 0);
      __publicField(this, "_children");
      this._children = [];
    }
    get dataString() {
      var data = super.dataString;
      data += "#";
      var i, len = this._children.length;
      for (i = 0; i < len; i++) {
        if (i > 0) data += ",";
        data += this._children[i].REGISTER_ID;
      }
      return data;
    }
    static fromDataString(data, target) {
      var params = data.split("#");
      var t = params[3].split(",");
      var o;
      if (!target) o = new Group2D();
      else o = target;
      Display2D.fromDataString(data, o);
      var i, len = t.length;
      for (i = 0; i < len; i++) o.appendChild(ObjectLibrary.instance.getObjectByRegisterId(t[i]));
      return o;
    }
    setStage(stage) {
      super.setStage(stage);
      let i, nb = this._numChildren;
      for (i = 0; i < nb; i++) this._children[i].setStage(stage);
    }
    appendChild(element) {
      this._children[this._numChildren++] = element;
      element.parent = this;
      element.setStage(this.stage);
      return element;
    }
    removeChild(element) {
      const id = this._children.lastIndexOf(element);
      if (id < 0) return null;
      this._children.splice(id, 1);
      this._numChildren--;
      element.parent = null;
      element.setStage(null);
      return element;
    }
    get numChildren() {
      return this._numChildren;
    }
    get children() {
      return this._children;
    }
    update(context) {
      this.alpha;
      const parent = this.parent;
      const children = this.children;
      this.identity();
      if (parent) this.multiply(parent);
      const m = this.applyTransform();
      context.save();
      let i, nb = this._numChildren;
      for (i = 0; i < nb; i++) children[i].update(context);
      context.restore();
      return m;
    }
  }
  class Stage2D extends Group2D {
    constructor(w, h = 0, appendOnBody = true) {
      super();
      __publicField(this, "_canvas");
      __publicField(this, "_output");
      __publicField(this, "_outputContext");
      __publicField(this, "_context");
      __publicField(this, "_mouseControler");
      this._stage = this;
      if (w instanceof HTMLCanvasElement) {
        appendOnBody = false;
        this._output = w;
        this._outputContext = w.getContext("2d");
        this._canvas = document.createElement("canvas");
        this._canvas.width = w.width;
        this._canvas.height = w.height;
        this._context = this._canvas.getContext("2d");
      } else {
        if (!Browser.canUseOffscreenCanvas) {
          this._canvas = document.createElement("canvas");
          this._output = this._canvas;
          this._output.style.position = "absolute";
          this._outputContext = this._output.getContext("2d");
        } else {
          this._canvas = new window.OffscreenCanvas(w, h);
          this._output = document.createElement("canvas");
          this._output.style.position = "absolute";
          if (Browser.canUseImageBitmap) this._outputContext = this._output.getContext("bitmaprenderer");
          else this._outputContext = this._output.getContext("2d");
        }
        this._canvas.width = this._output.width = w;
        this._canvas.height = this._output.height = h;
        this._context = this._canvas.getContext("2d");
      }
      this._mouseControler = new MouseControler(this._output);
      console.log("new Stage2D ", w, h, appendOnBody);
      if (appendOnBody) document.body.appendChild(this._output);
    }
    get dataString() {
      var o = super.dataString + "###" + this._canvas.width + "," + this._canvas.height;
      return o;
    }
    static fromDataString(data) {
      var t = data.split("###");
      var sizes = t[1].split(",");
      data = t[0];
      var t = data.split("#")[2].split(",");
      var o = new Stage2D(Number(sizes[0]), Number(sizes[1]), true);
      Group2D.fromDataString(data, o);
      return o;
    }
    get canvas() {
      return this._canvas;
    }
    get outputCanvas() {
      return this._output;
    }
    get context() {
      return this._context;
    }
    get mouseControler() {
      return this._mouseControler;
    }
    get globalAlpha() {
      return this.alpha;
    }
    get globalX() {
      return this.x;
    }
    get globalY() {
      return this.y;
    }
    get globalScaleX() {
      return this.scaleX;
    }
    get globalScaleY() {
      return this.scaleY;
    }
    get globalRotation() {
      return this.rotation;
    }
    get stageWidth() {
      return this._canvas.width;
    }
    get stageHeight() {
      return this._canvas.height;
    }
    clearElements() {
      const len = this.numChildren;
      for (let i = len - 1; i >= 0; i--) {
        const child = this.children[i];
        child.clearEvents();
        this.removeChild(child);
      }
    }
    drawElements() {
      this._context.fillStyle = "#000";
      this._context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      super.update(this._context);
      if (Browser.canUseImageBitmap) {
        createImageBitmap(this._canvas).then((bmp) => this._outputContext.transferFromImageBitmap(bmp));
      } else {
        this._outputContext.drawImage(this._canvas, 0, 0);
      }
    }
  }
  class ColorEvents {
  }
  //SOLID COLOR EVENTS
  __publicField(ColorEvents, "CHANGED", "CHANGED");
  __publicField(ColorEvents, "ALPHA_CHANGED", "CHANGED");
  __publicField(ColorEvents, "RED_CHANGED", "CHANGED");
  __publicField(ColorEvents, "GREEN_CHANGED", "CHANGED");
  __publicField(ColorEvents, "BLUE_CHANGED", "CHANGED");
  //GRADIENT COLOR EVENTS
  __publicField(ColorEvents, "GRADIENT_CHANGED", "CHANGED");
  class DirtyEventDispatcher extends RegisterableObject {
    constructor() {
      super();
      __publicField(this, "____eventStack");
      __publicField(this, "dirty", true);
      this.____eventStack = [];
    }
    addDirtyEventTarget(eventTarget) {
      if (this.____eventStack.lastIndexOf(eventTarget) == -1) this.____eventStack.push(eventTarget);
    }
    removeDirtyEventTarget(eventTarget) {
      const id = this.____eventStack.lastIndexOf(eventTarget);
      if (id != -1) this.____eventStack.splice(id, 1);
    }
    applyDirty() {
      let i, len = this.____eventStack.length;
      for (i = 0; i < len; i++) this.____eventStack[i].dirty = true;
    }
  }
  class DisplayObjectEvents {
  }
  __publicField(DisplayObjectEvents, "ADDED", "ADDED");
  __publicField(DisplayObjectEvents, "ADDED_TO_STAGE", "ADDED_TO_STAGE");
  __publicField(DisplayObjectEvents, "REMOVED", "REMOVED");
  __publicField(DisplayObjectEvents, "REMOVED_FROM_STAGE", "REMOVED_FROM_STAGE");
  __publicField(DisplayObjectEvents, "MOVE", "MOVE");
  class RenderEvents {
  }
  __publicField(RenderEvents, "RESIZE", "RESIZE");
  __publicField(RenderEvents, "UPDATE_BEGIN", "UPDATE_BEGIN");
  __publicField(RenderEvents, "UPDATE_END", "UPDATE_END");
  class TextEvents {
  }
  __publicField(TextEvents, "CHANGED", "CHANGED");
  __publicField(TextEvents, "FONT_LOADED", "FONT_LOADED");
  const _HolePathRemover = class _HolePathRemover {
    constructor() {
      __publicField(this, "debug");
      __publicField(this, "outside", null);
      __publicField(this, "grid", null);
      __publicField(this, "cells", null);
      __publicField(this, "gridSize", 0);
      __publicField(this, "quads", null);
      this.debug = new BitmapData(window.innerWidth, window.innerHeight);
      _HolePathRemover._instance = this;
    }
    static get instance() {
      if (!_HolePathRemover._instance) new _HolePathRemover();
      return _HolePathRemover._instance;
    }
    drawQuads() {
    }
    drawPath(pct, color = "#000000") {
      var ctx = this.debug.context;
      this.debug.clear();
      ctx.fillStyle = color;
      var path = this.outside;
      var s = 1;
      ctx.beginPath();
      ctx.moveTo(path[0].x * s, path[0].y * s);
      var i, len = path.length * pct;
      for (i = 1; i < len; i++) ctx.lineTo(path[i].x * s, path[i].y * s);
      ctx.closePath();
      ctx.stroke();
      if (!this.quads) return;
      for (i = 0; i < this.quads.length; i++) {
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.moveTo(this.quads[i].p0.x * s, this.quads[i].p0.y * s);
        ctx.lineTo(this.quads[i].p1.x * s, this.quads[i].p1.y * s);
        ctx.lineTo(this.quads[i].p2.x * s, this.quads[i].p2.y * s);
        ctx.lineTo(this.quads[i].p3.x * s, this.quads[i].p3.y * s);
        ctx.closePath();
        ctx.fill();
      }
    }
    findClosestPoints(outside, hole) {
      var result = { outsidePt: null, holePt: null, dist: 9999999999999 };
      let i, j, nbHole = hole.length, nbOut = outside.length;
      let hx, hy, ox, oy, dx, dy;
      let holePt, outPt;
      for (i = 0; i < nbHole; i++) {
        holePt = hole[i];
        hx = holePt.x;
        hy = holePt.y;
        for (j = 0; j < nbOut; j++) {
          outPt = outside[j];
          ox = outPt.x;
          oy = outPt.y;
          dx = ox - hx;
          dy = oy - hy;
          outPt.dist = dx * dx + dy * dy;
        }
        outside = outside.sort(function(a, b) {
          if (a.dist > b.dist) return 1;
          if (a.dist < b.dist) return -1;
          return 0;
        });
        if (outside[0].dist < result.dist) {
          result.dist = outside[0].dist;
          result.outsidePt = outside[0];
          result.holePt = holePt;
        }
      }
      return result;
    }
    init(outside, precision = 0) {
      this.quads = [];
      var minX = 9999999;
      var minY = 9999999;
      var maxX = -9999999;
      var maxY = -9999999;
      if (precision != 0) outside = BorderVectorizer.instance.init(outside.length * precision >> 0, outside);
      var i, len = outside.length;
      var pt;
      var px, py;
      for (i = 0; i < len - 1; i++) {
        pt = outside[i];
        pt.id = i;
        px = pt.x;
        py = pt.y;
        if (px > maxX) maxX = px;
        if (px < minX) minX = px;
        if (py > maxY) maxY = py;
        if (py < minY) minY = py;
        pt.next = outside[(i + 1) % len];
        if (i > 0) pt.prev = outside[i - 1];
        else outside[i].prev = outside[len - 1];
      }
      var w = maxX - minX;
      var h = maxY - minY;
      var size = this.gridSize = Math.max(w, h) / 8 >> 0;
      this.outside = outside;
      var nbX = Math.ceil(w / size);
      var nbY = Math.ceil(h / size);
      var j, k = 0;
      var grid = this.grid = [];
      var cells = this.cells = [];
      for (i = 0; i < nbX; i++) {
        grid[i] = [];
        for (j = 0; j < nbY; j++) {
          grid[i][j] = cells[k++] = [];
          grid[i][j].x = i;
          grid[i][j].y = j;
          grid[i][j].used = false;
        }
      }
      for (i = 0; i < len - 1; i++) {
        pt = outside[i];
        px = pt.x;
        py = pt.y;
        grid[px / size >> 0][py / size >> 0].push(pt);
      }
    }
    getCellAround(px, py, result) {
      var x = px, y = py;
      var grid = this.grid;
      x = px - 1;
      y = py - 1;
      if (grid[x] && grid[x][y] && !grid[x][y].used) {
        grid[x][y].used = true;
        result.push(grid[x][y]);
      }
      x = px + 0;
      y = py - 1;
      if (grid[x] && grid[x][y] && !grid[x][y].used) {
        grid[x][y].used = true;
        result.push(grid[x][y]);
      }
      x = px + 1;
      y = py - 1;
      if (grid[x] && grid[x][y] && !grid[x][y].used) {
        grid[x][y].used = true;
        result.push(grid[x][y]);
      }
      x = px + 1;
      y = py + 0;
      if (grid[x] && grid[x][y] && !grid[x][y].used) {
        grid[x][y].used = true;
        result.push(grid[x][y]);
      }
      x = px + 1;
      y = py + 1;
      if (grid[x] && grid[x][y] && !grid[x][y].used) {
        grid[x][y].used = true;
        result.push(grid[x][y]);
      }
      x = px + 0;
      y = py + 1;
      if (grid[x] && grid[x][y] && !grid[x][y].used) {
        grid[x][y].used = true;
        result.push(grid[x][y]);
      }
      x = px - 1;
      y = py + 1;
      if (grid[x] && grid[x][y] && !grid[x][y].used) {
        grid[x][y].used = true;
        result.push(grid[x][y]);
      }
      x = px - 1;
      y = py - 0;
      if (grid[x] && grid[x][y] && !grid[x][y].used) {
        grid[x][y].used = true;
        result.push(grid[x][y]);
      }
    }
    findClosestPoints2(hole) {
      var i, len = hole.length;
      var pt, px, py;
      var grid = this.grid;
      var size = this.gridSize;
      var points = [];
      var cells = this.cells;
      var o;
      for (i = 0; i < cells.length; i++) cells[i].used = false;
      var around = [];
      for (i = 0; i < len; i++) {
        pt = hole[i];
        px = pt.x / size >> 0;
        py = pt.y / size >> 0;
        o = grid[px][py];
        o.used = true;
        points = points.concat(o);
        if (points.length == 0) this.getCellAround(px, py, around);
      }
      var a;
      var newAround;
      var k = 0;
      while (points.length == 0 && k++ < 1e3) {
        len = around.length;
        newAround = [];
        for (i = 0; i < len; i++) {
          a = around[i];
          a.used = true;
          points = points.concat(a);
          if (points.length == 0) this.getCellAround(a.x, a.y, newAround);
        }
        around = newAround;
      }
      return this.findClosestPoints(points, hole);
    }
    addHole(hole, precision = 0) {
      if (!this.quads) this.quads = [];
      if (precision != 0) hole = BorderVectorizer.instance.init(hole.length * precision >> 0, hole);
      var i, len = hole.length;
      for (i = 0; i < len; i++) {
        hole[i].id = i;
        hole[i].prev = hole[(i + 1) % len];
        if (i > 0) hole[i].next = hole[i - 1];
        else hole[i].next = hole[len - 1];
      }
      var o = this.findClosestPoints2(hole.concat());
      var outside = this.outside;
      var id = o.outsidePt.id - 1;
      if (id < 0) id += outside.length;
      var outConnectStartPt = outside[id];
      var outConnectEndPt = outside[(o.outsidePt.id + 1) % outside.length];
      var holeConnectStartPt = hole[o.holePt.id];
      var id = o.holePt.id - 1;
      if (id < 0) id += hole.length;
      var holeConnectEndPt = hole[id];
      outConnectStartPt.next = holeConnectEndPt;
      holeConnectStartPt.next = outConnectEndPt;
      this.quads.push({
        p0: outConnectStartPt,
        p1: outConnectEndPt,
        p2: holeConnectStartPt,
        p3: holeConnectEndPt
      });
      var path = [];
      var first = outside[0];
      var k = 0;
      var pt = path[k++] = first;
      pt.id = 0;
      pt = pt.next;
      while (pt && pt != first) {
        pt.id = k;
        path[k++] = pt;
        pt = pt.next;
      }
      this.outside = path;
      return path;
    }
  };
  __publicField(_HolePathRemover, "_instance");
  let HolePathRemover = _HolePathRemover;
  const _RectBounds = class _RectBounds {
    constructor() {
      __publicField(this, "minX", Number.MAX_VALUE);
      __publicField(this, "minY", Number.MAX_VALUE);
      __publicField(this, "maxX", Number.MIN_VALUE);
      __publicField(this, "maxY", Number.MIN_VALUE);
      __publicField(this, "points");
      __publicField(this, "nbPoint");
      this.points = [];
      this.nbPoint = 0;
      this.reset();
    }
    reset() {
      this.minX = Number.MAX_VALUE;
      this.minY = Number.MAX_VALUE;
      this.maxX = Number.MIN_VALUE;
      this.maxY = Number.MIN_VALUE;
    }
    addPoint(px, py, registerPoint = true) {
      if (px <= this.minX) this.minX = px;
      if (px >= this.maxX) this.maxX = px;
      if (py <= this.minY) this.minY = py;
      if (py >= this.maxY) this.maxY = py;
      if (registerPoint) this.points[this.nbPoint++] = new Pt2D(px, py);
    }
    addRect(minX, minY, maxX, maxY) {
      if (minX <= this.minX) this.minX = minX;
      if (maxX >= this.maxX) this.maxX = maxX;
      if (minY <= this.minY) this.minY = minY;
      if (maxY >= this.maxY) this.maxY = maxY;
    }
    drawBounds(context2D) {
      context2D.save();
      context2D.beginPath();
      context2D.strokeStyle = "#000000";
      context2D.setTransform(1, 0, 0, 1, 0, 0);
      context2D.rect(this.x, this.y, this.width, this.height);
      context2D.stroke();
      context2D.restore();
    }
    get x() {
      return this.minX;
    }
    get y() {
      return this.minY;
    }
    get width() {
      return this.maxX - this.minX;
    }
    get height() {
      return this.maxY - this.minY;
    }
    static getBounds(xAxis, yAxis, w, h, rotation) {
      if (!_RectBounds.rect) _RectBounds.rect = new _RectBounds();
      let r = _RectBounds.rect;
      r.reset();
      let x0 = -xAxis;
      let y0 = -yAxis;
      let a0 = Math.atan2(y0, x0) + rotation;
      let d0 = Math.sqrt(x0 * x0 + y0 * y0);
      let x1 = -xAxis + w;
      let y1 = -yAxis;
      let a1 = Math.atan2(y1, x1) + rotation;
      let d1 = Math.sqrt(x1 * x1 + y1 * y1);
      let x2 = -xAxis + w;
      let y2 = -yAxis + h;
      let a2 = Math.atan2(y2, x2) + rotation;
      let d2 = Math.sqrt(x2 * x2 + y2 * y2);
      let x3 = -xAxis;
      let y3 = -yAxis + h;
      let a3 = Math.atan2(y3, x3) + rotation;
      let d3 = Math.sqrt(x3 * x3 + y3 * y3);
      r.addPoint(xAxis + Math.cos(a0) * d0, yAxis + Math.sin(a0) * d0);
      r.addPoint(xAxis + Math.cos(a1) * d1, yAxis + Math.sin(a1) * d1);
      r.addPoint(xAxis + Math.cos(a2) * d2, yAxis + Math.sin(a2) * d2);
      r.addPoint(xAxis + Math.cos(a3) * d3, yAxis + Math.sin(a3) * d3);
      return r;
    }
  };
  __publicField(_RectBounds, "rect");
  let RectBounds = _RectBounds;
  class BitmapPath extends Path {
    constructor(bd, percentOfTheOriginal = 0.055, curveSmooth = 1) {
      super();
      __publicField(this, "_outsideBitmap", null);
      __publicField(this, "_holeBitmap", null);
      __publicField(this, "_outsideVector", null);
      __publicField(this, "_holeVector", null);
      __publicField(this, "_outsideCurves", null);
      __publicField(this, "_holeCurves", null);
      __publicField(this, "bd");
      __publicField(this, "precision");
      __publicField(this, "curveSmooth");
      this.bd = bd;
      this.precision = percentOfTheOriginal;
      this.curveSmooth = curveSmooth;
      this.updateBitmapBorders();
      this.generatePath();
    }
    updateBitmapBorders() {
      this.bd.saveData();
      this.bd.setPadding(1, 1, 1, 1);
      this._outsideBitmap = BorderFinder.instance.getBorderFromBitmapData(this.bd);
      this._holeBitmap = BorderFinder.instance.getHoleBorders(this.bd);
      for (var i = 0; i < this._holeBitmap.length; i++) this._holeBitmap[i] = this._holeBitmap[i].reverse();
      this.bd.restoreData();
      this.vectorize(this.precision);
      if (this.curveSmooth != 0) this.convertLinesToCurves(this.curveSmooth);
    }
    vectorize(percentOfTheOriginal = 0.055) {
      if (!this._outsideBitmap || !this._holeBitmap) return;
      if (percentOfTheOriginal > 1) percentOfTheOriginal = 1;
      if (percentOfTheOriginal < 1e-4) percentOfTheOriginal = 1e-4;
      var precisionHole = percentOfTheOriginal * 2;
      this._outsideVector = BorderVectorizer.instance.init(this._outsideBitmap.length * percentOfTheOriginal >> 0, this._outsideBitmap);
      this._holeVector = [];
      var i, len = this._holeBitmap.length;
      for (i = 0; i < len; i++) {
        this._holeVector[i] = BorderVectorizer.instance.init(this._holeBitmap[i].length * precisionHole >> 0, this._holeBitmap[i]);
      }
    }
    convertLinesToCurves(smoothLevel = 1) {
      if (!this._holeVector) return;
      if (smoothLevel < 0.1) smoothLevel = 0.1;
      if (!this.outsideVector) this.vectorize(0.065);
      this._outsideCurves = FitCurve.borderToCurve(this.outsideVector, smoothLevel);
      this._holeCurves = [];
      var i, len = this._holeVector.length;
      for (i = 0; i < len; i++) {
        this._holeCurves[i] = FitCurve.borderToCurve(this._holeVector[i], smoothLevel);
      }
    }
    /*
      public triangulateGeometry(shape:Shape2D,updateIfExist:boolean=false):void{
        //console.log("triangulate bitmap")
        var precision:number = this.precision;
        if(!this.trianglePoints || updateIfExist){
          var o:{trianglePoints:number[],
                 triangleIndexs:number[],
                 minX:number,
                 minY:number,
                 maxX:number,
                 maxY:number} = BitmapGeometryTriangulator.instance.triangulateGeometry(this,precision);
          this.basicHitPoints = [];
          this.trianglePoints = [new Float32Array(o.trianglePoints)];
          this.transTrianglePoints = [new Float32Array(o.trianglePoints)];
          this.triangleIndexs = [new Int32Array(o.triangleIndexs)];
          var hp = [o.minX,o.minY,
                    o.maxX,o.minY,
                    o.minX,o.maxY,
                    o.maxX,o.maxY]
    
          this.basicHitPoints[0] = new Float32Array(hp);
        }
      }
      */
    generatePath() {
      let i, len;
      if (this.outsideCurves) {
        this.drawCurves(this.outsideCurves);
        if (this.holeCurves && this.holeCurves.length) {
          len = this.holeCurves.length;
          for (i = 0; i < len; i++) this.drawCurves(this.holeCurves[i]);
        }
      } else if (this.outsideVector) {
        this.drawLines(this.outsideVector);
        if (this.holeVector && this.holeVector.length) {
          len = this.holeVector.length;
          for (i = 0; i < len; i++) this.drawLines(this.holeVector[i]);
        }
      } else {
        this.drawLines(this.outsideBitmap);
        if (this.holeBitmap && this.holeBitmap.length) {
          len = this.holeBitmap.length;
          for (i = 0; i < len; i++) this.drawLines(this.holeBitmap[i]);
        }
      }
      this.computePath();
    }
    drawLines(path) {
      if (!path) return;
      this.moveTo(path[0].x, path[0].y);
      let i, len = path.length;
      for (i = 1; i < len; i++) this.lineTo(path[i].x, path[i].y);
    }
    drawCurves(path) {
      if (!path) return;
      let i, len = path.length;
      let bezier;
      for (i = 0; i < len; i++) {
        bezier = path[i];
        if (i == 0) this.moveTo(bezier[0][0], bezier[0][1]);
        this.bezierCurveTo(
          bezier[1][0],
          bezier[1][1],
          bezier[2][0],
          bezier[2][1],
          bezier[3][0],
          bezier[3][1]
        );
      }
    }
    get outsideBitmap() {
      return this._outsideBitmap;
    }
    get holeBitmap() {
      return this._holeBitmap;
    }
    get outsideVector() {
      return this._outsideVector;
    }
    get holeVector() {
      return this._holeVector;
    }
    get outsideCurves() {
      return this._outsideCurves;
    }
    get holeCurves() {
      return this._holeCurves;
    }
  }
  const _CirclePath = class _CirclePath extends Path {
    constructor() {
      super();
      if (!_CirclePath._instance) _CirclePath._instance = this;
      else throw new Error("CirclePath is a singleton. You must use CirclePath.instance.");
      this.circle(0.5, 0.5, 0.5);
      this.computePath();
    }
    static get instance() {
      if (!_CirclePath._instance) new _CirclePath();
      return _CirclePath._instance;
    }
    static get path() {
      return _CirclePath.instance.path;
    }
  };
  __publicField(_CirclePath, "_instance");
  let CirclePath = _CirclePath;
  const _SquarePath = class _SquarePath extends Path {
    constructor() {
      super();
      if (!_SquarePath._instance) _SquarePath._instance = this;
      else throw new Error("SquarePath is a singleton. You must use SquarePath.instance.");
      this.rect(0, 0, 1, 1);
      this.computePath();
    }
    static get instance() {
      if (!_SquarePath._instance) new _SquarePath();
      return _SquarePath._instance;
    }
    static get path() {
      return _SquarePath.instance.path;
    }
  };
  __publicField(_SquarePath, "_instance");
  let SquarePath = _SquarePath;
  class Img extends BitmapData {
    constructor(url = "") {
      super();
      __publicField(this, "_img");
      //private _w: number;
      //private _h: number;
      __publicField(this, "_url", "");
      __publicField(this, "onLoaded");
      var th = this;
      var img = this._img = document.createElement("img");
      img.onload = function() {
        th.width = img.width;
        th.height = img.height;
        th.drawImage(img, 0, 0);
        if (th.onLoaded) th.onLoaded(img);
        th.dispatchEvent(Img.IMAGE_LOADED);
      };
      this.url = url;
    }
    get dataString() {
      return this.url;
    }
    static fromDataString(url) {
      return new Img(url);
    }
    get htmlImage() {
      return this._img;
    }
    get url() {
      return this._url;
    }
    set url(s) {
      if (s != this._url) {
        this._url = this._img.src = s;
      }
    }
  }
  class CssFilter {
    constructor(cssFilterValue = null) {
      __publicField(this, "filter", "");
      __publicField(this, "offsetX");
      __publicField(this, "offsetY");
      this.clear();
      if (cssFilterValue) this.filter = cssFilterValue;
    }
    clear() {
      this.filter = "";
      this.offsetX = this.offsetY = 0;
    }
    dropShadow(offsetX, offsetY, radius, color) {
      this.filter += "drop-shadow(" + offsetX + "px " + offsetY + "px " + radius + "px " + color + ") ";
      var ox = Math.abs(offsetX) + radius * 4;
      var oy = Math.abs(offsetY) + radius * 4;
      if (this.offsetX < ox) this.offsetX = ox;
      if (this.offsetY < oy) this.offsetY = oy;
      return this;
    }
    blur(intensity) {
      this.filter += "blur(" + intensity + "px) ";
      intensity *= Math.sqrt(2);
      if (this.offsetX < intensity) this.offsetX = intensity;
      if (this.offsetY < intensity) this.offsetY = intensity;
      return this;
    }
    halo(intensity, color = "#ffffff") {
      this.dropShadow(0, 0, intensity, color);
      return this;
    }
    brightness(intensity = 0.5) {
      this.filter += "brightness(" + intensity + ") ";
      return this;
    }
    contrast(intensity = 1.5) {
      intensity *= 100;
      this.filter += "contrast(" + intensity + "%) ";
      return this;
    }
    grayscale(intensity = 0.5) {
      intensity *= 100;
      this.filter += "grayscale(" + intensity + "%) ";
      return this;
    }
    hueRotate(angleInDegree = 90) {
      this.filter += "hue-rotate(" + angleInDegree + "deg) ";
      return this;
    }
    invert(intensity = 0.5) {
      intensity *= 100;
      this.filter += "invert(" + intensity + "%) ";
      return this;
    }
    opacity(intensity = 0.5) {
      intensity *= 100;
      this.filter += "opacity(" + intensity + "%) ";
      return this;
    }
    saturate(intensity = 0.5) {
      intensity *= 100;
      this.filter += "saturate(" + intensity + "%) ";
      return this;
    }
    sepia(intensity = 0.5) {
      intensity *= 100;
      this.filter += "sepia(" + intensity + "%) ";
      return this;
    }
  }
  class TextStyle extends RegisterableObject {
    constructor(fontName, fontSize, sizeMeasure = "px", offsetX = 0, offsetY = 0, allowScaleTransform = false, lineStyle = null) {
      super();
      __publicField(this, "fontName");
      __publicField(this, "fontSize");
      __publicField(this, "sizeMeasure", "px");
      __publicField(this, "offsetX", 0);
      __publicField(this, "offsetY", 0);
      __publicField(this, "lineStyle", null);
      __publicField(this, "allowScaleTransform", false);
      this.fontName = fontName;
      this.fontSize = fontSize;
      this.sizeMeasure = sizeMeasure;
      this.offsetX = offsetX + fontSize * 0.2;
      this.offsetY = offsetY + fontSize * 0.85;
      this.allowScaleTransform = allowScaleTransform;
      this.lineStyle = lineStyle;
    }
    get dataString() {
      return [this.fontName, this.fontSize, this.sizeMeasure, this.offsetX, this.offsetY, Number(this.allowScaleTransform), this.lineStyle ? this.lineStyle.REGISTER_ID : "null"].join(",");
    }
    static fromDataString(data) {
      let t = data.split(",");
      let o = new TextStyle(t[0], Number(t[1]), t[2], Number(t[3]), Number(t[4]), t[5] == "1", ObjectLibrary.instance.getObjectByRegisterId(t[6]));
      return o;
    }
    clone(cloneTextLineStyle = true) {
      let t = null;
      if (this.lineStyle) {
        if (cloneTextLineStyle) t = this.lineStyle.clone();
        else t = this.lineStyle;
      }
      let s = new TextStyle(this.fontName, this.fontSize, this.sizeMeasure, this.offsetX, this.offsetY);
      s.lineStyle = t;
      return s;
    }
    apply(context, path, target) {
      var s = Math.max(target.width, target.height);
      if (this.lineStyle) this.lineStyle.apply(context, path, target);
      context.font = this.fontSize / s + this.sizeMeasure + " " + this.fontName;
      if (this.allowScaleTransform == false) context.scale(1 / target.scaleX, 1 / target.scaleY);
    }
  }
  class Filter extends DirtyEventDispatcher {
    constructor() {
      super();
      __publicField(this, "boundOffsetW", 0);
      __publicField(this, "boundOffsetH", 0);
      __publicField(this, "next", null);
      __publicField(this, "_updateColor");
      __publicField(this, "_color");
      __publicField(this, "_offsetX", 0);
      __publicField(this, "_offsetY", 0);
      __publicField(this, "_radius", 0);
      __publicField(this, "_intensity", 0);
      __publicField(this, "_angle", 0);
      var th = this;
      this._updateColor = function() {
        th.dirty = true;
        th.applyDirty();
      };
    }
    get value() {
      return null;
    }
    get angle() {
      return this._angle;
    }
    set angle(n) {
      if (n != this._angle) {
        this._angle = n;
      }
    }
    get color() {
      return this._color;
    }
    set color(c) {
      if (c != this._color) {
        if (this._color) this._color.removeEventListener(SolidColor.UPDATE_STYLE, this._updateColor);
        this._color = c;
        this._color.addEventListener(SolidColor.UPDATE_STYLE, this._updateColor);
        this.applyDirty();
      }
    }
    get intensity() {
      return this._intensity;
    }
    set intensity(n) {
      if (n != this._intensity) {
        this._intensity = n;
        this.applyDirty();
      }
    }
    get offsetX() {
      return this._offsetX;
    }
    set offsetX(n) {
      if (n != this._offsetX) {
        this._offsetX = n;
        this.boundOffsetW = Math.abs(n) + this.radius;
        this.applyDirty();
      }
    }
    get offsetY() {
      return this._offsetX;
    }
    set offsetY(n) {
      if (n != this._offsetY) {
        this._offsetY = n;
        this.boundOffsetH = Math.abs(n) + this.radius;
        this.applyDirty();
      }
    }
    get radius() {
      return this._radius;
    }
    set radius(n) {
      if (n != this._radius) {
        this._radius = n;
        this.boundOffsetW = Math.abs(this._offsetX) + n;
        this.boundOffsetH = Math.abs(this._offsetY) + n;
        this.applyDirty();
      }
    }
    clear() {
      for (var z in this) this[z] = null;
    }
  }
  class BlurFilter extends Filter {
    constructor(intensity = 0) {
      super();
      this.radius = intensity;
    }
    get dataString() {
      return "" + this.radius;
    }
    static fromDataString(data) {
      return new BlurFilter(Number(data));
    }
    clone() {
      return new BlurFilter(this.radius);
    }
    get value() {
      return "blur(" + this.radius + "+px)";
    }
  }
  class BrightnessFilter extends Filter {
    constructor(intensity = 0) {
      super();
      this._intensity = intensity;
    }
    get dataString() {
      return "" + this._intensity;
    }
    static fromDataString(data) {
      return new BrightnessFilter(Number(data));
    }
    clone() {
      return new BrightnessFilter(this._intensity);
    }
    get value() {
      return "brightness(" + this._intensity + "+%)";
    }
  }
  class ContrastFilter extends Filter {
    constructor(intensity = 0) {
      super();
      this._intensity = intensity;
    }
    get dataString() {
      return "" + this._intensity;
    }
    static fromDataString(data) {
      return new ContrastFilter(Number(data));
    }
    clone() {
      return new ContrastFilter(this._intensity);
    }
    get value() {
      return "contrast(" + this._intensity + "+%)";
    }
  }
  class DropShadowFilter extends Filter {
    constructor(offsetX, offsetY, radius, color) {
      super();
      this.offsetX = offsetX;
      this.offsetY = offsetY;
      this.radius = radius;
      if (color instanceof SolidColor) this.color = color;
      else this.color = new SolidColor(color);
    }
    get dataString() {
      return [this.offsetX, this.offsetY, this.radius, this.color.REGISTER_ID].join(",");
    }
    static fromDataString(data) {
      var t = data.split(",");
      return new DropShadowFilter(Number(t[0]), Number(t[1]), Number(t[2]), ObjectLibrary.instance.getObjectByRegisterId(t[3]));
    }
    clone(cloneColor = false) {
      if (!cloneColor) return new DropShadowFilter(this._offsetX, this._offsetY, this._radius, this._color);
      return new DropShadowFilter(this._offsetX, this._offsetY, this._radius, this._color.clone());
    }
    get value() {
      return "drop-shadow(" + this._offsetX + "px " + this._offsetY + "px " + this._radius + "px " + this._color.style + ") ";
    }
  }
  class FilterStack extends RegisterableObject {
    //public cacheAsBitmap:boolean = false;
    constructor() {
      super();
      __publicField(this, "first");
      __publicField(this, "last");
      __publicField(this, "_value");
      __publicField(this, "dirty", true);
      __publicField(this, "boundOffsetW", 0);
      __publicField(this, "boundOffsetH", 0);
    }
    clear() {
      let f = this.first;
      while (f) {
        f.clear();
        f = f.next;
      }
    }
    clone(cloneFilters = false) {
      let f = this.first;
      const s = new FilterStack();
      while (f) {
        if (cloneFilters) s.add(f.clone());
        else s.add(f);
      }
      return s;
    }
    get value() {
      if (this.dirty) {
        let v = "";
        let f = this.first;
        let w = 0, h = 0;
        while (f) {
          v = v + f.value + " ";
          if (f.boundOffsetW > w) w = f.boundOffsetW;
          if (f.boundOffsetH > h) h = f.boundOffsetH;
          f = f.next;
        }
        this.boundOffsetW = w;
        this.boundOffsetH = h;
        this._value = v;
        this.dirty = false;
      }
      return this._value;
    }
    get dataString() {
      var s = "";
      var o = this.first;
      var b = false;
      while (o) {
        if (b) s += ",";
        s += o.REGISTER_ID;
        b = true;
        o = o.next;
      }
      return s;
    }
    static fromDataString(data) {
      var t = data.split(",");
      var s = new FilterStack();
      var i, len = t.length;
      for (i = 0; i < len; i++) s.add(ObjectLibrary.instance.getObjectByRegisterId(t[i]));
      return s;
    }
    add(filter) {
      if (!this.first) this.first = filter;
      if (this.last) this.last.next = filter;
      this.last = filter;
      filter.addDirtyEventTarget(this);
      return this;
    }
  }
  class GlowFilter extends DropShadowFilter {
    constructor(radius, color) {
      super(0, 0, radius, color);
    }
    get dataString() {
      return this.radius + "," + this.color.REGISTER_ID;
    }
    static fromDataString(data) {
      var t = data.split(",");
      return new GlowFilter(Number(t[0]), ObjectLibrary.instance.getObjectByRegisterId(t[1]));
    }
    clone(cloneColor = false) {
      if (cloneColor) return new GlowFilter(this._radius, this._color.clone());
      return new GlowFilter(this._radius, this._color);
    }
  }
  class GrayscaleFilter extends Filter {
    constructor(intensity = 0) {
      super();
      this._intensity = intensity;
    }
    get dataString() {
      return "" + this._intensity;
    }
    static fromDataString(data) {
      return new GrayscaleFilter(Number(data));
    }
    clone() {
      return new GrayscaleFilter(this._intensity);
    }
    get value() {
      return "grayscale(" + this._intensity + "+%)";
    }
  }
  class HueRotateFilter extends Filter {
    constructor(angle = 0) {
      super();
      this._angle = angle;
    }
    get dataString() {
      return "" + this._angle;
    }
    static fromDataString(data) {
      return new HueRotateFilter(Number(data));
    }
    get value() {
      return "hue-rotate(" + this._angle + "+%)";
    }
    clone() {
      return new HueRotateFilter(this._angle);
    }
  }
  class InvertFilter extends Filter {
    constructor(intensity = 0) {
      super();
      this._intensity = intensity;
    }
    get dataString() {
      return "" + this._intensity;
    }
    static fromDataString(data) {
      return new InvertFilter(Number(data));
    }
    get value() {
      return "invert(" + this._intensity + "+%)";
    }
    clone() {
      return new InvertFilter(this._intensity);
    }
  }
  class OpacityFilter extends Filter {
    constructor(intensity = 3) {
      super();
      this._intensity = intensity;
    }
    get dataString() {
      return "" + this._intensity;
    }
    static fromDataString(data) {
      return new OpacityFilter(Number(data));
    }
    get value() {
      return "opacity(" + this._intensity + "+%)";
    }
    clone() {
      return new OpacityFilter(this._intensity);
    }
  }
  class SaturateFilter extends Filter {
    constructor(intensity = 3) {
      super();
      this._intensity = intensity;
    }
    get dataString() {
      return "" + this._intensity;
    }
    static fromDataString(data) {
      return new SaturateFilter(Number(data));
    }
    get value() {
      return "saturate(" + this._intensity + "+%)";
    }
    clone() {
      return new SaturateFilter(this._intensity);
    }
  }
  class SepiaFilter extends Filter {
    constructor(intensity = 3) {
      super();
      this._intensity = intensity;
    }
    get dataString() {
      return "" + this._intensity;
    }
    static fromDataString(data) {
      return new SepiaFilter(Number(data));
    }
    get value() {
      return "sepia(" + this._intensity + "+%)";
    }
    clone() {
      return new SepiaFilter(this._intensity);
    }
  }
  class SVGFilter extends Filter {
    constructor(url) {
      super();
      __publicField(this, "_url");
      this._url = url;
    }
    get dataString() {
      return "" + this._url;
    }
    static fromDataString(data) {
      return new SVGFilter(data);
    }
    get url() {
      return this._url;
    }
    set url(n) {
      if (n != this._url) {
        this._url = n;
        this.applyDirty();
      }
    }
    get value() {
      return "url(" + this._url + "+)";
    }
    clone() {
      return new SVGFilter(this._url);
    }
  }
  exports2.Align = Align;
  exports2.BitmapCache = BitmapCache;
  exports2.BitmapCacheFill = BitmapCacheFill;
  exports2.BitmapData = BitmapData;
  exports2.BitmapFill = BitmapFill;
  exports2.BitmapPath = BitmapPath;
  exports2.BitmapPixel = BitmapPixel;
  exports2.BlurFilter = BlurFilter;
  exports2.BorderFinder = BorderFinder;
  exports2.BorderLine = BorderLine;
  exports2.BorderLinePt = BorderLinePt;
  exports2.BorderPt = BorderPt;
  exports2.BorderVectorizer = BorderVectorizer;
  exports2.BrightnessFilter = BrightnessFilter;
  exports2.Browser = Browser;
  exports2.CirclePath = CirclePath;
  exports2.ColorEvents = ColorEvents;
  exports2.ContrastFilter = ContrastFilter;
  exports2.CssFilter = CssFilter;
  exports2.DirtyEventDispatcher = DirtyEventDispatcher;
  exports2.Display2D = Display2D;
  exports2.DisplayObjectEvents = DisplayObjectEvents;
  exports2.DropShadowFilter = DropShadowFilter;
  exports2.EarCutting = EarCutting;
  exports2.EventDispatcher = EventDispatcher;
  exports2.FillStroke = FillStroke;
  exports2.Filter = Filter;
  exports2.FilterStack = FilterStack;
  exports2.FitCurve = FitCurve;
  exports2.Geometry = Geometry;
  exports2.GlobalCompositeOperations = GlobalCompositeOperations;
  exports2.GlowFilter = GlowFilter;
  exports2.Gradient = Gradient;
  exports2.GradientColor = GradientColor;
  exports2.GradientFill = GradientFill;
  exports2.GradientStroke = GradientStroke;
  exports2.GradientTextFill = GradientTextFill;
  exports2.GradientTextStroke = GradientTextStroke;
  exports2.GrayscaleFilter = GrayscaleFilter;
  exports2.Group2D = Group2D;
  exports2.HolePathRemover = HolePathRemover;
  exports2.HueRotateFilter = HueRotateFilter;
  exports2.Img = Img;
  exports2.InvertFilter = InvertFilter;
  exports2.Keyboard = Keyboard;
  exports2.KeyboardControler = KeyboardControler;
  exports2.KeyboardEvents = KeyboardEvents;
  exports2.LineStyle = LineStyle;
  exports2.Matrix2D = Matrix2D;
  exports2.MouseControler = MouseControler;
  exports2.MouseEvents = MouseEvents;
  exports2.ObjectLibrary = ObjectLibrary;
  exports2.OpacityFilter = OpacityFilter;
  exports2.Path = Path;
  exports2.Pattern = Pattern;
  exports2.PatternFill = PatternFill;
  exports2.PatternStroke = PatternStroke;
  exports2.PatternTextFill = PatternTextFill;
  exports2.PatternTextStroke = PatternTextStroke;
  exports2.Pt2D = Pt2D;
  exports2.RectBounds = RectBounds;
  exports2.Rectangle2D = Rectangle2D;
  exports2.RegisterableObject = RegisterableObject;
  exports2.RenderEvents = RenderEvents;
  exports2.RenderStack = RenderStack;
  exports2.RenderStackElement = RenderStackElement;
  exports2.SVGFilter = SVGFilter;
  exports2.SaturateFilter = SaturateFilter;
  exports2.SepiaFilter = SepiaFilter;
  exports2.ShadowFilter = ShadowFilter;
  exports2.Shape = Shape;
  exports2.Solid = Solid;
  exports2.SolidColor = SolidColor;
  exports2.SolidFill = SolidFill;
  exports2.SolidStroke = SolidStroke;
  exports2.SolidTextFill = SolidTextFill;
  exports2.SolidTextStroke = SolidTextStroke;
  exports2.SquarePath = SquarePath;
  exports2.Stage2D = Stage2D;
  exports2.TextEvents = TextEvents;
  exports2.TextPath = TextPath;
  exports2.TextStyle = TextStyle;
  exports2.TouchControler = TouchControler;
  exports2.TouchEvents = TouchEvents;
  exports2.TouchSwipe = TouchSwipe;
  exports2.Touche = Touche;
  exports2.Video = Video;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
