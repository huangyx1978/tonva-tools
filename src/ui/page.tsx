import * as React from 'react';
import {IComputedValue} from 'mobx';
import {observer} from 'mobx-react';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import {TitleBar} from './titleBar';

export interface ScrollProps {
    onScroll?: (e:any) => void;
    onScrollTop?: () => void;
    onScrollBottom?: () => void;
}
interface ScrollViewProps extends ScrollProps {
    className?: string;
}
const scrollTimeGap = 100;
class ScrollView extends React.Component<ScrollViewProps, null> {
    private bottomTime:number = 0;
    private topTime:number = 0;
    constructor(props) {
        super(props);
        this.onScroll = this.onScroll.bind(this);
    }
    onScroll(e) {
        if (this.props.onScroll) this.props.onScroll(e);
        let el = e.target as HTMLBaseElement;
        if (el.scrollTop < 30) {
            if (this.props.onScrollTop !== undefined) {
                let topTime = new Date().getTime();
                if (topTime-this.topTime > scrollTimeGap) {
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
        return (
            <main className={this.props.className} onScroll={this.onScroll}>
                {this.props.children}
            </main>
        );
    }
}

export interface Tab extends ScrollProps {
    title: string;
    icon?: string;
    content?: JSX.Element;
    header?: string;
    isSelected?: boolean;
    redDot?: IComputedValue<number>;
}
export interface TabState extends Tab {
    isMounted?: boolean;
}
export interface PageProps extends ScrollProps {
    back?: 'close' | 'back' | 'none';
    header?: boolean | string | JSX.Element;
    keepHeader?: boolean;
    right?: JSX.Element;
    footer?: JSX.Element;
    tabs?: Tab[];
    logout?: ()=>void;
}
export interface PageState {
    cur?: Tab;
    tabs?: TabState[];
}

@observer
export class Page extends React.Component<PageProps, PageState> {
    private tabs:TabState[];
    constructor(props: PageProps) {
        super(props);
        this.tabs = props.tabs;
        if (this.tabs === undefined || this.tabs.length === 0) return;
        let cur:Tab;
        let tabs:Tab[] = [];
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

    private onTabClick(tab: Tab) {
        if (tab.isSelected === true) return;
        let cur:Tab;
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

    private renderTabs(footer: JSX.Element) {
        const {header, back, right, keepHeader} = this.props;
        let cur = this.state.cur;
        let tabs = <div>{
                this.state.tabs.map((tab, index) => {
                    const {icon, isSelected, title, redDot} = tab;
                    let img, redDotView, cn;
                    if (icon !== undefined) img = <img src={icon} />;
                    if (redDot !== undefined) {
                        let v = redDot.get();
                        if (v < 0) {
                            cn = classNames('red-dot');
                            redDotView = <u />;
                        }
                        else if (v > 0) {
                            cn = classNames('red-dot', 'num');
                            redDotView = <u>{v}</u>;
                        }
                    }
                    return <div key={index}
                        className= {classNames('va-tab', {cur: isSelected})}
                        onClick={() => this.onTabClick(tab)}>
                        {img}<div className={cn}>{title}{redDotView}</div>
                    </div>
                })
            }</div>;
        let titleBar;
        if (header !== false) {
            titleBar = <TitleBar 
                back={back} 
                center={keepHeader===true? (header as string) : (cur.header || cur.title)}
                right={right} 
            />;
        }

        return <article className='page-container'>
            {titleBar}
            <section>
            {
                this.state.tabs.map((tab, index) => {
                    if (tab.isSelected === true || tab.isMounted === true) {
                        tab.isMounted = true;
                        return <ScrollView key={index}
                            className={classNames({invisible: tab.isSelected===false})}
                            onScroll={tab.onScroll}
                            onScrollTop={tab.onScrollTop}
                            onScrollBottom={tab.onScrollBottom}
                        >
                            {tab.content}
                        </ScrollView>;
                    }
                })
            }
            </section>
            {tabs}
            {footer}
        </article>;
    }
    private renderSingle(footer: JSX.Element) {
        const {back, header, right, onScroll, onScrollTop, onScrollBottom, children} = this.props;
        let titleBar;
        if (header !== false)
            titleBar = <TitleBar 
                back={back} 
                center={header as any}
                right={right}
                logout={this.props.logout}
            />;
        return (
            <article className='page-container'>
                {titleBar}
                <section>
                    <ScrollView
                        onScroll={onScroll}
                        onScrollTop={onScrollTop}
                        onScrollBottom={onScrollBottom}
                    >
                        {children}
                    </ScrollView>
                </section>
                {footer}
            </article>
        );
    }

    render() {
        const {back, header, right,
            footer, 
            onScroll, onScrollTop, onScrollBottom, 
            children} = this.props;
        let elFooter;
        if (footer !== undefined) elFooter = <footer>{footer}</footer>;
        if (this.tabs !== undefined)
            return this.renderTabs(elFooter);
        else
            return this.renderSingle(elFooter);
    }
}
