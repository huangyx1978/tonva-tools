export declare class WSChannel {
    static centerToken: string;
    private wsHost;
    private token;
    private ws;
    constructor(wsHost: string, token: string);
    static setCenterToken(token?: string): void;
    connect(): Promise<void>;
    close(): void;
    private wsMessage(event);
    private handlerSeed;
    private anyHandlers;
    private msgHandlers;
    onWsReceiveAny(handler: (msg: any) => void): number;
    onWsReceive(type: string, handler: (msg: any) => void): number;
    endWsReceive(handlerId: number): void;
    sendWs(msg: any): void;
}
