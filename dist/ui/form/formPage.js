"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const reactstrap_1 = require("reactstrap");
const page_1 = require("../page");
const validForm_1 = require("./validForm");
class FormPage extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }
    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }
    renderMenu(menuItems) {
        if (menuItems === undefined)
            return null;
        return React.createElement(reactstrap_1.ButtonDropdown, { isOpen: this.state.dropdownOpen, toggle: this.toggle },
            React.createElement(reactstrap_1.DropdownToggle, { caret: true, size: 'sm' }, "+"),
            React.createElement(reactstrap_1.DropdownMenu, { right: true }, menuItems.map((v, index) => {
                return React.createElement(reactstrap_1.DropdownItem, { key: index, onClick: v.action }, v.caption);
            })));
    }
    render() {
        let { close, header, rightMenu, footer, formSchema, children } = this.props;
        return React.createElement(page_1.Page, { header: header, close: close, right: this.renderMenu(rightMenu), footer: footer },
            React.createElement(validForm_1.ValidForm, { formSchema: formSchema, children: children }));
    }
}
exports.FormPage = FormPage;
//# sourceMappingURL=formPage.js.map