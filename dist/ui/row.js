import * as React from 'react';
import { Row, Col } from 'reactstrap';
import * as classNames from 'classnames';
export class LabelRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPressed: false
        };
    }
    mouseDown() {
        this.setState({ isPressed: true });
    }
    mouseUp() {
        this.setState({ isPressed: false });
        if (this.props.action)
            this.props.action();
    }
    render() {
        let c = classNames('label-row', this.props.className, {
            pressed: this.state.isPressed
        });
        return (React.createElement(Row, { className: c, onMouseDown: () => this.mouseDown(), onMouseUp: () => this.mouseUp() },
            React.createElement(Col, { tag: 'label', xs: 3 }, this.props.label),
            React.createElement(Col, { xs: 9 }, this.props.children)));
    }
}
export class ActionRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPressed: false
        };
    }
    mouseDown() {
        this.setState({ isPressed: true });
    }
    mouseUp() {
        this.setState({ isPressed: false });
        if (this.props.action)
            this.props.action();
    }
    render() {
        let c = classNames('action-row', this.props.className, {
            pressed: this.state.isPressed
        });
        return (React.createElement("div", { className: c, onMouseDown: () => this.mouseDown(), onMouseUp: () => this.mouseUp() }, this.props.children));
    }
}
//# sourceMappingURL=row.js.map