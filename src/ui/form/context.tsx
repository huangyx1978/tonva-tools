import * as React from 'react';
import { Form } from './form';
import { UiSchema, UiArr, UiItem } from './uiSchema';
import { ArrSchema, ItemSchema } from './schema';
import { Widget as Widget } from './widgets/widget';
import { ArrRow } from './arrRow';
import { observable, computed } from 'mobx';
import { ContextRule } from './rules';
import { observer } from 'mobx-react';

export abstract class Context {    
    readonly form: Form;
    readonly uiSchema: UiSchema;
    readonly data: any;
    readonly inNode: boolean;           // true: 在</> 流中定义Field
    readonly widgets: {[name:string]: Widget} = {};
    readonly rules: ContextRule[];
    @observable errors: string[] = [];
    @observable errorWidgets:Widget[] = [];

    constructor(form: Form, uiSchema: UiSchema, data: any, inNode: boolean) {
        this.form = form;
        this.uiSchema = uiSchema;
        this.data = data;
        this.inNode = inNode;
        if (uiSchema !== undefined) {
            let {rules} = uiSchema;
            if (rules !== undefined) {
                this.rules = [];
                if (Array.isArray(rules) === false)
                    this.rules.push(rules as ContextRule);
                else
                    this.rules.push(...rules as ContextRule[]);
            }
        }
    }

    abstract get isRow():boolean;
    abstract getItemSchema(itemName:string):ItemSchema;
    abstract getUiItem(itemName:string):UiItem;
    get arrName():string {return undefined}
    getValue(itemName:string):any {return this.data[itemName]}
    setValue(itemName:string, value:any) {
        this.data[itemName] = value;
        let widget = this.widgets[itemName];
        if (widget !== undefined) widget.setValue(value);
    }
    getDisabled(itemName:string):boolean {
        let widget = this.widgets[itemName];
        if (widget !== undefined) return widget.getDisabled();
        return undefined;
    }
    setDisabled(itemName:string, value:boolean) {
        let widget = this.widgets[itemName];
        if (widget !== undefined) widget.setDisabled(value);
    }
    getReadOnly(itemName:string):boolean {
        let widget = this.widgets[itemName];
        if (widget !== undefined) widget.getReadOnly();
        return undefined;
    }
    setReadOnly(itemName:string, value:boolean) {
        let widget = this.widgets[itemName];
        if (widget !== undefined) widget.setReadOnly(value);
    }
    getVisible(itemName:string):boolean {
        let widget = this.widgets[itemName];
        if (widget !== undefined) widget.getVisible();
        return undefined;
    }
    setVisible(itemName:string, value:boolean) {
        let widget = this.widgets[itemName];
        if (widget !== undefined) widget.setVisible(value);
    }

    checkFieldRules() {
        for (let i in this.widgets) {
            this.widgets[i].checkRules();
        }
    }

    checkContextRules() {
        if (this.rules === undefined) return;
        this.clearContextErrors();
        for (let rule of this.rules) {
            let ret = rule(this);
            if (ret === undefined) continue;
            if (Array.isArray(ret) === true) {
                this.errors.push(...ret as string[]);
            }
            else if (typeof ret === 'string') {
                this.errors.push(ret as string);
            }
            else {
                for (let i in ret as object) this.setError(i, ret[i]);
            }
        }
    }

    setError(itemName:string, error:string) {
        let widget = this.widgets[itemName];
        if (widget === undefined) return;
        widget.setContextError(error);
        this.addErrorWidget(widget);
    }

    clearContextErrors() {
        for (let i in this.widgets) this.widgets[i].clearContextError();
    }

    checkRules() {
        this.checkFieldRules();
        this.checkContextRules();
    }

    addErrorWidget(widget:Widget) {
        let pos = this.errorWidgets.findIndex(v => v === widget);
        if (pos < 0) this.errorWidgets.push(widget);
    }
    removeErrorWidget(widget:Widget) {
        let pos = this.errorWidgets.findIndex(v => v === widget);
        if (pos >= 0) this.errorWidgets.splice(pos, 1);
    }

    protected checkHasError():boolean {
        return (this.errorWidgets.length + this.errors.length) > 0
    }

    @computed get hasError():boolean {
        return this.checkHasError();
    };

    removeErrors() {
        this.errors.splice(0);
        this.errorWidgets.splice(0);
        for (let i in this.widgets) {
            let widget = this.widgets[i];
            if (widget === undefined) continue;
            widget.clearContextError();
        }
    }

    renderErrors = observer((): JSX.Element => {
        let {errors} = this;
        if (errors.length === 0) return null;
        return <>
            {errors.map(err => <span key={err} className="text-danger inline-block my-1 ml-3">
                <i className="fa fa-exclamation-circle" /> &nbsp;{err}
            </span>)}
        </>
    });
}

export class RowContext extends Context {
    readonly formContext: FormContext;
    readonly arrSchema: ArrSchema;
    readonly uiSchema: UiArr;
    readonly row: ArrRow;
    constructor(formContext:FormContext, arrSchema: ArrSchema, data: any, inNode: boolean, row:ArrRow) {
        let uiArr:UiArr;
        let {form} = formContext;
        let {uiSchema} = form;
        if (uiSchema !== undefined) {
            let {items} = uiSchema;
            if (items !== undefined) uiArr = items[arrSchema.name] as UiArr;
        }
        super(formContext.form, uiArr, data, inNode);
        this.formContext = formContext;
        this.arrSchema = arrSchema;
        this.row = row;
    }
    get isRow():boolean {return true};
    getItemSchema(itemName:string):ItemSchema {return this.arrSchema.itemSchemas[itemName]}
    getUiItem(itemName:string):UiItem {
        if (this.uiSchema === undefined) return undefined;
        let {items} = this.uiSchema;
        if (items === undefined) return undefined;
        return items[itemName]
    }
    get arrName():string {return this.arrSchema.name}
}

export class FormContext extends Context {
    rowContexts:{[name:string]:{[rowKey:string]:RowContext}} = {};
    constructor(form:Form, inNode:boolean) {
        super(form, form.uiSchema, form.data, inNode);
    }
    get isRow():boolean {return false};
    getItemSchema(itemName:string):ItemSchema {return this.form.itemSchemas[itemName]}
    getUiItem(itemName:string):UiItem {
        let {uiSchema} = this.form;
        if (uiSchema === undefined) return undefined;
        let {items} = uiSchema;
        if (items === undefined) return undefined;
        return items[itemName]
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
    @computed get hasError():boolean {
        if (super.checkHasError() === true) return true;
        for (let i in this.rowContexts) {
            let arrRowContexts = this.rowContexts[i];
            for (let j in arrRowContexts) {
                if (arrRowContexts[j].hasError === true) return true;
            }
        }
        return false;
    };
}

export const ContextContainer = React.createContext<Context>({} as any);
