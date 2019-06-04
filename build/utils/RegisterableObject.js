class RegisterableObject {
    constructor() {
        this.___ID = ObjectLibrary.instance.registerObject(this.constructor.name, this);
    }
    get REGISTER_ID() { return this.___ID; }
    ;
    get dataString() {
        return "";
    }
}
//# sourceMappingURL=RegisterableObject.js.map