class ObjectLibrary {
    constructor() {
        this.nbObject = 0;
        if (!ObjectLibrary._instance) {
            ObjectLibrary._instance = this;
            this.objects = {};
            this.names = [];
            this.indexByName = [];
            this.objectById = [];
        }
        else {
            throw new Error("ObjectLibrary is a singleton. You must use ObjectLibrary.instance");
        }
    }
    registerObject(dataType, o) {
        if (ObjectLibrary.creatingObjectsAfterLoad) {
            //console.log("ObjectLibrary.creatingObjectsAfterLoad ",o);
            return "";
        }
        let id, typeId;
        if (!this.objects[dataType]) {
            this.indexByName[dataType] = typeId = this.names.length;
            this.names.push(dataType);
            this.objects[dataType] = {
                typeId: typeId,
                elements: [o]
            };
            id = 0;
        }
        else {
            var obj = this.objects[dataType];
            typeId = obj.typeId;
            id = obj.elements.length;
            obj.elements[id] = o;
        }
        var ID = typeId + "_" + id;
        this.objectById[this.nbObject++] = {
            type: typeId,
            ID: ID,
            value: o
        };
        return ID;
    }
    save(fileName = "test.txt") {
        var data = this.names.join(",") + "[####]";
        var i, len = this.nbObject;
        var o, dataString;
        for (i = 0; i < len; i++) {
            o = this.objectById[i];
            dataString = o.value.dataString;
            if (dataString != "") {
                //console.log(i,o.value);
                if (i != 0)
                    data += "[#]";
                data += o.ID + "[|]" + dataString;
            }
            else {
                //console.log("error : ",o.value)
            }
        }
        var xhr = new XMLHttpRequest();
        var params = "fileName=" + fileName + "&data=" + data;
        xhr.open("POST", "saveFile.php");
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                //console.log(xhr.responseText);
            }
        };
        xhr.send(params);
    }
    load(url, onLoaded = null) {
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
                var i, len = th.names.length;
                for (i = 0; i < len; i++)
                    th.objects[th.names[i]] = { type: i, elements: [] };
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
                    th.loadObjectsByID[ID] = temp[i] = { className: className, instanceId: instanceId, dataString: dataString };
                    //if(!th.objects[className]) th.objects[className] = {type:classId,elements:[]};
                    //th.objects[className].elements[instanceId] = eval(className).fromDataString(dataString)
                    //console.log(className+" : "+dataString);
                    //console.log(th.objects[className].elements[instanceId]);
                }
                var o;
                for (i = 0; i < len; i++) {
                    o = temp[i];
                    console.log(i, o.className, o.instanceId, o.dataString);
                    th.objects[o.className].elements[o.instanceId] = eval(o.className).fromDataString(o.dataString);
                }
                ObjectLibrary.creatingObjectsAfterLoad = false;
                //console.log("#########################")
                if (onLoaded)
                    onLoaded(xhr.responseText);
            }
        };
        xhr.send(null);
    }
    static get instance() {
        if (!ObjectLibrary._instance)
            new ObjectLibrary();
        return ObjectLibrary._instance;
    }
    get dataTypes() { return this.names; }
    getElementsByName(name) {
        //console.log("getElementsByName ",name)
        return this.objects[name].elements;
    }
    getObjectByRegisterId(registerId) {
        let t = registerId.split("_");
        let o = this.objects[this.names[Number(t[0])]].elements[Number(t[1])];
        if (o)
            return o;
        if (this.loadObjectsByID) {
            let obj = this.loadObjectsByID[registerId];
            if (obj) {
                //console.log("this.objects["+obj.className+"].elements["+obj.instanceId+"] = "+obj.dataString)
                this.objects[obj.className].elements[obj.instanceId] = o = eval(obj.className).fromDataString(obj.dataString);
                return o;
            }
        }
        return null;
    }
    static print() {
        var lib = ObjectLibrary.instance;
        var names = lib.dataTypes;
        var i, len = names.length;
        var name;
        for (i = 0; i < len; i++) {
            name = names[i];
            //console.log("nb "+name+" = "+lib.getElementsByName(name).length);
        }
    }
    static printElements(name) {
        var t = ObjectLibrary.instance.getElementsByName(name);
        var i, len = t.length;
        for (i = 0; i < len; i++)
            console.log(i, " => ", t[i]);
    }
}
ObjectLibrary.creatingObjectsAfterLoad = false;
//# sourceMappingURL=ObjectLibrary.js.map