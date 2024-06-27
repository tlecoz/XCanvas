import { RegisterableObject } from '../utils/RegisterableObject';

export type BasicEvent = {
    target: EventDispatcher;
    data?: unknown;
};
export type EventCallback<T extends BasicEvent> = (event: T) => void;
export declare class EventDispatcher<E extends BasicEvent = BasicEvent> extends RegisterableObject {
    private listeners;
    addEventListener(eventName: string, callback: EventCallback<E>): void;
    removeEventListener(eventName: string, callback: EventCallback<E>): void;
    dispatchEvent(eventName: string, data?: E["data"]): void;
    clearEvents(): void;
}
