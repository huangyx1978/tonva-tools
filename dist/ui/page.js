var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { observer } from 'mobx-react';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import { TitleBar } from './titleBar';
const scrollTimeGap = 100;
class ScrollView extends React.Component {
    constructor(props) {
        super(props);
        this.bottomTime = 0;
        this.topTime = 0;
        this.onScroll = this.onScroll.bind(this);
    }
    onScroll(e) {
        if (this.props.onScroll)
            this.props.onScroll(e);
        let el = e.target;
        if (el.scrollTop < 30) {
            if (this.props.onScrollTop !== undefined) {
                let topTime = new Date().getTime();
                if (topTime - this.topTime > scrollTimeGap) {
                    this.topTime = topTime;
                    this.props.onScrollTop();
                }
            }
        }
        if (el.scrollTop + el.offsetHeight > el.scrollHeight - 30) {
            if (this.props.onScrollBottom !== undefined) {
                let bottomTime = new Date().getTime();
                if (bottomTime - this.bottomTime > scrollTimeGap) {
                    this.bottomTime = bottomTime;
                    this.props.onScrollBottom();
                }
            }
        }
    }
    render() {
        return (React.createElement("main", { className: this.props.className, onScroll: this.onScroll }, this.props.children));
    }
}
let Page = class Page extends React.Component {
    constructor(props) {
        super(props);
        this.tabs = props.tabs;
        if (this.tabs === undefined || this.tabs.length === 0)
            return;
        let cur;
        let tabs = [];
        for (let tab of this.tabs) {
            let t = _.clone(tab);
            if (cur === undefined) {
                if (t.isSelected === true)
                    cur = t;
                else
                    t.isSelected = false;
            }
            else {
                t.isSelected = false;
            }
            t.isMounted = false;
            tabs.push(t);
        }
        if (cur === undefined) {
            cur = tabs[0];
            cur.isSelected = true;
        }
        this.state = {
            cur: cur,
            tabs: tabs,
        };
    }
    onTabClick(tab) {
        if (tab.isSelected === true)
            return;
        let cur;
        let tabs = this.state.tabs;
        for (let t of tabs) {
            if (t === tab) {
                t.isSelected = true;
                cur = t;
            }
            else
                t.isSelected = false;
        }
        this.setState({
            cur: cur,
            tabs: tabs
        });
    }
    renderTabs(footer) {
        const { header, back, right } = this.props;
        let cur = this.state.cur;
        let tabs = React.createElement("div", null, this.state.tabs.map((tab, index) => {
            const { icon, isSelected, title, redDot } = tab;
            let img, redDotView, cn;
            if (icon !== undefined)
                img = React.createElement("img", { src: icon });
            if (redDot !== undefined) {
                let v = redDot.get();
                if (v < 0) {
                    cn = classNames('red-dot');
                    redDotView = React.createElement("u", null);
                }
                else if (v > 0) {
                    cn = classNames('red-dot', 'num');
                    redDotView = React.createElement("u", null, v);
                }
            }
            return React.createElement("div", { key: index, className: classNames('va-tab', { cur: isSelected }), onClick: () => this.onTabClick(tab) },
                img,
                React.createElement("div", { className: cn },
                    title,
                    redDotView));
        }));
        let titleBar;
        if (header !== false)
            titleBar = React.createElement(TitleBar, { back: back, center: cur.header || cur.title, right: right });
        return React.createElement("article", { className: 'page-container' },
            titleBar,
            React.createElement("section", null, this.state.tabs.map((tab, index) => {
                if (tab.isSelected === true || tab.isMounted === true) {
                    tab.isMounted = true;
                    return React.createElement(ScrollView, { key: index, className: classNames({ invisible: tab.isSelected === false }), onScroll: tab.onScroll, onScrollTop: tab.onScrollTop, onScrollBottom: tab.onScrollBottom }, tab.content);
                }
            })),
            tabs,
            footer);
    }
    renderSingle(footer) {
        const { back, header, right, onScroll, onScrollTop, onScrollBottom, children } = this.props;
        let titleBar;
        if (header !== false)
            titleBar = React.createElement(TitleBar, { back: back, center: header, right: right, logout: this.props.logout });
        return (React.createElement("article", { className: 'page-container' },
            titleBar,
            React.createElement("section", null,
                React.createElement(ScrollView, { onScroll: onScroll, onScrollTop: onScrollTop, onScrollBottom: onScrollBottom }, children)),
            footer));
    }
    render() {
        const { back, header, right, footer, onScroll, onScrollTop, onScrollBottom, children } = this.props;
        let elFooter;
        if (footer !== undefined)
            elFooter = React.createElement("footer", null, footer);
        if (this.tabs !== undefined)
            return this.renderTabs(elFooter);
        else
            return this.renderSingle(elFooter);
    }
};
Page = __decorate([
    observer
], Page);
export { Page };
//# sourceMappingURL=page.js.map