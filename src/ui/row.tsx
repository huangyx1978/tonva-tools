import * as React from 'react';
import {ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Row, Col, Button, Form, FormGroup, Label, Input, 
    FormText, FormFeedback} from 'reactstrap';
import * as classNames from 'classnames';

export interface LabelRowProps {
    label: string;
    className?: string;
    action?: () => void;
}

export interface LabelRowState {
    isPressed: boolean;
} 

export class LabelRow extends React.Component<LabelRowProps, LabelRowState> {
    constructor(props) {
        super(props);
        this.state = {
            isPressed: false
        }
    }
    mouseDown() {
        this.setState({isPressed: true});
    }
    mouseUp() {
        this.setState({isPressed: false});
        if (this.props.action) this.props.action();
    }
    render() {
        let c = classNames('label-row', this.props.className, {
            pressed: this.state.isPressed
        });
        return (
        <Row
            className={c}
            onMouseDown={()=>this.mouseDown()} 
            onMouseUp={()=>this.mouseUp()}>
            <Col tag='label' xs={3}>{this.props.label}</Col>
            <Col xs={9}>{this.props.children}</Col>
        </Row>
        );
    }
}

export interface ActionRowProps {
    className?: string;
    action?: () => void;
}

export interface ActionRowState {
    isPressed: boolean;
} 

export class ActionRow extends React.Component<ActionRowProps, ActionRowState> {
    constructor(props) {
        super(props);
        this.state = {
            isPressed: false
        }
    }
    mouseDown() {
        this.setState({isPressed: true});
    }
    mouseUp() {
        this.setState({isPressed: false});
        if (this.props.action) this.props.action();
    }
    render() {
        let c = classNames('action-row', this.props.className, {
            pressed: this.state.isPressed
        });
        return (
        <div
            className={c}
            onMouseDown={()=>this.mouseDown()} 
            onMouseUp={()=>this.mouseUp()}>
            {this.props.children}
        </div>
        );
    }
}
