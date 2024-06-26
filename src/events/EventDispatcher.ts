/**
 * Created by Thomas on 04/10/2016.
 */

import { RegisterableObject } from "../utils/RegisterableObject";


export type BasicEvent = {
    target: EventDispatcher,
    data?: unknown
}




export type EventCallback<T extends BasicEvent> = (event: T) => void;

export class EventDispatcher<E extends BasicEvent = BasicEvent> extends RegisterableObject {

    private listeners: { [eventName: string]: EventCallback<E>[] } = {};

    public addEventListener(eventName: string, callback: EventCallback<E>) {
        if (!this.listeners[eventName]) this.listeners[eventName] = [];
        this.listeners[eventName].push(callback);
    }

    public removeEventListener(eventName: string, callback: EventCallback<E>) {
        if (!this.listeners[eventName]) return;
        const id: number = this.listeners[eventName].indexOf(callback);
        if (id === -1) return;
        this.listeners[eventName].splice(id, 1);
    }

    public dispatchEvent(eventName: string, data?: E["data"]) {
        if (!this.listeners[eventName]) return;
        const event = { target: this, data } as unknown as E;
        this.listeners[eventName].forEach(callback => callback(event));
    }

    public clearEvents(): void {
        this.listeners = {};
    }
}

/*
export class EventDispatcher extends RegisterableObject {

    public customData: any;


    private ___dispatcherNames: string[];
    private ___nbDispatcher: number;
    private ___dispatcherActifById: boolean[];
    private ___dispatcherFunctionById: Array<Array<Function>>;

    constructor() {
        super();

        this.customData = {};
        this.___dispatcherNames = [];
        this.___nbDispatcher = 0;
        this.___dispatcherActifById = [];
        this.___dispatcherFunctionById = [];
    }


    public addEventListener(name: string, func: Function, overrideExistingEventIfExists: boolean = false) {
        if (name == undefined || func == undefined) return;

        var nameId = this.___dispatcherNames.indexOf(name);
        if (nameId == -1) {
            this.___dispatcherActifById[this.___nbDispatcher] = false;
            this.___dispatcherFunctionById[this.___nbDispatcher] = [];
            nameId = this.___nbDispatcher;
            this.___dispatcherNames[this.___nbDispatcher++] = name;
        }

        if (overrideExistingEventIfExists) this.___dispatcherFunctionById[nameId] = [func];
        else {
            if (func) this.___dispatcherFunctionById[nameId].push(func);
        }

    }

    public clearEvents(): void {
        this.___dispatcherNames = [];
        this.___nbDispatcher = 0;
        this.___dispatcherActifById = [];
        this.___dispatcherFunctionById = [];
    }


    public removeEventListener(name: string, func?: Function) {

        var id = this.___dispatcherNames.indexOf(name);
        if (id == -1) return;

        if (!func) {
            this.___dispatcherFunctionById[id] = [];
            return;
        }

        var functions: Array<Function> = this.___dispatcherFunctionById[id]
        var id2: number = functions.indexOf(func);
        if (id2 == -1) return;
        functions.splice(id2, 1);
    }


    public applyEvents(object: any = null) {
        var len: number = this.___dispatcherNames.length;
        if (0 == len) return;

        var i: number, j: number, len2: number;
        var funcs: Array<Function>;
        for (i = 0; i < len; i++) {
            if (this.___dispatcherActifById[i] == true) {
                this.___dispatcherActifById[i] = false;
                funcs = this.___dispatcherFunctionById[i];
                console.log("funcs = ", funcs.length)
                if (funcs) {
                    len2 = funcs.length;
                    for (j = 0; j < len2; j++) funcs[j](this, object, this.___dispatcherNames[i]);
                } else {
                    console.warn("EventDispatcher.applyEvents bug ? -> ", this.___dispatcherNames[i])
                }
            }
        }
    }

    public dispatchEvent(eventName: string) {
        if (!this.___dispatcherNames) return;
        var id: number = this.___dispatcherNames.indexOf(eventName);
        if (id == -1) return;
        this.___dispatcherActifById[id] = true;
        this.applyEvents(this);
    }

}
    */
