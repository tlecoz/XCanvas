import { RegisterableObject } from '../utils/RegisterableObject';
import { IDirty } from './IDirty';

export declare class DirtyEventDispatcher extends RegisterableObject implements IDirty {
    private ____eventStack;
    dirty: boolean;
    constructor();
    addDirtyEventTarget(eventTarget: IDirty): void;
    removeDirtyEventTarget(eventTarget: IDirty): void;
    applyDirty(): void;
}
