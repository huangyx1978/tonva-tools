import * as React from 'react';
import * as _ from 'lodash';
import * as className from 'classnames';
import {ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
    Row, Col, Button, Form, FormGroup, Label, Input, 
    FormText, FormFeedback} from 'reactstrap';
import {nav} from './nav';

export interface TitleBarProps {
    back?: 'back' | 'close' | 'none';
    center: string | JSX.Element;
    right?: JSX.Element;
    logout?: ()=>void;
}
export interface TitleBarState {
    hasBack: boolean;
}
export class TitleBar extends React.Component<TitleBarProps, TitleBarState> {
    private navChangeHandler: ()=>void;
    constructor(props) {
        super(props);
        this.navChange = this.navChange.bind(this);
        this.state = {
            hasBack: false,
        };
    }
    navChange() {
        this.setState({
            hasBack: nav.level > 1
        })
    }
    componentWillMount() {
        this.navChange();
        //this.navChangeHandler = nav.events.add('change', this.navChange);
    }
    componentWillUnmount() {
        //nav.events.remove('change', this.navChangeHandler);
    }
    back() {
        nav.back(); // 这个才会显示confirm box，在dataForm里面，如果输入了数据的话
    }
    openWindow() {
        window.open(document.location.href);
    }
    render() {
        let b = this.state.hasBack || self != top;
        let {right, center, logout} = this.props;
        //let r = this.props.right;
        //let c = this.props.center;
        let back, pop, debugLogout;
        if (logout !== undefined && self === top) {
            debugLogout = <a className="dropdown-toggle btn btn-secondary btn-sm"
                role="button"
                onClick={()=>{logout(); nav.logout();}}>
                <i className="fa fa-sign-out" />
            </a>
        }
        if (b) {
            switch (this.props.back) {
                case 'none': back = undefined; break;
                default:
                case 'back': back = <nav onClick={this.back}><i className="fa fa-arrow-left" /></nav>; break;
                case 'close': back = <nav onClick={this.back}><i className="fa fa-close" /></nav>; break;
            }
        }
        if (self != top) {
            console.log(document.location.href);
            pop = <header onClick={this.openWindow} />;
        }
        let rightView;
        if (right || debugLogout) rightView = <aside>{right} {debugLogout}</aside>;
        return (
        <header>
            {pop}
            {back}
            <div>{center}</div>
            {rightView}
        </header>
        );
    }
}
