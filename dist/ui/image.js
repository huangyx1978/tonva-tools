import * as React from 'react';
import { nav } from './nav';
const defaultImage = 'http://101.200.46.56/imgs/Bear-icon.png';
export function Image(props) {
    let { className, style, src } = props;
    if (!src) {
        src = defaultImage;
    }
    else if (src.startsWith(':') === true) {
        src = nav.resUrl + src.substr(1);
    }
    return React.createElement("img", { src: src, className: className, style: style });
}
//# sourceMappingURL=image.js.map