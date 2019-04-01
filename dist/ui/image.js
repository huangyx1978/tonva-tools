import * as React from 'react';
import classNames from 'classnames';
import { nav } from './nav';
export function Image(props) {
    let { className, style, src } = props;
    if (!src) {
        return React.createElement("div", { className: classNames(className, 'image-none'), style: style },
            React.createElement("i", { className: "fa fa-file-o" }));
    }
    if (src.startsWith(':') === true) {
        src = nav.resUrl + src.substr(1);
    }
    return React.createElement("img", { src: src, className: className, style: style });
}
//# sourceMappingURL=image.js.map