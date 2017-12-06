import * as React from 'react';
import * as classNames from 'classnames';
import '../css/va-row.css';
export class ListRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pressed: false,
        };
    }
    render() {
        let { date, main, vice, icon, unread, right, onClick } = this.props;
        let header, isIcon;
        switch (typeof icon) {
            case 'object':
                header = React.createElement("header", null, icon);
                isIcon = false;
                break;
            case 'string':
                header = React.createElement("header", { className: 'icon' },
                    React.createElement("img", { src: icon }));
                isIcon = true;
                break;
        }
        let footer;
        if (right !== undefined) {
            if (typeof right === 'string')
                footer = React.createElement("footer", null,
                    React.createElement("small", { className: "text-muted" }, right));
            else
                footer = React.createElement("footer", null, right);
        }
        let viceSpan;
        if (vice !== undefined)
            viceSpan = React.createElement("span", null, vice);
        let cn = classNames('va-row', { icon: isIcon, pressed: this.state.pressed }, { "va-action": onClick !== undefined });
        return (React.createElement("li", { className: cn, onClick: onClick },
            header,
            React.createElement("div", null,
                React.createElement("div", null, main),
                viceSpan),
            footer));
    }
}
//# sourceMappingURL=listRow.js.map