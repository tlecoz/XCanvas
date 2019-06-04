class DirtyEventDispatcher extends RegisterableObject {
    constructor() {
        super();
        this.dirty = true;
        this.____eventStack = [];
    }
    addDirtyEventTarget(eventTarget) {
        if (this.____eventStack.lastIndexOf(eventTarget) == -1)
            this.____eventStack.push(eventTarget);
    }
    removeDirtyEventTarget(eventTarget) {
        const id = this.____eventStack.lastIndexOf(eventTarget);
        if (id != -1)
            this.____eventStack.splice(id, 1);
    }
    applyDirty() {
        let i, len = this.____eventStack.length;
        for (i = 0; i < len; i++)
            this.____eventStack[i].dirty = true;
    }
}
//# sourceMappingURL=DirtyEventDispatcher.js.map