import * as React from 'react';
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
export class Page extends React.Component {
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
        const { header, close, right } = this.props;
        let cur = this.state.cur;
        let tabs = React.createElement("div", null, this.state.tabs.map((tab, index) => {
            let img;
            if (tab.icon !== undefined)
                img = React.createElement("img", { src: tab.icon });
            return React.createElement("div", { key: index, className: classNames({ cur: tab.isSelected }), onClick: () => this.onTabClick(tab) },
                img,
                React.createElement("div", null, tab.title));
        }));
        let titleBar;
        if (header !== false)
            titleBar = React.createElement(TitleBar, { close: close, center: cur.header || cur.title, right: right });
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
        const { close, header, right, onScroll, onScrollTop, onScrollBottom, children } = this.props;
        let titleBar;
        if (header !== false)
            titleBar = React.createElement(TitleBar, { close: close, center: header, right: right });
        return (React.createElement("article", { className: 'page-container' },
            titleBar,
            React.createElement("section", null,
                React.createElement(ScrollView, { onScroll: onScroll, onScrollTop: onScrollTop, onScrollBottom: onScrollBottom }, children)),
            footer));
    }
    render() {
        const { close, header, right, footer, onScroll, onScrollTop, onScrollBottom, children } = this.props;
        let elFooter;
        if (footer !== undefined)
            elFooter = React.createElement("footer", null, footer);
        if (this.tabs !== undefined)
            return this.renderTabs(elFooter);
        else
            return this.renderSingle(elFooter);
    }
}
//# sourceMappingURL=page.js.map