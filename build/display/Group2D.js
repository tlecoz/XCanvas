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
        this._numChildren = 0;
        this._children = [];
    }
    get dataString() {
        var data = super.dataString;
        data += "#";
        var i, len = this._children.length;
        for (i = 0; i < len; i++) {
            if (i > 0)
                data += ",";
            data += this._children[i].REGISTER_ID;
        }
        return data;
    }
    static fromDataString(data, target = null) {
        var params = data.split("#");
        //console.log("params = ",params);
        var t = params[3].split(",");
        var o;
        if (!target)
            o = new Group2D();
        else
            o = target;
        Display2D.fromDataString(data, o);
        var i, len = t.length;
        for (i = 0; i < len; i++)
            o.appendChild(ObjectLibrary.instance.getObjectByRegisterId(t[i]));
        return o;
    }
    setStage(stage) {
        super.setStage(stage);
        let i, nb = this._numChildren;
        for (i = 0; i < nb; i++)
            this._children[i].setStage(stage);
    }
    appendChild(element) {
        this._children[this._numChildren++] = element;
        element.parent = this;
        console.log("Group.appendChild ", element, this.stage);
        element.setStage(this.stage);
        return element;
    }
    removeChild(element) {
        const id = this._children.lastIndexOf(element);
        if (id < 0)
            return null;
        this._children.splice(id, 1);
        this._numChildren--;
        element.parent = null;
        this.setStage(null);
        return element;
    }
    get numChildren() { return this._numChildren; }
    get children() { return this._children; }
    update(context) {
        let alpha = this.alpha;
        const parent = this.parent;
        const children = this.children;
        this.identity();
        if (parent)
            this.multiply(parent);
        const m = this.applyTransform();
        context.save();
        let i, nb = this._numChildren;
        for (i = 0; i < nb; i++)
            children[i].update(context);
        context.restore();
        return m;
    }
}
//# sourceMappingURL=Group2D.js.map