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
        let footer;
        if (right !== undefined)
            footer = React.createElement("footer", null, right);
        let viceSpan;
        if (vice !== undefined)
            viceSpan = React.createElement("span", null, vice);
        let cn = classNames('va-row', { pressed: this.state.pressed }, { "va-action": onClick !== undefined });
        return (React.createElement("li", { className: cn, onClick: onClick },
            React.createElement("header", null,
                React.createElement("img", { src: icon })),
            React.createElement("div", null,
                React.createElement("div", null, main),
                viceSpan),
            footer));
    }
}
//# sourceMappingURL=listRow.js.map