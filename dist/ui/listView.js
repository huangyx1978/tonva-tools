"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const classNames = require("classnames");
const mobx_react_1 = require("mobx-react");
const listRow_1 = require("./listRow");
let ListView = class ListView extends React.Component {
    render() {
        let { header, items, unload, none, renderRow, className, footer, itemClick, converter } = this.props;
        let cn = classNames(className, 'va-list');
        let content, elHeader;
        if (items === undefined)
            content = React.createElement("li", { className: 'empty' }, unload || '...');
        else if (items.length === 0) {
            content = (React.createElement("li", { className: 'empty' }, none || '[none]'));
        }
        else if (renderRow !== undefined) {
            content = items.map((item, index) => renderRow(item, index, this.props.ex));
        }
        else {
            content = items.map((item, index) => {
                let onClick;
                if (itemClick !== undefined)
                    onClick = () => itemClick(item);
                let listItem;
                if (converter !== undefined) {
                    listItem = converter(item);
                }
                else {
                    listItem = Object.assign({ key: item.key, onClick: onClick }, item);
                }
                return React.createElement(listRow_1.ListRow, Object.assign({ onClick: onClick }, listItem));
            });
        }
        if (header !== undefined) {
            if (typeof header === 'string') {
                elHeader = React.createElement("div", { className: 'va-list-header' }, header);
            }
            else {
                elHeader = header;
            }
        }
        return (React.createElement("div", { className: 'va-list' },
            elHeader,
            React.createElement("ul", { className: cn }, content),
            footer));
    }
};
ListView = __decorate([
    mobx_react_1.observer
], ListView);
exports.ListView = ListView;
//# sourceMappingURL=listView.js.map