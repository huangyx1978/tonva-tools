import * as React from 'react';
import {observer} from 'mobx-react';
import classNames from 'classnames';
import { Schema, ArrSchema, DataType, ButtonSchema, ItemSchema } from '../schema';
import { UiItem, UiArr, UiType, UiButton, TempletType } from '../uiSchema';
//import { ContextValue, FormContext, Form } from '../form';
import { TextWidget } from './textWidget';
import { Widget } from './widget';
import { TextAreaWidget } from './textareaWidget';
import { PasswordWidget, UrlWidget, EmailWidget } from './passwordWidget';
import { UpdownWidget } from './updownWidget';
import { NumberWidget } from './numberWidget';
import { DateWidget, DateTimeWidget, TimeWidget, MonthWidget } from './dateWidget';
import { CheckBoxWidget } from './checkBoxWidget';
import { FieldProps } from '../field';
import { ArrRow } from '../arrRow';
import { Context, RowContext, FormContext, ContextContainer } from '../context';
import { SelectWidget } from './selectWidget';
import { RadioWidget } from './radioWidget';
import { RangeWidget } from './rangeWidget';
import { IdWidget } from './idWidget';
import { ButtonWidget } from './buttonWidget';
import { Unknown } from './unknown';

type TypeWidget = new (context:Context, itemSchema:ItemSchema, fieldProps:FieldProps, children: React.ReactNode) => Widget;

const widgetsFactory: {[type: string]: {widget?: TypeWidget, dataTypes?: DataType[]}} = {
    id: {
        dataTypes: ['id'],
        widget: IdWidget,
    },
    text: {
        dataTypes: ['integer', 'number', 'string'],
        widget: TextWidget
    },
    textarea: {
        dataTypes: ['string'],
        widget: TextAreaWidget
    },
    password: {
        dataTypes: ['string'],
        widget: PasswordWidget
    },
    date: {
        dataTypes: ['date'],
        widget: DateWidget
    },
    datetime: {
        dataTypes: ['date'],
        widget: DateTimeWidget
    },
    time: {
        dataTypes: ['date'],
        widget: TimeWidget
    },
    month: {
        dataTypes: ['date'],
        widget: MonthWidget
    },
    select: {
        dataTypes: ['integer', 'number', 'string', 'date', 'boolean'],
        widget: SelectWidget
    },
    url: {
        dataTypes: ['string'],
        widget: UrlWidget
    },
    email: {
        dataTypes: ['string'],
        widget: EmailWidget
    },
    number: {
        dataTypes: ['integer', 'number'],
        widget: NumberWidget
    },
    updown: {
        dataTypes: ['integer', 'number'],
        widget: UpdownWidget
    },
    color: {

    },
    checkbox: {
        dataTypes: ['boolean', 'integer', 'number'],
        widget: CheckBoxWidget
    },
    checkboxes: {

    },
    radio: {
        dataTypes: ['integer', 'number', 'string', 'date', 'boolean'],
        widget: RadioWidget
    },
    range: {
        dataTypes: ['integer'],
        widget: RangeWidget,
    },
    button: {
        dataTypes: ['button', 'submit'],
        widget: ButtonWidget,
    }
}

export function factory(context: Context, itemSchema: ItemSchema, children:React.ReactNode, fieldProps?: FieldProps):JSX.Element {
    if (context === undefined) {
        debugger;
        return null;
    }
    if (itemSchema === undefined) return undefined;
    let {name, type} = itemSchema;
    switch (type) {
    //case 'button':
    //case 'submit':
    //    return <FormButton context={context} itemSchema={itemSchema as ButtonSchema} children={children} />;
    case 'arr':
        let arrSchema = context.getItemSchema(name) as ArrSchema;
        return <ArrComponent formContext={context as FormContext} arrSchema={arrSchema} children={children} />;
    default:
        break;
    }

    let typeWidget: TypeWidget;
    let ui = context.getUiItem(name);
    function getTypeWidget(t:DataType): TypeWidget {
        switch(t) {
        default: return TextWidget; 
        case 'id': return IdWidget;
        case 'integer': return UpdownWidget;
        case 'number': return NumberWidget; 
        case 'string': return TextWidget; 
        case 'date': return DateWidget; 
        case 'boolean': return CheckBoxWidget; 
        case 'button':
        case 'submit': return ButtonWidget;
        }
    }
    if (ui === undefined) {
        typeWidget = getTypeWidget(type);
    }
    else {
        let {widget:widgetType} = ui;
        switch (widgetType) {
        default:
            if (widgetType !== undefined) {
                let widgetFactory = widgetsFactory[widgetType];
                typeWidget = widgetFactory.widget;
            }
            if (typeWidget === undefined) typeWidget = getTypeWidget(type);
            break;
        case 'group':
            return <span>impletment group</span>;
        }
        //label = uiLabel || name;
    }
    
    let {isRow, widgets} = context;
    let widget = new typeWidget(context, itemSchema, fieldProps, children);
    widgets[name] = widget;

    if (isRow === false) {
        let WidgetElement = observer(() => widget.renderContainer());
        //if (inNode === true) 
        return <WidgetElement />;
        //return form.FieldContainer(label, <WidgetElement />);
    }
    else {
        let widgetElement = widget.renderContainer();
        //if (inNode === true) 
        return widgetElement;
        //return form.FieldContainer(label, widgetElement);
    }
}

const ArrComponent = observer((
    {formContext, arrSchema, children}:{formContext: FormContext, arrSchema: ArrSchema, children: React.ReactNode}) => 
{
    let {name, arr} = arrSchema;
    let data = formContext.data[name] as any[];
    let {form, rowContexts} = formContext;
    let arrRowContexts = rowContexts[name];
    if (arrRowContexts === undefined) rowContexts[name] = arrRowContexts = {};
    let ui = formContext.getUiItem(name) as UiArr;
    let arrLabel = name;
    let Templet:TempletType;
    let selectable:boolean, deletable:boolean, restorable:boolean;    
    if (ui !== undefined) {
        let {widget:widgetType, label, selectable:arrSelectable, deletable:arrDeletable, restorable:arrRestorable} = ui;
        selectable = arrSelectable;
        deletable = arrDeletable;
        restorable = arrRestorable;
        Templet = ui.Templet;
        if (widgetType !== 'arr') return Unknown(arrSchema.type, widgetType, ['arr']);
        arrLabel = label || arrLabel;
    }
    let {ArrContainer, RowContainer, uiSchema} = form;
    if (uiSchema !== undefined) {
        let {selectable:formSelectable, deletable:formDeletable, restorable:formRestorable} = uiSchema;
        if (selectable !== true) selectable = formSelectable;
        if (deletable !== true) deletable = formDeletable;
        if (restorable !== true) restorable = formRestorable;
    }
    let first = true;
    return ArrContainer(arrLabel, <>
        {data.map((row:any, index) => {
            let arrRow = row.$row;
            if (arrRow === undefined) {
                row.$row = arrRow = new ArrRow(form, arrSchema, row);
            }
            let rowKey = arrRow.key;

            let selectCheck:JSX.Element, deleteIcon:JSX.Element;
            if (selectable === true) {
                let onClick = (evt: React.MouseEvent<HTMLInputElement>)=>{
                    row.$isSelected=(evt.target as HTMLInputElement).checked;
                }
                selectCheck = <div className="form-row-checkbox">
                    <input type="checkbox" onClick={onClick} />
                </div>;
            }
            let isDeleted = !(row.$isDeleted===undefined || row.$isDeleted===false);
            if (deletable === true) {
                let icon = isDeleted? 'fa-undo' : 'fa-trash';
                let onDelClick = () => {
                    if (restorable === true) {
                        row.$isDeleted = !isDeleted;
                    }
                    else {
                        let p = data.indexOf(row);
                        if (p>=0) data.splice(p, 1);
                    }
                }
                deleteIcon = <div className="form-row-edit align-self-start text-info cursor-pointer" onClick={onDelClick}>
                    <i className={classNames('fa', icon, 'fa-fw')} />
                </div>;
            }
            let editContainer = selectable===true || deletable===true?
                (content:any) => <fieldset disabled={isDeleted}><div className={classNames('d-flex', {'deleted':isDeleted, 'row-selected':row.$isSelected})}>
                    {selectCheck}<div className="flex-grow-1">{content}</div>{deleteIcon}
                </div></fieldset>
                :
                (content:any) => content;

            let rowContext: RowContext;
            let rowContent: JSX.Element;
            let sep = undefined;
            if (first === false) sep = form.RowSeperator;
            else first = false;
            if (children !== undefined) {
                rowContext = new RowContext(formContext, arrSchema, row, true, arrRow);
                rowContent = <>children</>;
            }
            else {
                let typeofTemplet = typeof Templet;
                if (typeofTemplet === 'function') {
                    rowContext = new RowContext(formContext, arrSchema, row, true, arrRow);
                    rowContent = React.createElement(observer(Templet as React.StatelessComponent));
                }
                else if (typeofTemplet === 'object') {
                    rowContext = new RowContext(formContext, arrSchema, row, true, arrRow);
                    rowContent = Templet as JSX.Element;
                }
                else {
                    rowContext = new RowContext(formContext, arrSchema, row, false, arrRow);
                    rowContent = <>{
                        arr.map((v, index) => {
                            return <React.Fragment key={v.name}>
                                {factory(rowContext, v, undefined)}
                            </React.Fragment>
                        })}
                    </>;
                }
            }
            arrRowContexts[rowKey] = rowContext;
            return <ContextContainer.Provider key={rowKey} value={rowContext}>
                {sep}
                {RowContainer(editContainer(<><rowContext.renderErrors />{rowContent}</>))}
            </ContextContainer.Provider>;
        })}
    </>);
});
