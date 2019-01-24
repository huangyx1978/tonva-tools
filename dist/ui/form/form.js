import * as React from 'react';
import { observable, isObservable } from 'mobx';
import classNames from 'classnames';
import { factory } from './widgets';
import 'font-awesome/css/font-awesome.min.css';
import { ContextContainer, FormContext } from './context';
import { formRes } from './formRes';
import { resLang } from '../res';
export class Form extends React.Component {
    constructor(props) {
        super(props);
        this.DefaultContainer = (content) => {
            return React.createElement("form", { className: classNames(this.props.className) }, content);
        };
        this.DefaultFieldContainer = (label, content) => {
            let { fieldLabelSize } = this.props;
            if (fieldLabelSize > 0) {
                let labelView;
                if (label === null) {
                    fieldLabelSize = 0;
                }
                else {
                    labelView = React.createElement("label", { className: classNames('col-sm-' + fieldLabelSize, 'col-form-label') }, label);
                }
                let fieldCol = 'col-sm-' + (12 - fieldLabelSize);
                return React.createElement("div", { className: "form-group row" },
                    labelView,
                    React.createElement("div", { className: fieldCol }, content));
            }
            return React.createElement("div", { className: "form-group" },
                label === null ? null : React.createElement("label", { className: "col-form-label" }, label),
                content);
        };
        this.DefaultFieldClass = undefined;
        this.DefaultButtonClass = 'text-center py-2';
        this.DefaultRes = resLang(formRes);
        this.ArrContainer = (label, content) => {
            return React.createElement("div", null,
                React.createElement("div", { className: classNames('small text-muted text-center bg-light py-1 px-3 mt-4 mb-1') }, label),
                content);
        };
        this.RowContainer = (content) => {
            let cn = classNames({
                'py-3': true
            });
            return React.createElement("div", { className: cn }, content);
        };
        this.RowSeperator = React.createElement("div", { className: "border border-gray border-top" });
        let { schema, uiSchema, formData, Container, FieldContainer, FieldClass, ButtonClass, res, } = props;
        this.Container = Container || this.DefaultContainer;
        this.FieldContainer = FieldContainer || this.DefaultFieldContainer;
        this.FieldClass = FieldClass !== undefined && FieldClass !== '' && FieldClass !== null ? FieldClass : this.DefaultFieldClass;
        this.res = res || this.DefaultRes;
        this.ButtonClass = ButtonClass || this.DefaultButtonClass;
        this.schema = schema;
        this.itemSchemas = {};
        for (let itemSchema of this.schema) {
            this.itemSchemas[itemSchema.name] = itemSchema;
        }
        this.uiSchema = uiSchema;
        //this.inData = formData;
        if (formData === undefined) {
            formData = {};
        }
        else if (isObservable(formData) === true) {
            this.data = formData;
        }
        if (this.data === undefined)
            this.data = observable({});
        this.initData(formData);
        let { children } = this.props;
        if (children !== undefined) {
            this.content = React.createElement(React.Fragment, null, children);
            this.formContext = new FormContext(this, true);
        }
        else {
            let Templet;
            if (this.uiSchema !== undefined) {
                Templet = this.uiSchema.Templet;
            }
            if (Templet !== undefined) {
                this.content = typeof (Templet) === 'function' ? Templet(this.data) : Templet;
                this.formContext = new FormContext(this, true);
            }
            else {
                this.formContext = new FormContext(this, false);
                this.content = React.createElement(React.Fragment, null, this.schema.map((v, index) => {
                    return React.createElement(React.Fragment, { key: index }, factory(this.formContext, v, children));
                }));
            }
        }
        //this.disposer = autorun(this.onItemValueChanged);
    }
    initData(formData) {
        for (let itemSchema of this.schema) {
            this.initDataItem(itemSchema, this.data, formData);
        }
    }
    initDataItem(itemSchema, data, formData) {
        let { name, type } = itemSchema;
        if (type === 'button')
            return;
        if (type === 'arr') {
            let arrItem = itemSchema;
            let { arr: arrItems } = arrItem;
            if (arrItems === undefined)
                return;
            let arrDict = arrItem.itemSchemas = {};
            for (let item of arrItems) {
                arrDict[item.name] = item;
            }
            let val = formData[name];
            if (val === undefined)
                val = [];
            else if (Array.isArray(val) === false)
                val = [val];
            let arr = data[name];
            if (arr === undefined) {
                data[name] = [];
                arr = data[name];
                for (let row of val) {
                    /*
                    let {$isSelected, $isDeleted} = row;
                    let r = {
                        $source: row,
                        $isSelected: $isSelected,
                        $isDeleted: $isDeleted,
                    };
                    */
                    let r = {};
                    for (let item of arrItems) {
                        this.initDataItem(item, r, row);
                    }
                    arr.push(r);
                }
            }
            else {
                for (let row of val) {
                    for (let item of arrItems) {
                        this.initDataItem(item, row, row);
                    }
                }
            }
            //data[name] = arr;
            return;
        }
        if (data[name] === undefined)
            data[name] = formData[name];
    }
    /*
    private onItemValueChanged = () => {
        for (let itemSchema of this.schema) {
            this.itemChanged(itemSchema, this.data, this.inData);
        }
    }*/
    itemChanged(itemSchema, data, inData) {
        if (data === undefined || inData === undefined)
            return;
        let { name, type } = itemSchema;
        if (type !== 'arr') {
            data[name] = inData[name];
            return;
        }
        //let arrVal = this.formData[name];
        //if (arrVal === undefined) return;
        let formArrVal = data[name];
        if (formArrVal === undefined)
            return;
        let { arr: arrItems } = itemSchema;
        for (let row of formArrVal) {
            let { $source } = row;
            if ($source === undefined)
                continue;
            let { $isSelected, $isDeleted } = $source;
            row.$isSelected = $isSelected;
            row.$isDeleted = $isDeleted;
            //console.log($isSelected, $isDeleted);
            for (let item of arrItems) {
                this.itemChanged(item, row, $source);
            }
        }
    }
    componentDidMount() {
        let { beforeShow } = this.props;
        if (beforeShow !== undefined)
            beforeShow(this.formContext);
    }
    componentWillUnmount() {
        //this.disposer();
    }
    render() {
        return React.createElement(ContextContainer.Provider, { value: this.formContext },
            React.createElement(this.formContext.renderErrors, null),
            this.Container(this.content));
    }
}
//# sourceMappingURL=form.js.map