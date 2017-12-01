"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const className = require("classnames");
const nav_1 = require("./nav");
class TitleBar extends React.Component {
    constructor(props) {
        super(props);
        this.navChange = this.navChange.bind(this);
        this.state = {
            hasBack: false,
        };
    }
    navChange() {
        this.setState({
            hasBack: nav_1.nav.level > 1
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
        nav_1.nav.back(); // 这个才会显示confirm box，在dataForm里面，如果输入了数据的话
    }
    render() {
        let b = this.state.hasBack || self != top;
        let r = this.props.right;
        let c = this.props.center;
        let back, pop;
        if (b) {
            let cn = className('fa', this.props.close === true ? 'fa-close' : 'fa-arrow-left');
            back = (React.createElement("nav", { onClick: this.back },
                React.createElement("i", { className: cn })));
        }
        if (self != top) {
            console.log(document.location.href);
            pop = React.createElement("header", { onClick: () => window.open(document.location.href) });
        }
        let right;
        if (r)
            right = React.createElement("aside", null, r);
        return (React.createElement("header", null,
            pop,
            back,
            React.createElement("div", null, c),
            right));
    }
}
exports.TitleBar = TitleBar;
//# sourceMappingURL=titleBar.js.map