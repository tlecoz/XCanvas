class FilterStack extends RegisterableObject {
    //public cacheAsBitmap:boolean = false;
    constructor() {
        super();
        this.dirty = true;
        this.boundOffsetW = 0;
        this.boundOffsetH = 0;
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
            if (cloneFilters)
                s.add(f.clone());
            else
                s.add(f);
        }
        return s;
    }
    get value() {
        if (this.dirty) {
            //console.log(this.dirty)
            let v = "";
            let f = this.first;
            let w = 0, h = 0;
            while (f) {
                v = v + f.value + " ";
                if (f.boundOffsetW > w)
                    w = f.boundOffsetW;
                if (f.boundOffsetH > h)
                    h = f.boundOffsetH;
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
            if (b)
                s += ",";
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
        for (i = 0; i < len; i++)
            s.add(ObjectLibrary.instance.getObjectByRegisterId(t[i]));
        return s;
    }
    add(filter) {
        if (!this.first)
            this.first = filter;
        if (this.last)
            this.last.next = filter;
        this.last = filter;
        filter.addDirtyEventTarget(this);
        return this;
    }
}
//# sourceMappingURL=FilterStack.js.map