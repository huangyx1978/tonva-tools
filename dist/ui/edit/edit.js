var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { observer } from 'mobx-react';
import { StringItemEdit } from './stringItemEdit';
import { ImageItemEdit } from './imageItemEdit';
import { Image } from '../image';
let Edit = class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.defaultSepClassName = "border-top edit-sep-light-gray";
        this.defaultRowContainerClassName = "d-flex px-3 py-2 cursor-pointer bg-white align-items-center";
        this.rowClick = (itemSchema, uiItem, label, value) => __awaiter(this, void 0, void 0, function* () {
            let { onItemChanged, onItemClick } = this.props;
            let changeValue;
            if (onItemClick !== undefined) {
                yield onItemClick(itemSchema, uiItem, value);
                return;
            }
            let itemEdit = createItemEdit(itemSchema, uiItem, label, value);
            try {
                changeValue = yield itemEdit.start();
                if (changeValue != value) {
                    if (onItemChanged === undefined) {
                        alert(`${itemSchema.name} value changed, new: ${changeValue}, pre: ${value}`);
                    }
                    else {
                        yield onItemChanged(itemSchema, changeValue, value);
                    }
                }
                yield itemEdit.end();
            }
            catch (err) {
                console.log('no value changed');
            }
        });
        let { topBorderClassName, bottomBorderClassName, sepClassName, rowContainerClassName, uiSchema } = props;
        this.topBorder = React.createElement("div", { className: topBorderClassName || this.defaultSepClassName });
        this.bottomBorder = React.createElement("div", { className: bottomBorderClassName || this.defaultSepClassName });
        this.rowContainerClassName = rowContainerClassName || this.defaultRowContainerClassName;
        this.sep = React.createElement("div", { className: sepClassName || this.defaultSepClassName });
        this.uiSchema = (uiSchema && uiSchema.items) || {};
    }
    render() {
        let elItems = [];
        let { schema } = this.props;
        let len = schema.length;
        elItems.push(this.topBorder);
        for (let i = 0; i < len; i++) {
            if (i > 0)
                elItems.push(this.sep);
            elItems.push(this.renderRow(schema[i]));
        }
        elItems.push(this.bottomBorder);
        return React.createElement("div", null, elItems.map((v, index) => React.createElement(React.Fragment, { key: index }, v)));
    }
    renderRow(itemSchema) {
        let { name, type } = itemSchema;
        let divValue;
        let uiItem = this.uiSchema[name];
        let label = (uiItem && uiItem.label) || name;
        let value = this.props.data[name];
        switch (type) {
            default:
                divValue = value ? React.createElement("b", null, value) : React.createElement("small", { className: "text-muted" }, "(\u65E0)");
                break;
            case 'image':
                divValue = React.createElement(Image, { className: "w-4c h-4c", src: value });
                break;
        }
        return React.createElement("div", { className: this.rowContainerClassName, onClick: () => __awaiter(this, void 0, void 0, function* () { return yield this.rowClick(itemSchema, uiItem, label, value); }) },
            React.createElement("div", { className: "w-6c" }, label),
            React.createElement("div", { className: "flex-fill d-flex justify-content-end" }, divValue),
            React.createElement("div", { className: "w-2c text-right" },
                React.createElement("i", { className: "fa fa-chevron-right" })));
    }
};
Edit = __decorate([
    observer
], Edit);
export { Edit };
function createItemEdit(itemSchema, uiItem, label, value) {
    let itemEdit;
    if (uiItem !== undefined) {
        switch (uiItem.widget) {
            case 'text':
                itemEdit = StringItemEdit;
                break;
            case 'image':
                itemEdit = ImageItemEdit;
                break;
        }
    }
    else {
        switch (itemSchema.type) {
            case 'string':
                itemEdit = StringItemEdit;
                break;
            case 'image':
                itemEdit = ImageItemEdit;
                break;
        }
    }
    if (itemEdit === undefined)
        return;
    return new itemEdit(itemSchema, uiItem, label, value);
}
//# sourceMappingURL=edit.js.map