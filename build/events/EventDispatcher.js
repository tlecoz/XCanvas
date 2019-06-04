/**
 * Created by Thomas on 04/10/2016.
 */
class EventDispatcher extends RegisterableObject {
    constructor() {
        super();
        this.customData = {};
        this.___dispatcherNames = [];
        this.___nbDispatcher = 0;
        this.___dispatcherActifById = [];
        this.___dispatcherFunctionById = [];
    }
    addEventListener(name, func, overrideExistingEventIfExists = false) {
        if (name == undefined || func == undefined)
            return;
        var nameId = this.___dispatcherNames.indexOf(name);
        if (nameId == -1) {
            this.___dispatcherActifById[this.___nbDispatcher] = false;
            this.___dispatcherFunctionById[this.___nbDispatcher] = [];
            nameId = this.___nbDispatcher;
            this.___dispatcherNames[this.___nbDispatcher++] = name;
        }
        if (overrideExistingEventIfExists)
            this.___dispatcherFunctionById[nameId] = [func];
        else
            this.___dispatcherFunctionById[nameId].push(func);
    }
    clearEvents() {
        this.___dispatcherNames = [];
        this.___nbDispatcher = 0;
        this.___dispatcherActifById = [];
        this.___dispatcherFunctionById = [];
    }
    removeEventListener(name, func = null) {
        var id = this.___dispatcherNames.indexOf(name);
        if (id == -1)
            return;
        if (!func) {
            this.___dispatcherFunctionById[id] = [];
            return;
        }
        var functions = this.___dispatcherFunctionById[id];
        var id2 = functions.indexOf(func);
        if (id2 == -1)
            return;
        functions.splice(id2, 1);
    }
    applyEvents(object = null) {
        var len = this.___dispatcherNames.length;
        if (0 == len)
            return;
        var i, j, len2;
        var funcs;
        for (i = 0; i < len; i++) {
            if (this.___dispatcherActifById[i] == true) {
                this.___dispatcherActifById[i] = false;
                funcs = this.___dispatcherFunctionById[i];
                if (funcs) {
                    len2 = funcs.length;
                    for (j = 0; j < len2; j++)
                        funcs[j](this, object, this.___dispatcherNames[i]);
                }
                else {
                    console.warn("EventDispatcher.applyEvents bug ? -> ", this.___dispatcherNames[i]);
                }
            }
        }
    }
    dispatchEvent(eventName) {
        if (!this.___dispatcherNames)
            return;
        var id = this.___dispatcherNames.indexOf(eventName);
        if (id == -1)
            return;
        this.___dispatcherActifById[id] = true;
        this.applyEvents(this);
    }
}
//# sourceMappingURL=EventDispatcher.js.map