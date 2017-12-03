import * as React from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
export class DropdownActions extends React.Component {
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
    render() {
        return React.createElement(ButtonDropdown, { isOpen: this.state.dropdownOpen, toggle: this.toggle },
            React.createElement(DropdownToggle, { caret: true, size: 'sm' },
                React.createElement("i", { className: 'fa fa-plus' })),
            React.createElement(DropdownMenu, { right: true }, this.props.actions.map((v, index) => {
                return React.createElement(DropdownItem, { key: index, onClick: v.action }, v.caption);
            })));
    }
}
//# sourceMappingURL=dropdownActions.js.map