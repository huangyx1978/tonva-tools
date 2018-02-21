import * as React from 'react';
import { nav } from './nav';
export class TitleBar extends React.Component {
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
        });
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
    render() {
        let b = this.state.hasBack || self != top;
        let r = this.props.right;
        let c = this.props.center;
        let back, pop, debugLogout;
        if (this.props.debugLogout === true && self === top) {
            debugLogout = React.createElement("a", { className: "dropdown-toggle btn btn-secondary btn-sm", role: "button", onClick: () => nav.logout() },
                React.createElement("i", { className: "fa fa-sign-out" }));
        }
        if (b) {
            switch (this.props.back) {
                case 'none':
                    back = undefined;
                    break;
                default:
                case 'back':
                    back = React.createElement("nav", { onClick: this.back },
                        React.createElement("i", { className: "fa fa-arrow-left" }));
                    break;
                case 'close':
                    back = React.createElement("nav", { onClick: this.back },
                        React.createElement("i", { className: "fa fa-close" }));
                    break;
            }
        }
        if (self != top) {
            console.log(document.location.href);
            pop = React.createElement("header", { onClick: () => window.open(document.location.href) });
        }
        let right;
        if (r || debugLogout)
            right = React.createElement("aside", null,
                r,
                " ",
                debugLogout);
        return (React.createElement("header", null,
            pop,
            back,
            React.createElement("div", null, c),
            right));
    }
}
//# sourceMappingURL=titleBar.js.map