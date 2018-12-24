import * as React from 'react';
import {observable} from 'mobx';
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
    //onSubmit?: FormButtonClick;
    Container?: (content:JSX.Element) => JSX.Element;
    FieldContainer?: (label:string|JSX.Element, content:JSX.Element) => JSX.Element;
    FieldClass?: string;
    ArrContainer?: (label:any, content:JSX.Element) => JSX.Element;
    RowContainer?: (content:JSX.Element) => JSX.Element;
    //ArrFieldContainer?: (itemName:string, content:JSX.Element, context:RowContext) => JSX.Element;
    ButtonClass?: string;
    RowSeperator?: JSX.Element;
    fieldLabelSize?: 2;                 // col-sm-2 for label
    requiredFlag?: boolean;             // default=true
    beforeShow?: (formContext:FormContext) => void;
    res?: FormRes;
}

export class Form extends React.Component<FormProps> {
    readonly schema: Schema;
    readonly itemSchemas: {[name:string]: ItemSchema};
    readonly uiSchema: UiSchema;
    readonly Container: (content:JSX.Element) => JSX.Element;
    readonly FieldContainer: (label:any, content:JSX.Element) => JSX.Element;
    readonly FieldClass: string;
    readonly ArrContainer: (label:any, content:JSX.Element) => JSX.Element;
    readonly RowContainer: (content:JSX.Element) => JSX.Element;
    //readonly ArrFieldContainer: (label:any, content:JSX.Element, context:RowContext) => JSX.Element;
    readonly ButtonClass: string;
    readonly RowSeperator: JSX.Element;
    readonly res?: FormRes;
    protected formContext: FormContext;
    private content: any;
    @observable readonly data:any;

    constructor(props:FormProps) {
        super(props);
        let {schema, uiSchema, formData, 
            Container, FieldContainer, FieldClass, 
            ArrContainer, RowContainer, //ArrFieldContainer, 
            ButtonClass, RowSeperator,
            res,
        } = props;
        this.Container = Container || this.DefaultContainer;
        this.FieldContainer = FieldContainer || this.DefaultFieldContainer;
        this.FieldClass = FieldClass!==undefined && FieldClass!==''&&FieldClass!==null? FieldClass : this.DefaultFieldClass;
        this.ArrContainer = ArrContainer || this.DefaultArrContainer;
        this.RowContainer = RowContainer || this.DefaultRowContainer;
        //this.ArrFieldContainer = ArrFieldContainer || this.DefaultArrFieldContainer;
        this.res = res || this.DefaultRes;
        this.ButtonClass = ButtonClass || this.DefaultButtonClass;
        this.RowSeperator = RowSeperator || this.DefaultRowSeperator;
        this.schema = schema;
        this.itemSchemas = {};
        this.uiSchema = uiSchema;
        this.data = {};
        if (formData === undefined) formData = {};
        for (let itemSchema of schema) {
            let {name, type} = itemSchema;
            this.itemSchemas[name] = itemSchema;
            if (type === 'button') {
            }
            else if (type === 'arr') {
                let arrItem:ArrSchema = itemSchema as ArrSchema;
                let {arr:arrItems} = arrItem;
                if (arrItems === undefined) continue;
                let arrDict = arrItem.itemSchemas = {};
                for (let item of arrItems) {
                    arrDict[item.name] = item;
                }
                let val:any[] = formData[name];
                if (val === undefined) val = [{}];
                else if (Array.isArray(val) === false) val = [val];
                let arr:any[] = [];
                for (let row of val) {
                    let r = {};
                    for (let item of arrItems) {
                        let {name:nm} = item;
                        let v = row[nm];
                        if (v === undefined) v = null;
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
        let inNode:boolean = this.props.children !== undefined || this.uiSchema && this.uiSchema.Templet !== undefined;
        //this.formContext = new FormContext(this, inNode);
        let {children} = this.props;
        //let content:JSX.Element; //, inNode:boolean;
        //let formContext: FormContext;
        if (children !== undefined) {
            //inNode = true;
            this.content = <>{children}</>;
            this.formContext = new FormContext(this, true);
        }
        else {
            let Templet: TempletType;
            if (this.uiSchema !== undefined) {
                Templet = this.uiSchema.Templet;
            }
            if (Templet !== undefined) {
                // inNode = true;
                this.content = typeof(Templet) === 'function'? Templet(this.context) : Templet;
                this.formContext = new FormContext(this, true);
            }
            else {
                // inNode = false;
                this.formContext = new FormContext(this, false);
                this.content = <>{this.schema.map((v, index) => {
                    return <React.Fragment key={index}>{factory(this.formContext, v, children)}</React.Fragment>
                })}</>;
            }
        }
    }

    componentDidMount() {
        let {beforeShow} = this.props;
        if (beforeShow !== undefined) beforeShow(this.formContext);
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
    /*
    protected DefaultArrFieldContainer = (itemName:string, content:JSX.Element, context:RowContext): JSX.Element => {
        return this.InnerFieldContainer(itemName, content, context);
    }*/
    protected DefaultFieldContainer = (label:string|JSX.Element, content:JSX.Element): JSX.Element => {
        //return this.InnerFieldContainer(itemName, content, context);
        let {fieldLabelSize} = this.props;
        if (fieldLabelSize > 0) {
            let labelCol = 'col-sm-' + fieldLabelSize;
            let fieldCol = 'col-sm-' + (12 - fieldLabelSize);
            return <div className="form-group row">
                {label===null? null:<label className={classNames(labelCol, 'col-form-label')}>{label}</label>}
                <div className={fieldCol}>{content}</div>
            </div>;
        }
        return <div className="form-group">
            {label===null? null:<label className="col-form-label">{label}</label>}
            {content}
        </div>;
    }
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
    protected DefaultFieldClass:string = undefined;
    protected DefaultArrContainer = (label:any, content:JSX.Element): JSX.Element => {
        return <div>
            <div className={classNames('small text-muted text-center bg-light py-1 px-3 mt-4 mb-1')}>{label}</div>
            {content}
        </div>;
    }
    protected DefaultRowContainer = (content:JSX.Element): JSX.Element => {
        //return <div className="row">{content}</div>;
        let cn = classNames({
            'py-3': true
        });
        return <div className={cn}>{content}</div>
    }
    protected DefaultButtonClass = 'text-center py-2';
    protected DefaultRowSeperator = <div className="border border-gray border-top" />;
    protected DefaultRes:FormRes = resLang<FormRes>(formRes);
}
