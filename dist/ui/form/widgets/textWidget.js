import * as React from 'react';
import classNames from 'classnames';
import { Widget } from './widget';
export class TextWidget extends Widget {
    constructor() {
        super(...arguments);
        this.inputType = 'text';
        this.onBlur = () => {
            this.checkRules();
            this.context.checkContextRules();
        };
        this.onFocus = () => {
            this.clearError();
            this.context.removeErrorWidget(this);
            this.context.removeErrors();
        };
    }
    setElementValue(value) { this.input.value = value; }
    get placeholder() { return (this.ui && this.ui.placeholder) || this.name; }
    setReadOnly(value) { this.input.readOnly = this.readOnly = value; }
    setDisabled(value) {
        this.input.disabled = this.disabled = value;
    }
    render() {
        let renderTemplet = this.renderTemplet();
        if (renderTemplet !== undefined)
            return renderTemplet;
        let cn = {
            'form-control': true,
        };
        if (this.hasError) {
            cn['is-invalid'] = true;
        }
        else {
            cn['required-item'] = this.itemSchema.required === true;
        }
        return React.createElement(React.Fragment, null,
            React.createElement("input", { ref: input => this.input = input, className: classNames(this.className, cn), type: this.inputType, defaultValue: this.defaultValue, onChange: this.onChange, placeholder: this.placeholder, readOnly: this.readOnly, disabled: this.disabled, onKeyDown: this.onKeyDown, onFocus: this.onFocus, onBlur: this.onBlur, maxLength: this.itemSchema.maxLength }),
            this.renderErrors());
    }
}
//# sourceMappingURL=textWidget.js.map