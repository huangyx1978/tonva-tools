import * as React from 'react';
import {observable, IReactionDisposer, autorun, isObservable} from 'mobx';
import classNames from 'classnames';
import { Schema, ItemSchema, ArrSchema } from './schema';
import { UiSchema, TempletType } from './uiSchema';
import { factory } from './widgets';
import 'font-awesome/css/font-awesome.min.css';
import { ContextContainer, FormContext, Context, RowContext } from './context';
import { FormRes, formRes } from './formRes';
import { resLang } from '../res';

export type FormButtonClick = (name:string, context: Context) => Promise<any>;

export interface FormProps {
    className?: string;
    schema: Schema;
    uiSchema?: UiSchema;
    formData?: any;
    onButtonClick?: FormButtonClick;
    fieldLabelSize?: number;            // col-sm-2 for label
    requiredFlag?: boolean;             // default=true
    beforeShow?: (formContext:FormContext) => void;
    res?: FormRes;

    Container?: (content:JSX.Element) => JSX.Element;
    FieldContainer?: (label:string|JSX.Element, content:JSX.Element) => JSX.Element;
    FieldClass?: string;
    ButtonClass?: string;
}

export class Form extends React.Component<FormProps> {
    readonly schema: Schema;
    readonly itemSchemas: {[name:string]: ItemSchema};
    readonly uiSchema: UiSchema;
    readonly res?: FormRes;
    protected formContext: FormContext;
    private content: any;
    //private inData: any;
    //private disposer: IReactionDisposer;
    readonly data:any;

    readonly Container: (content:JSX.Element) => JSX.Element;
    readonly FieldContainer: (label:any, content:JSX.Element) => JSX.Element;
    readonly FieldClass: string;
    readonly ButtonClass: string;

    constructor(props:FormProps) {
        super(props);
        let {schema, uiSchema, formData,
            Container, FieldContainer, FieldClass, 
            ButtonClass, 
            res,
        } = props;
        this.Container = Container || this.DefaultContainer;
        this.FieldContainer = FieldContainer || this.DefaultFieldContainer;
        this.FieldClass = FieldClass!==undefined && FieldClass!==''&&FieldClass!==null? FieldClass : this.DefaultFieldClass;
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
        if (this.data === undefined) this.data = observable({});
        this.initData(formData);

        let {children} = this.props;
        if (children !== undefined) {
            this.content = <>{children}</>;
            this.formContext = new FormContext(this, true);
        }
        else {
            let Templet: TempletType;
            if (this.uiSchema !== undefined) {
                Templet = this.uiSchema.Templet;
            }
            if (Templet !== undefined) {
                this.content = typeof(Templet) === 'function'? Templet(this.data) : Templet;
                this.formContext = new FormContext(this, true);
            }
            else {
                this.formContext = new FormContext(this, false);
                this.content = <>{this.schema.map((v, index) => {
                    return <React.Fragment key={index}>{factory(this.formContext, v, children)}</React.Fragment>
                })}</>;
            }
        }

        //this.disposer = autorun(this.onItemValueChanged);
    }

    private initData(formData: any) {
        for (let itemSchema of this.schema) {
            this.initDataItem(itemSchema, this.data, formData);
        }
    }

    private initDataItem(itemSchema: ItemSchema, data:any, formData: any):any {
        let {name, type} = itemSchema;
        if (type === 'button') return;
        if (type === 'arr') {
            let arrItem:ArrSchema = itemSchema as ArrSchema;
            let {arr:arrItems} = arrItem;
            if (arrItems === undefined) return;
            let arrDict = arrItem.itemSchemas = {};
            for (let item of arrItems) {
                arrDict[item.name] = item;
            }
            let val:any[] = formData[name];
            if (val === undefined) val = [];
            else if (Array.isArray(val) === false) val = [val];
            let arr:any[] = data[name];
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
        if (data[name] === undefined) data[name] = formData[name];
    }

    /*
    private onItemValueChanged = () => {
        for (let itemSchema of this.schema) {
            this.itemChanged(itemSchema, this.data, this.inData);
        }
    }*/

    private itemChanged(itemSchema: ItemSchema, data:any, inData:any) {
        if (data === undefined || inData === undefined) return;
        let {name, type} = itemSchema;
        if (type !== 'arr') {
            data[name] = inData[name];
            return;
        }
        //let arrVal = this.formData[name];
        //if (arrVal === undefined) return;
        let formArrVal = data[name];
        if (formArrVal === undefined) return;
        let {arr: arrItems} = itemSchema as ArrSchema;
        for (let row of formArrVal) {
            let {$source} = row;
            if ($source === undefined) continue;
            let {$isSelected, $isDeleted} = $source;
            row.$isSelected = $isSelected;
            row.$isDeleted = $isDeleted;
            //console.log($isSelected, $isDeleted);
            for (let item of arrItems) {
                this.itemChanged(item, row, $source);
            }
        }
    }

    componentDidMount() {
        let {beforeShow} = this.props;
        if (beforeShow !== undefined) beforeShow(this.formContext);
    }

    componentWillUnmount() {
        //this.disposer();
    }

    render() {
        return <ContextContainer.Provider value={this.formContext}>
            <this.formContext.renderErrors />
            {this.Container(this.content)}
        </ContextContainer.Provider>;
    }

    protected DefaultContainer = (content:JSX.Element): JSX.Element => {
        return <form className={classNames(this.props.className)}>
            {content}
        </form>;
    }

    protected DefaultFieldContainer = (label:string|JSX.Element, content:JSX.Element): JSX.Element => {
        let {fieldLabelSize} = this.props;

        if (fieldLabelSize > 0) {
            let labelView:any;
            if (label === null) {
                fieldLabelSize = 0;
            }
            else {
                labelView = <label className={classNames('col-sm-' + fieldLabelSize, 'col-form-label')}>{label}</label>
            }
            let fieldCol = 'col-sm-' + (12 - fieldLabelSize);
            return <div className="form-group row">
                {labelView}
                <div className={fieldCol}>{content}</div>
            </div>;
        }
        return <div className="form-group">
            {label===null? null:<label className="col-form-label">{label}</label>}
            {content}
        </div>;
    }
    protected DefaultFieldClass:string = undefined;
    protected DefaultButtonClass = 'text-center py-2';
    protected DefaultRes:FormRes = resLang<FormRes>(formRes);

    ArrContainer = (label:any, content:JSX.Element): JSX.Element => {
        return <div>
            <div className={classNames('small text-muted text-center bg-light py-1 px-3 mt-4 mb-1')}>{label}</div>
            {content}
        </div>;
    }
    RowContainer = (content:JSX.Element): JSX.Element => {
        let cn = classNames({
            'py-3': true
        });
        return <div className={cn}>{content}</div>
    }
    RowSeperator = <div className="border border-gray border-top" />;
}
