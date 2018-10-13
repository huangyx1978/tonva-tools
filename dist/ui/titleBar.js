import * as React from 'react';
import { nav, mobileHeaderStyle } from './nav';
export class TitleBar extends React.Component {
    constructor(props) {
        super(props);
        this.logoutClick = () => {
            if (confirm('Really want to logout?') === false)
                return;
            let { logout } = this.props;
            if (typeof logout === 'function') {
                logout();
            }
            nav.logout();
        };
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
    async back() {
        await nav.back(); // 这个才会显示confirm box，在dataForm里面，如果输入了数据的话
    }
    openWindow() {
        window.open(document.location.href);
    }
    render() {
        let b = this.state.hasBack || self != top;
        let { right, center, logout } = this.props;
        let back, pop, debugLogout;
        if (logout !== undefined && self === top) {
            if (typeof logout === 'boolean' && logout === true
                || typeof logout === 'function') {
                let { nick, name } = nav.user;
                debugLogout = React.createElement("div", { className: "d-flex align-items-center" },
                    React.createElement("small", { className: "text-light" }, nick || name),
                    React.createElement("a", { className: "dropdown-toggle btn btn-secondary btn-sm ml-2", role: "button", onClick: this.logoutClick },
                        React.createElement("i", { className: "fa fa-sign-out" })));
            }
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
            pop = React.createElement("header", { onClick: this.openWindow });
        }
        let rightView;
        if (right || debugLogout)
            rightView = React.createElement("aside", null,
                right,
                " ",
                debugLogout);
        return (React.createElement("header", { style: mobileHeaderStyle },
            pop,
            back,
            React.createElement("div", null, center),
            rightView));
    }
}
//# sourceMappingURL=titleBar.js.map