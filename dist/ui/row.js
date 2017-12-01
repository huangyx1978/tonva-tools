"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const reactstrap_1 = require("reactstrap");
const classNames = require("classnames");
class LabelRow extends React.Component {
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
        return (React.createElement(reactstrap_1.Row, { className: c, onMouseDown: () => this.mouseDown(), onMouseUp: () => this.mouseUp() },
            React.createElement(reactstrap_1.Col, { tag: 'label', xs: 3 }, this.props.label),
            React.createElement(reactstrap_1.Col, { xs: 9 }, this.props.children)));
    }
}
exports.LabelRow = LabelRow;
class ActionRow extends React.Component {
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
exports.ActionRow = ActionRow;
//# sourceMappingURL=row.js.map