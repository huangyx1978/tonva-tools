import * as React from 'react';
import { NumberWidget } from './numberWidget';
export declare class UpdownWidget extends NumberWidget {
    protected inputType: string;
    protected isValidKey(key: number): boolean;
    protected internalOnKeyDown(evt: React.KeyboardEvent<HTMLInputElement>): void;
}
