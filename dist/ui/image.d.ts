import * as React from 'react';
export interface ImageProps {
    src: string;
    className?: string;
    style?: React.CSSProperties;
    altImage?: string;
}
export declare function Image(props: ImageProps): JSX.Element;
