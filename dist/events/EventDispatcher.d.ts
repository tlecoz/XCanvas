import { RegisterableObject } from '../utils/RegisterableObject';

export declare class EventDispatcher extends RegisterableObject {
    customData: any;
    private ___dispatcherNames;
    private ___nbDispatcher;
    private ___dispatcherActifById;
    private ___dispatcherFunctionById;
    constructor();
    addEventListener(name: string, func: Function, overrideExistingEventIfExists?: boolean): void;
    clearEvents(): void;
    removeEventListener(name: string, func?: Function): void;
    applyEvents(object?: any): void;
    dispatchEvent(eventName: string): void;
}
