import * as React from 'react';
import classNames from 'classnames';
import { TextWidget } from './textWidget';

export class CheckBoxWidget extends TextWidget {
    protected input: HTMLInputElement;

    protected setElementValue(value:any) {this.input.checked = value}

    setReadOnly(value:boolean) {this.input.readOnly = this.readOnly = value}
    setDisabled(value:boolean) {this.input.disabled = this.disabled = value}

    render() {
        let cn = classNames(this.className, 'form-check-inline');
        let input = <input
            ref={(input)=>this.input = input}
            className={'align-self-center'}
            type="checkbox"
            defaultChecked={this.defaultValue} 
            onChange={this.onChange} />;
        return this.context.inNode?
            <label className={cn}>
                {input} {(this.ui&&this.ui.label) || this.name}
            </label>
            :
            <div className={cn}>{input}</div>;
    }
}
