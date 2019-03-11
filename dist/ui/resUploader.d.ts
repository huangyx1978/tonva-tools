import * as React from 'react';
export interface ResUploaderProps {
    className?: string;
    multiple?: boolean;
    maxSize?: number;
    onFilesChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}
export declare class ResUploader extends React.Component<ResUploaderProps> {
    private fileInput;
    upload: () => Promise<string>;
    render(): JSX.Element;
}
