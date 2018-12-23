import * as React from 'react';
import classNames from 'classnames';
import { TextWidget } from './textWidget';
export class CheckBoxWidget extends TextWidget {
    setElementValue(value) { this.input.checked = value; }
    setReadOnly(value) { this.input.readOnly = this.readOnly = value; }
    setDisabled(value) { this.input.disabled = this.disabled = value; }
    render() {
        let cn = classNames(this.className, 'form-check-inline');
        let input = React.createElement("input", { ref: (input) => this.input = input, className: 'align-self-center', type: "checkbox", defaultChecked: this.defaultValue, onChange: this.onChange });
        return this.context.inNode ?
            React.createElement("label", { className: cn },
                input,
                " ",
                (this.ui && this.ui.label) || this.name)
            :
                React.createElement("div", { className: cn }, input);
    }
}
//# sourceMappingURL=checkBoxWidget.js.map