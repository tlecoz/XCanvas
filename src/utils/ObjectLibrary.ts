

export class ObjectLibrary {

  public static classes: { [key: string]: any }

  private static _instance: ObjectLibrary;
  private static creatingObjectsAfterLoad: boolean = false;

  private objects: any;
  private names: string[];
  private indexByName: { [key: string]: number };

  private objectById: any[];
  private nbObject: number = 0;

  private loadObjectsByID: { [key: string]: any };

  constructor() {
    if (!ObjectLibrary._instance) {
      ObjectLibrary._instance = this;
      this.objects = {};
      this.names = [];
      this.indexByName = {};
      this.objectById = [];
      this.loadObjectsByID = {};
    } else {
      throw new Error("ObjectLibrary is a singleton. You must use ObjectLibrary.instance")
    }
  }

  public registerObject(dataType: string, o: any): string {

    if (ObjectLibrary.creatingObjectsAfterLoad) {
      //console.log("ObjectLibrary.creatingObjectsAfterLoad ",o);
      return "";
    }
    let id: number, typeId: number;
    if (!this.objects[dataType]) {
      this.indexByName[dataType] = typeId = this.names.length;
      this.names.push(dataType);
      this.objects[dataType] = {
        typeId: typeId,
        elements: [o]
      }
      id = 0;
    } else {
      var obj = this.objects[dataType];
      typeId = obj.typeId;
      id = obj.elements.length;
      obj.elements[id] = o;
    }

    var ID: string = typeId + "_" + id;

    this.objectById[this.nbObject++] = {
      type: typeId,
      ID: ID,
      value: o
    }

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

  public save(fileName: string = "test.txt") {
    let data: string = this.names.join(",") + "[####]";
    const len: number = this.nbObject;
    let o: any, dataString: string;

    for (let i = 0; i < len; i++) {
      o = this.objectById[i];
      dataString = o.value.dataString;
      if (dataString !== "") {
        if (i !== 0) data += "[#]";
        data += o.ID + "[|]" + dataString;
      }
    }

    // Crée un Blob avec les données
    const blob = new Blob([data], { type: 'text/plain' });

    // Crée un lien de téléchargement
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }



  //@ts-ignore
  public load(url: string, onLoaded?: (res: string) => void): void {
    var th = this;
    this.loadObjectsByID = [];
    ObjectLibrary.creatingObjectsAfterLoad = true;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "test.txt");
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        //console.log(xhr.responseText);
        //console.log("########### LOADED #####################")
        var datas = xhr.responseText;
        var t = datas.split("[####]");
        th.names = t[0].split(",");

        var i: number, len: number = th.names.length;
        for (i = 0; i < len; i++) th.objects[th.names[i]] = { type: i, elements: [] };

        var objects = t[1].split("[#]");
        var dataString, infos;
        var className;
        var ID, instanceId, classId;
        len = objects.length;

        var temp = []
        for (i = 0; i < len; i++) {
          t = objects[i].split("[|]");
          ID = t[0];
          infos = ID.split("_");
          classId = Number(infos[0]);
          className = th.names[classId];
          instanceId = Number(infos[1]);
          dataString = t[1];

          th.loadObjectsByID[ID] = temp[i] = { className: className, instanceId: instanceId, dataString: dataString };


          //if(!th.objects[className]) th.objects[className] = {type:classId,elements:[]};
          //th.objects[className].elements[instanceId] = eval(className).fromDataString(dataString)


          //console.log(className+" : "+dataString);
          //console.log("className => " + ID + " ==> ", th.loadObjectsByID[ID]);
        }

        var o;
        for (i = 0; i < len; i++) {
          o = temp[i];
          //console.log(i, o.className, o.instanceId, o.dataString)
          th.objects[o.className].elements[o.instanceId] = ObjectLibrary.classes[o.className].fromDataString(o.dataString);
          //th.objects[o.className].elements[o.instanceId] = eval(o.className).fromDataString(o.dataString);
        }


        ObjectLibrary.creatingObjectsAfterLoad = false;
        //console.log("#########################")
        if (onLoaded) onLoaded(xhr.responseText);
      }
    }
    xhr.send(null);
  }








  public static get instance(): ObjectLibrary {
    if (!ObjectLibrary._instance) new ObjectLibrary();
    return ObjectLibrary._instance;
  }

  public get dataTypes(): string[] { return this.names }
  public getElementsByName(name: string): any[] {
    //console.log("getElementsByName ",name)
    return this.objects[name].elements;
  }

  public getObjectByRegisterId(registerId: string): any {
    let t: string[] = registerId.split("_");
    let o: any = this.objects[this.names[Number(t[0])]].elements[Number(t[1])];
    if (o) return o;


    if (this.loadObjectsByID) {
      let obj = this.loadObjectsByID[registerId];
      if (obj) {
        //console.log("this.objects["+obj.className+"].elements["+obj.instanceId+"] = "+obj.dataString)
        this.objects[obj.className].elements[obj.instanceId] = o = ObjectLibrary.classes[obj.className].fromDataString(obj.dataString);
        //this.objects[obj.className].elements[obj.instanceId] = o = eval(obj.className).fromDataString(obj.dataString);
        return o;
      }
    }

    return null;

  }

  public static print(): void {
    var lib = ObjectLibrary.instance;
    var names: string[] = lib.dataTypes;
    var i: number, len: number = names.length;
    //@ts-ignore
    var name: string;
    for (i = 0; i < len; i++) {
      name = names[i];
      //console.log("nb " + name + " = " + lib.getElementsByName(name).length);
    }
  }
  public static printElements(name: string) {
    var t = ObjectLibrary.instance.getElementsByName(name);
    var i: number, len: number = t.length;
    for (i = 0; i < len; i++) console.log(i, " => ", t[i]);
  }

}
