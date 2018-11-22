/*
import * as React from 'react';
import {ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Row, Col, Button} from 'reactstrap';

export interface Action {
    caption: string;
    action: () => void;
}

export interface DropdownActionsProps {
    actions: Action[];
}

export interface DropdownActionsState {
    dropdownOpen: boolean;
}

export class DropdownActions extends React.Component<DropdownActionsProps, DropdownActionsState> {
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
        return <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret={true} size='sm'><i className='fa fa-plus' /></DropdownToggle>
            <DropdownMenu right={true}>
                {this.props.actions.map((v,index) => {
                    return <DropdownItem key={index} onClick={v.action}>{v.caption}</DropdownItem>
                })}
            </DropdownMenu>
        </ButtonDropdown>
    }
}
*/ 
//# sourceMappingURL=dropdownActions.js.map