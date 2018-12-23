import * as React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { Unknown } from './unknown';
export const FormButton = observer(({ context, itemSchema, children }) => {
    let { name, type } = itemSchema;
    let ui = context.getUiItem(name);
    let Templet;
    if (ui !== undefined) {
        let { widget: widgetType } = ui;
        if (widgetType !== 'button')
            return Unknown(itemSchema.type, widgetType, ['button']);
        Templet = ui.Templet;
    }
    let { form, hasError } = context;
    function onClick() {
        if (type === 'submit') {
            context.checkRules();
            if (context.hasError === true) {
                return;
            }
        }
        let { onButtonClick } = form.props;
        if (onButtonClick === undefined) {
            alert(`button ${name} clicked`);
            return;
        }
        onButtonClick(name, context);
    }
    let disabled = type === 'submit' && hasError;
    let content;
    if (children !== undefined)
        content = children;
    else if (typeof Templet === 'function')
        content = Templet(context, name);
    else
        content = Templet;
    let button = React.createElement("button", { className: classNames(ui && ui.className), type: "button", disabled: disabled, onClick: onClick }, content || name);
    if (context.inNode === true)
        return button;
    return React.createElement("div", { className: form.ButtonClass }, button);
});
//# sourceMappingURL=formButton.js.map