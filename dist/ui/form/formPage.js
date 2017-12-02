import * as React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Page } from '../page';
import { ValidForm } from './validForm';
export class FormPage extends React.Component {
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
        return React.createElement(ButtonDropdown, { isOpen: this.state.dropdownOpen, toggle: this.toggle },
            React.createElement(DropdownToggle, { caret: true, size: 'sm' }, "+"),
            React.createElement(DropdownMenu, { right: true }, menuItems.map((v, index) => {
                return React.createElement(DropdownItem, { key: index, onClick: v.action }, v.caption);
            })));
    }
    render() {
        let { close, header, rightMenu, footer, formSchema, children } = this.props;
        return React.createElement(Page, { header: header, close: close, right: this.renderMenu(rightMenu), footer: footer },
            React.createElement(ValidForm, { formSchema: formSchema, children: children }));
    }
}
//# sourceMappingURL=formPage.js.map