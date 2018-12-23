var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';
export class Context {
    constructor(form, uiSchema, data, inNode) {
        this.widgets = {};
        this.errors = [];
        this.errorWidgets = [];
        this.renderErrors = observer(() => {
            let { errors } = this;
            if (errors.length === 0)
                return null;
            return React.createElement(React.Fragment, null, errors.map(err => React.createElement("span", { key: err, className: "text-danger inline-block my-1 ml-3" },
                React.createElement("i", { className: "fa fa-exclamation-circle" }),
                " \u00A0",
                err)));
        });
        this.form = form;
        this.uiSchema = uiSchema;
        this.data = data;
        this.inNode = inNode;
        if (uiSchema !== undefined) {
            let { rules } = uiSchema;
            if (rules !== undefined) {
                this.rules = [];
                if (Array.isArray(rules) === false)
                    this.rules.push(rules);
                else
                    this.rules.push(...rules);
            }
        }
    }
    get arrName() { return undefined; }
    getValue(itemName) { return this.data[itemName]; }
    setValue(itemName, value) {
        this.data[itemName] = value;
        let widget = this.widgets[itemName];
        if (widget !== undefined)
            widget.setValue(value);
    }
    getDisabled(itemName) {
        let widget = this.widgets[itemName];
        if (widget !== undefined)
            return widget.getDisabled();
        return undefined;
    }
    setDisabled(itemName, value) {
        let widget = this.widgets[itemName];
        if (widget !== undefined)
            widget.setDisabled(value);
    }
    getReadOnly(itemName) {
        let widget = this.widgets[itemName];
        if (widget !== undefined)
            widget.getReadOnly();
        return undefined;
    }
    setReadOnly(itemName, value) {
        let widget = this.widgets[itemName];
        if (widget !== undefined)
            widget.setReadOnly(value);
    }
    getVisible(itemName) {
        let widget = this.widgets[itemName];
        if (widget !== undefined)
            widget.getVisible();
        return undefined;
    }
    setVisible(itemName, value) {
        let widget = this.widgets[itemName];
        if (widget !== undefined)
            widget.setVisible(value);
    }
    checkFieldRules() {
        for (let i in this.widgets) {
            this.widgets[i].checkRules();
        }
    }
    checkContextRules() {
        if (this.rules === undefined)
            return;
        this.clearContextErrors();
        for (let rule of this.rules) {
            let ret = rule(this);
            if (ret === undefined)
                continue;
            if (Array.isArray(ret) === true) {
                this.errors.push(...ret);
            }
            else if (typeof ret === 'string') {
                this.errors.push(ret);
            }
            else {
                for (let i in ret)
                    this.setError(i, ret[i]);
            }
        }
    }
    setError(itemName, error) {
        let widget = this.widgets[itemName];
        if (widget === undefined)
            return;
        widget.setContextError(error);
        this.addErrorWidget(widget);
    }
    clearContextErrors() {
        for (let i in this.widgets)
            this.widgets[i].clearContextError();
    }
    checkRules() {
        this.checkFieldRules();
        this.checkContextRules();
    }
    addErrorWidget(widget) {
        let pos = this.errorWidgets.findIndex(v => v === widget);
        if (pos < 0)
            this.errorWidgets.push(widget);
    }
    removeErrorWidget(widget) {
        let pos = this.errorWidgets.findIndex(v => v === widget);
        if (pos >= 0)
            this.errorWidgets.splice(pos, 1);
    }
    checkHasError() {
        return (this.errorWidgets.length + this.errors.length) > 0;
    }
    get hasError() {
        return this.checkHasError();
    }
    ;
    removeErrors() {
        this.errors.splice(0);
        this.errorWidgets.splice(0);
        for (let i in this.widgets) {
            let widget = this.widgets[i];
            if (widget === undefined)
                continue;
            widget.clearContextError();
        }
    }
}
__decorate([
    observable
], Context.prototype, "errors", void 0);
__decorate([
    observable
], Context.prototype, "errorWidgets", void 0);
__decorate([
    computed
], Context.prototype, "hasError", null);
export class RowContext extends Context {
    constructor(formContext, arrSchema, data, inNode, row) {
        let uiArr;
        let { form } = formContext;
        let { uiSchema } = form;
        if (uiSchema !== undefined) {
            let { items } = uiSchema;
            if (items !== undefined)
                uiArr = items[arrSchema.name];
        }
        super(formContext.form, uiArr, data, inNode);
        this.formContext = formContext;
        this.arrSchema = arrSchema;
        this.row = row;
    }
    get isRow() { return true; }
    ;
    getItemSchema(itemName) { return this.arrSchema.itemSchemas[itemName]; }
    getUiItem(itemName) {
        if (this.uiSchema === undefined)
            return undefined;
        let { items } = this.uiSchema;
        if (items === undefined)
            return undefined;
        return items[itemName];
    }
    get arrName() { return this.arrSchema.name; }
}
export class FormContext extends Context {
    constructor(form, inNode) {
        super(form, form.uiSchema, form.data, inNode);
        this.rowContexts = {};
    }
    get isRow() { return false; }
    ;
    getItemSchema(itemName) { return this.form.itemSchemas[itemName]; }
    getUiItem(itemName) {
        let { uiSchema } = this.form;
        if (uiSchema === undefined)
            return undefined;
        let { items } = uiSchema;
        if (items === undefined)
            return undefined;
        return items[itemName];
    }
    checkFieldRules() {
        super.checkFieldRules();
        for (let i in this.rowContexts) {
            let arrRowContexts = this.rowContexts[i];
            for (let j in arrRowContexts) {
                arrRowContexts[j].checkFieldRules();
            }
        }
    }
    checkContextRules() {
        super.checkContextRules();
        for (let i in this.rowContexts) {
            let arrRowContexts = this.rowContexts[i];
            for (let j in arrRowContexts) {
                let rowContext = arrRowContexts[j];
                rowContext.removeErrors();
                rowContext.checkContextRules();
            }
        }
    }
    get hasError() {
        if (super.checkHasError() === true)
            return true;
        for (let i in this.rowContexts) {
            let arrRowContexts = this.rowContexts[i];
            for (let j in arrRowContexts) {
                if (arrRowContexts[j].hasError === true)
                    return true;
            }
        }
        return false;
    }
    ;
}
__decorate([
    computed
], FormContext.prototype, "hasError", null);
export const ContextContainer = React.createContext({});
//# sourceMappingURL=context.js.map