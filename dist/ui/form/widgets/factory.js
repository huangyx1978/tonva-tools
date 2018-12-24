import * as React from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
//import { ContextValue, FormContext, Form } from '../form';
import { TextWidget } from './textWidget';
import { TextAreaWidget } from './textareaWidget';
import { PasswordWidget, UrlWidget, EmailWidget } from './passwordWidget';
import { UpdownWidget } from './updownWidget';
import { NumberWidget } from './numberWidget';
import { DateWidget, DateTimeWidget, TimeWidget, MonthWidget } from './dateWidget';
import { CheckBoxWidget } from './checkBoxWidget';
import { ArrRow } from '../arrRow';
import { RowContext, ContextContainer } from '../context';
import { SelectWidget } from './selectWidget';
import { RadioWidget } from './radioWidget';
import { RangeWidget } from './rangeWidget';
import { IdWidget } from './idWidget';
import { ButtonWidget } from './buttonWidget';
import { Unknown } from './unknown';
const widgetsFactory = {
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
    color: {},
    checkbox: {
        dataTypes: ['boolean', 'integer', 'number'],
        widget: CheckBoxWidget
    },
    checkboxes: {},
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
};
export function factory(context, itemSchema, children, fieldProps) {
    if (context === undefined) {
        debugger;
        return null;
    }
    if (itemSchema === undefined)
        return undefined;
    let { name, type } = itemSchema;
    switch (type) {
        //case 'button':
        //case 'submit':
        //    return <FormButton context={context} itemSchema={itemSchema as ButtonSchema} children={children} />;
        case 'arr':
            let arrSchema = context.getItemSchema(name);
            return React.createElement(ArrComponent, { formContext: context, arrSchema: arrSchema, children: children });
        default:
            break;
    }
    let typeWidget;
    let ui = context.getUiItem(name);
    function getTypeWidget(t) {
        switch (t) {
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
        let { widget: widgetType } = ui;
        switch (widgetType) {
            default:
                if (widgetType !== undefined) {
                    let widgetFactory = widgetsFactory[widgetType];
                    typeWidget = widgetFactory.widget;
                }
                if (typeWidget === undefined)
                    typeWidget = getTypeWidget(type);
                break;
            case 'group':
                return React.createElement("span", null, "impletment group");
        }
        //label = uiLabel || name;
    }
    let { isRow, widgets } = context;
    let widget = new typeWidget(context, itemSchema, fieldProps, children);
    widgets[name] = widget;
    if (isRow === false) {
        let WidgetElement = observer(() => widget.renderContainer());
        //if (inNode === true) 
        return React.createElement(WidgetElement, null);
        //return form.FieldContainer(label, <WidgetElement />);
    }
    else {
        let widgetElement = widget.renderContainer();
        //if (inNode === true) 
        return widgetElement;
        //return form.FieldContainer(label, widgetElement);
    }
}
const ArrComponent = observer(({ formContext, arrSchema, children }) => {
    let { name, arr } = arrSchema;
    let data = formContext.data[name];
    let { form, rowContexts } = formContext;
    let arrRowContexts = rowContexts[name];
    if (arrRowContexts === undefined)
        rowContexts[name] = arrRowContexts = {};
    let ui = formContext.getUiItem(name);
    let arrLabel = name;
    let Templet;
    let selectable, deletable, restorable;
    if (ui !== undefined) {
        let { widget: widgetType, label, selectable: arrSelectable, deletable: arrDeletable, restorable: arrRestorable } = ui;
        selectable = arrSelectable;
        deletable = arrDeletable;
        restorable = arrRestorable;
        Templet = ui.Templet;
        if (widgetType !== 'arr')
            return Unknown(arrSchema.type, widgetType, ['arr']);
        arrLabel = label || arrLabel;
    }
    let { ArrContainer, RowContainer, uiSchema } = form;
    if (uiSchema !== undefined) {
        let { selectable: formSelectable, deletable: formDeletable, restorable: formRestorable } = uiSchema;
        if (selectable !== true)
            selectable = formSelectable;
        if (deletable !== true)
            deletable = formDeletable;
        if (restorable !== true)
            restorable = formRestorable;
    }
    let first = true;
    return ArrContainer(arrLabel, React.createElement(React.Fragment, null, data.map((row, index) => {
        let arrRow = row.$row;
        if (arrRow === undefined) {
            row.$row = arrRow = new ArrRow(form, arrSchema, row);
        }
        let rowKey = arrRow.key;
        let selectCheck, deleteIcon;
        if (selectable === true) {
            let onClick = (evt) => {
                row.$isSelected = evt.target.checked;
            };
            selectCheck = React.createElement("div", { className: "form-row-checkbox" },
                React.createElement("input", { type: "checkbox", onClick: onClick }));
        }
        let isDeleted = !(row.$isDeleted === undefined || row.$isDeleted === false);
        if (deletable === true) {
            let icon = isDeleted ? 'fa-undo' : 'fa-trash';
            let onDelClick = () => {
                if (restorable === true) {
                    row.$isDeleted = !isDeleted;
                }
                else {
                    let p = data.indexOf(row);
                    if (p >= 0)
                        data.splice(p, 1);
                }
            };
            deleteIcon = React.createElement("div", { className: "form-row-edit align-self-start text-info cursor-pointer", onClick: onDelClick },
                React.createElement("i", { className: classNames('fa', icon, 'fa-fw') }));
        }
        let editContainer = selectable === true || deletable === true ?
            (content) => React.createElement("fieldset", { disabled: isDeleted },
                React.createElement("div", { className: classNames('d-flex', { 'deleted': isDeleted, 'row-selected': row.$isSelected }) },
                    selectCheck,
                    React.createElement("div", { className: "flex-grow-1" }, content),
                    deleteIcon))
            :
                (content) => content;
        let rowContext;
        let rowContent;
        let sep = undefined;
        if (first === false)
            sep = form.RowSeperator;
        else
            first = false;
        if (children !== undefined) {
            rowContext = new RowContext(formContext, arrSchema, row, true, arrRow);
            rowContent = React.createElement(React.Fragment, null, "children");
        }
        else {
            let typeofTemplet = typeof Templet;
            if (typeofTemplet === 'function') {
                rowContext = new RowContext(formContext, arrSchema, row, true, arrRow);
                rowContent = React.createElement(observer(Templet));
            }
            else if (typeofTemplet === 'object') {
                rowContext = new RowContext(formContext, arrSchema, row, true, arrRow);
                rowContent = Templet;
            }
            else {
                rowContext = new RowContext(formContext, arrSchema, row, false, arrRow);
                rowContent = React.createElement(React.Fragment, null, arr.map((v, index) => {
                    return React.createElement(React.Fragment, { key: v.name }, factory(rowContext, v, undefined));
                }));
            }
        }
        arrRowContexts[rowKey] = rowContext;
        return React.createElement(ContextContainer.Provider, { key: rowKey, value: rowContext },
            sep,
            RowContainer(editContainer(React.createElement(React.Fragment, null,
                React.createElement(rowContext.renderErrors, null),
                rowContent))));
    })));
});
//# sourceMappingURL=factory.js.map