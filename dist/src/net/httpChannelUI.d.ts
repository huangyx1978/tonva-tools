import { FetchError } from '../fetchError';
export interface HttpChannelUI {
    startWait(): void;
    endWait(): void;
    showError(error: FetchError): Promise<void>;
}
export declare class HttpChannelNavUI implements HttpChannelUI {
    startWait(): void;
    endWait(): void;
    showError(error: FetchError): Promise<void>;
}
