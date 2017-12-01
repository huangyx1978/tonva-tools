import {nav} from '../ui/nav';
import {FetchError} from '../fetchError';
import {HttpChannel, HttpChannelUI} from './httpChannel';

class HttpChannelNavUI implements HttpChannelUI {
    startWait() {
        nav.startWait();
    }
    endWait() {
        nav.endWait();
    }
    showError(error:FetchError) {
        nav.endWait();
        /*
        if (error.name === 'SyntaxError') {
            error = {
                name: error.name,
                message: error.message,
            }
        }*/
        nav.onError(error);
    }
}

// 应该用上面的NavUI
const httpChannelNav = new HttpChannel(new HttpChannelNavUI());

export function refetchApi(url, options, resolve, reject) {
    httpChannelNav.fetch(url, options, resolve, reject);
}

export abstract class ApiNav {
    private path:string;

    constructor(path: string) {
        this.path = path || '';
    }

    protected get(path:string, params:any): Promise<any> {
        return httpChannelNav.get(this.path + path, params);
    }

    protected post(path:string, params:any): Promise<any> {
        return httpChannelNav.post(this.path + path, params);
    }

    protected put(path:string, params:any): Promise<any> {
        return httpChannelNav.put(this.path + path, params);
    }

    protected delete(path:string, params:any): Promise<any> {
        return httpChannelNav.delete(this.path + path, params);
    }
}

// 应该用上面的NavUI
const httpChannel = new HttpChannel();

export abstract class Api {
    private path:string;

    constructor(path: string) {
        this.path = path || '';
    }

    protected get(path:string, params:any): Promise<any> {
        return httpChannel.get(this.path + path, params);
    }

    protected post(path:string, params:any): Promise<any> {
        return httpChannel.post(this.path + path, params);
    }

    protected put(path:string, params:any): Promise<any> {
        return httpChannel.put(this.path + path, params);
    }

    protected delete(path:string, params:any): Promise<any> {
        return httpChannel.delete(this.path + path, params);
    }
}
