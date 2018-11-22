export declare function setSubAppWindow(win: Window): void;
export declare function postWsToTop(msg: any): void;
export declare abstract class WsBase {
    wsBaseId: string;
    private handlerSeed;
    private anyHandlers;
    private msgHandlers;
    onWsReceiveAny(handler: (msg: any) => Promise<void>): number;
    onWsReceive(type: string, handler: (msg: any) => Promise<void>): number;
    endWsReceive(handlerId: number): void;
    receive(msg: any): Promise<void>;
}
export declare class WsBridge extends WsBase {
    wsBaseId: string;
}
export declare const wsBridge: WsBridge;
export declare class WSChannel extends WsBase {
    wsBaseId: string;
    static centerToken: string;
    private wsHost;
    private token;
    private ws;
    constructor(wsHost: string, token: string);
    static setCenterToken(token?: string): void;
    connect(): Promise<void>;
    close(): void;
    private wsMessage;
    sendWs(msg: any): void;
}
