var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { observable } from 'mobx';
import classNames from 'classnames';
import { factory } from './widgets';
import 'font-awesome/css/font-awesome.min.css';
import { ContextContainer, FormContext } from './context';
export class Form extends React.Component {
    constructor(props) {
        super(props);
        this.DefaultContainer = (content) => {
            return React.createElement("form", { className: classNames(this.props.className) }, content);
        };
        /*
        protected DefaultArrFieldContainer = (itemName:string, content:JSX.Element, context:RowContext): JSX.Element => {
            return this.InnerFieldContainer(itemName, content, context);
        }*/
        this.DefaultFieldContainer = (label, content) => {
            //return this.InnerFieldContainer(itemName, content, context);
            let { fieldLabelSize } = this.props;
            if (fieldLabelSize > 0) {
                let labelCol = 'col-sm-' + fieldLabelSize;
                let fieldCol = 'col-sm-' + (12 - fieldLabelSize);
                return React.createElement("div", { className: "form-group row" },
                    label === null ? null : React.createElement("label", { className: classNames(labelCol, 'col-form-label') }, label),
                    React.createElement("div", { className: fieldCol }, content));
            }
            return React.createElement("div", { className: "form-group" },
                label === null ? null : React.createElement("label", { className: "col-form-label" }, label),
                content);
        };
        /*
        private InnerFieldContainer = (itemName:string, content:JSX.Element, context:Context): JSX.Element => {
            let itemSchema = context.getItemSchema(itemName);
            let {required} = itemSchema;
            let ui = context.getUiItem(itemName);
            let label:string;
            if (ui === undefined) {
                label = itemName;
            }
            else {
                label = ui.label || itemName;
            }
            return <div className="form-group">
                <label>{label}&nbsp;{required===true&&<span className="text-danger">*</span>}</label>
                {content}
            </div>;
        }
        */
        this.DefaultFieldClass = undefined;
        this.DefaultArrContainer = (label, content) => {
            return React.createElement("div", null,
                React.createElement("div", { className: classNames('small text-muted text-center bg-light py-1 px-3 mt-4 mb-1') }, label),
                content);
        };
        this.DefaultRowContainer = (content) => {
            //return <div className="row">{content}</div>;
            let cn = classNames({
                'py-3': true
            });
            return React.createElement("div", { className: cn }, content);
        };
        this.DefaultButtonClass = 'text-center py-2';
        this.DefaultRowSeperator = React.createElement("div", { className: "border border-gray border-top" });
        let { schema, uiSchema, formData, Container, FieldContainer, FieldClass, ArrContainer, RowContainer, //ArrFieldContainer, 
        ButtonClass, RowSeperator } = props;
        this.Container = Container || this.DefaultContainer;
        this.FieldContainer = FieldContainer || this.DefaultFieldContainer;
        this.FieldClass = FieldClass !== undefined && FieldClass !== '' && FieldClass !== null ? FieldClass : this.DefaultFieldClass;
        this.ArrContainer = ArrContainer || this.DefaultArrContainer;
        this.RowContainer = RowContainer || this.DefaultRowContainer;
        //this.ArrFieldContainer = ArrFieldContainer || this.DefaultArrFieldContainer;
        this.ButtonClass = ButtonClass || this.DefaultButtonClass;
        this.RowSeperator = RowSeperator || this.DefaultRowSeperator;
        this.schema = schema;
        this.itemSchemas = {};
        this.uiSchema = uiSchema;
        this.data = {};
        if (formData === undefined)
            formData = {};
        for (let itemSchema of schema) {
            let { name, type } = itemSchema;
            this.itemSchemas[name] = itemSchema;
            if (type === 'button') {
            }
            else if (type === 'arr') {
                let arrItem = itemSchema;
                let { arr: arrItems } = arrItem;
                if (arrItems === undefined)
                    continue;
                let arrDict = arrItem.itemSchemas = {};
                for (let item of arrItems) {
                    arrDict[item.name] = item;
                }
                let val = formData[name];
                if (val === undefined)
                    val = [{}];
                else if (Array.isArray(val) === false)
                    val = [val];
                let arr = [];
                for (let row of val) {
                    let r = {};
                    for (let item of arrItems) {
                        let { name: nm } = item;
                        let v = row[nm];
                        if (v === undefined)
                            v = null;
                        r[nm] = v;
                    }
                    arr.push(r);
                }
                this.data[name] = observable(arr);
            }
            else {
                this.data[name] = formData[name];
            }
        }
        let inNode = this.props.children !== undefined || this.uiSchema && this.uiSchema.Templet !== undefined;
        //this.formContext = new FormContext(this, inNode);
        let { children } = this.props;
        //let content:JSX.Element; //, inNode:boolean;
        //let formContext: FormContext;
        if (children !== undefined) {
            //inNode = true;
            this.content = React.createElement(React.Fragment, null, children);
            this.formContext = new FormContext(this, true);
        }
        else {
            let Templet;
            if (this.uiSchema !== undefined) {
                Templet = this.uiSchema.Templet;
            }
            if (Templet !== undefined) {
                // inNode = true;
                this.content = typeof (Templet) === 'function' ? Templet(this.context) : Templet;
                this.formContext = new FormContext(this, true);
            }
            else {
                // inNode = false;
                this.formContext = new FormContext(this, false);
                this.content = React.createElement(React.Fragment, null, this.schema.map((v, index) => {
                    return React.createElement(React.Fragment, { key: index }, factory(this.formContext, v, children));
                }));
            }
        }
    }
    componentDidMount() {
        let { beforeShow } = this.props;
        if (beforeShow !== undefined)
            beforeShow(this.formContext);
    }
    render() {
        /*
        let {children} = this.props;
        let content:JSX.Element; //, inNode:boolean;
        //let formContext: FormContext;
        if (children !== undefined) {
            //inNode = true;
            content = <>{children}</>;
            //this.formContext = formContext = new FormContext(this, inNode);
        }
        else {
            let Templet: React.StatelessComponent|JSX.Element;
            if (this.uiSchema !== undefined) {
                Templet = this.uiSchema.Templet;
            }
            if (Templet !== undefined) {
                // inNode = true;
                content = typeof(Templet) === 'function'? <Templet /> : Templet;
                //this.formContext = formContext = new FormContext(this, inNode);
            }
            else {
                // inNode = false;
                //this.formContext = formContext = new FormContext(this, inNode);
                content = <>{this.schema.map((v, index) => {
                    return <React.Fragment key={index}>{factory(this.formContext, v, children)}</React.Fragment>
                })}</>;
            }
        }*/
        return React.createElement(ContextContainer.Provider, { value: this.formContext },
            React.createElement(this.formContext.renderErrors, null),
            this.Container(this.content));
    }
}
__decorate([
    observable
], Form.prototype, "data", void 0);
//# sourceMappingURL=form.js.map