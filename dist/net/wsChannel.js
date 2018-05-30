//const wsHost = process.env.REACT_APP_WSHOST;
export class WSChannel {
    constructor(wsHost, token) {
        this.handlerSeed = 1;
        this.anyHandlers = {};
        this.msgHandlers = {};
        this.wsHost = wsHost;
        this.token = token;
    }
    static setCenterToken(token) {
        WSChannel.centerToken = token;
    }
    connect() {
        //this.wsHost = wsHost;
        //this.token = token || WSChannel.centerToken;
        if (this.ws !== undefined)
            return;
        let that = this;
        return new Promise((resolve, reject) => {
            let ws = new WebSocket(this.wsHost, this.token || WSChannel.centerToken);
            console.log('connect webSocket %s', this.wsHost);
            ws.onopen = (ev) => {
                console.log('webSocket connected %s', this.wsHost);
                that.ws = ws;
                resolve();
            };
            ws.onerror = (ev) => {
                reject('webSocket can\'t open!');
            };
            ws.onmessage = (msg) => that.wsMessage(msg);
            ws.onclose = (ev) => {
                that.ws = undefined;
                console.log('webSocket closed!');
            };
        });
    }
    close() {
        if (this.ws !== undefined) {
            this.ws.close();
            this.ws = undefined;
        }
    }
    wsMessage(event) {
        /*
        event dump:
        currentTarget:WebSocket {url: "ws://192.168.0.199:3000/tv", readyState: 1, bufferedAmount: 0, …}
        data:"{"type":"sheetAct","data":{"state":"备货"}}"
        defaultPrevented:false
        eventPhase:0
        isTrusted:true
        lastEventId:""
        origin:"ws://192.168.0.199:3000"
        path:Array(0) []
        ports:null
        returnValue:true
        source:null
        srcElement:WebSocket {url: "ws://192.168.0.199:3000/tv", readyState: 1, bufferedAmount: 0, …}
        target:WebSocket {url: "ws://192.168.0.199:3000/tv", readyState: 1, bufferedAmount: 0, …}
        timeStamp:34665.245
        type:"message"
        */
        //console.log('ws msg:', event);
        try {
            console.log('websocket message: %s', event.data);
            let json = JSON.parse(event.data);
            let t = json.type;
            for (let i in this.anyHandlers) {
                this.anyHandlers[i](json);
            }
            for (let i in this.msgHandlers) {
                let { type, handler } = this.msgHandlers[i];
                if (type !== t)
                    continue;
                handler(json);
            }
        }
        catch (err) {
            console.log('ws msg error: ', err);
        }
    }
    onWsReceiveAny(handler) {
        let seed = this.handlerSeed++;
        this.anyHandlers[seed] = handler;
        return seed;
    }
    onWsReceive(type, handler) {
        let seed = this.handlerSeed++;
        this.msgHandlers[seed] = { type: type, handler: handler };
        return seed;
    }
    endWsReceive(handlerId) {
        delete this.anyHandlers[handlerId];
        delete this.msgHandlers[handlerId];
    }
    sendWs(msg) {
        let netThis = this;
        this.connect().then(() => {
            netThis.ws.send(msg);
        });
    }
}
//const wsChannel = new WSChannel();
//export default wsChannel;
//# sourceMappingURL=wsChannel.js.map