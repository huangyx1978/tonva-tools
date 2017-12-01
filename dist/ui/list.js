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
let ListView = class ListView extends React.Component {
    render() {
        let { header, items, unload, none, mapper, className, footer } = this.props;
        let content, elHeader;
        if (items === undefined)
            content = React.createElement("li", { className: 'empty' }, unload || '...');
        else if (items.length === 0) {
            content = (React.createElement("li", { className: 'empty' }, none || '[none]'));
        }
        else {
            content = items.map((item, index) => mapper(item, index, this.props.ex));
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
            React.createElement("ul", { className: classNames('list', className) }, content),
            footer));
    }
};
ListView = __decorate([
    mobx_react_1.observer
], ListView);
exports.ListView = ListView;
//# sourceMappingURL=list.js.map