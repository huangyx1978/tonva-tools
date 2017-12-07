export declare class WSChannel {
    private token?;
    private ws?;
    setToken(token?: string): void;
    connect(): Promise<void>;
    private wsMessage(event);
    private handlerSeed;
    private anyHandlers;
    private msgHandlers;
    onWsReceiveAny(handler: (msg: any) => void): number;
    onWsReceive(type: string, handler: (msg: any) => void): number;
    endWsReceive(handlerId: number): void;
    sendWs(msg: any): void;
}
declare const wsChannel: WSChannel;
export default wsChannel;
