export declare class ObjectLibrary {
    static classes: {
        [key: string]: any;
    };
    private static _instance;
    private static creatingObjectsAfterLoad;
    private objects;
    private names;
    private indexByName;
    private objectById;
    private nbObject;
    private loadObjectsByID;
    constructor();
    registerObject(dataType: string, o: any): string;
    save(fileName?: string): void;
    load(url: string, onLoaded?: (res: string) => void): void;
    static get instance(): ObjectLibrary;
    get dataTypes(): string[];
    getElementsByName(name: string): any[];
    getObjectByRegisterId(registerId: string): any;
    static print(): void;
    static printElements(name: string): void;
}
