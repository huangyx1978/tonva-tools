import * as React from 'react';
import { NumberWidget } from './numberWidget';
export declare class UpdownWidget extends NumberWidget {
    protected inputType: string;
    protected onKeyDown: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
}
