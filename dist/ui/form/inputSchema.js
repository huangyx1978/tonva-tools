var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import * as _ from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
let Err = class Err extends React.Component {
    render() {
        return React.createElement("span", null, this.props.err);
    }
};
Err = __decorate([
    observer
], Err);
export { Err };
export class InputSchema {
    constructor(formSchema, field) {
        this.inputTag = 'input';
        this.field = field;
        this.formSchema = formSchema;
        this.id = _.uniqueId();
        this.label = field.label;
        this.props = {
            name: field.name,
            placeholder: field.placeholder,
            onFocus: () => { this.err = undefined; this.formSchema.errors = []; },
        };
        this.setProps();
        this.buildValidators();
    }
    reset() {
        this.value = undefined;
        this.err = undefined;
    }
    clear() {
        this.value = undefined;
        this.err = undefined;
    }
    buildValidators() {
        let rules = this.field.rules;
        if (rules === undefined)
            return;
        this.validators = [];
        if (Array.isArray(rules)) {
            for (let rule of rules) {
                let validator = this.buildValidator(rule);
                if (validator !== undefined)
                    this.validators.push(validator);
            }
        }
        else {
            let validator = this.buildValidator(rules);
            if (validator !== undefined)
                this.validators.push(validator);
        }
    }
    buildValidator(rule) {
        if (typeof rule === 'function')
            return rule;
        let parts = rule.split(':');
        return this.stringValidator(parts[0], parts[1]);
    }
    stringValidator(rule, param) {
        switch (rule) {
            default: return undefined;
            case 'required': return this.required.bind(this);
        }
    }
    required(values) { return undefined; }
}
__decorate([
    observable
], InputSchema.prototype, "err", void 0);
__decorate([
    observable
], InputSchema.prototype, "value", void 0);
class UnkownInputSchema extends InputSchema {
    setProps() {
        this.props.type = 'text';
        this.props.disabled = true;
        this.props.placeholder = 'unknown type ' + this.field.type;
    }
}
class SingleInputSchema extends InputSchema {
    setProps() {
        this.props.type = 'text';
        this.props.onBlur = () => {
            if (this.validators !== undefined) {
                for (let v of this.validators) {
                    let ret = v();
                    if (ret !== undefined) {
                        this.err = ret;
                        return;
                    }
                }
            }
            this.value = this._input.value;
        };
        this.props.ref = this.ref.bind(this);
    }
    ref(input) {
        this._input = input;
    }
    clear() {
        super.clear();
        this._input.value = '';
    }
    required(values) {
        if (this._input === undefined)
            return undefined;
        let value = this._input.value;
        if (value === undefined)
            return;
        if (value.trim().length > 0)
            return undefined;
        return '不能为空';
    }
}
class NumberInputSchema extends SingleInputSchema {
    setProps() {
        super.setProps();
        this.props.type = 'number';
        this.props.onKeyPress = (event) => {
            let ch = event.charCode;
            if (ch === 8 || ch === 0 || ch === 13 || ch >= 48 && ch <= 57) {
                if (this.extraChars === undefined)
                    return;
                if (this.extraChars.indexOf(ch) >= 0)
                    return;
                return;
            }
            event.preventDefault();
        };
    }
    stringValidator(rule, param) {
        switch (rule) {
            default: return super.stringValidator(rule, param);
            case 'min':
                this._min = Number(param);
                if (this._min === NaN)
                    this._min = undefined;
                return this.min.bind(this);
            case 'max':
                this._max = Number(param);
                if (this._max === NaN)
                    this._max = undefined;
                return this.max.bind(this);
        }
    }
    min(values) {
        if (this._min === undefined)
            return;
        let value = this._input.value;
        if (value === undefined)
            return;
        if (value.trim().length === 0)
            return;
        let val = Number(value);
        if (val === NaN)
            return;
        if (val < this._min)
            return '最小值为' + this._min;
        return undefined;
    }
    max(values) {
        if (this._max === undefined)
            return;
        let value = this._input.value;
        if (value === undefined)
            return;
        if (value.trim().length === 0)
            return;
        let val = Number(value);
        if (val === NaN)
            return;
        if (val > this._max)
            return '最大值为' + this._max;
        return undefined;
    }
}
class IntInputSchema extends NumberInputSchema {
}
class DecInputSchema extends NumberInputSchema {
}
class FloatInputSchema extends NumberInputSchema {
}
class StringInputSchema extends SingleInputSchema {
    stringValidator(rule, param) {
        switch (rule) {
            default: return super.stringValidator(rule, param);
            case 'maxlength':
                this.props.maxLength = param;
                return;
        }
    }
}
class PasswordInputSchema extends StringInputSchema {
    setProps() {
        super.setProps();
        this.props.type = 'password';
    }
}
class TextInputSchema extends InputSchema {
    setProps() {
        this.props.inputTag = 'textarea';
        this.props.ref = (textArea) => {
            this._textArea = textArea;
        };
    }
}
export function inputFactory(formSchema, field) {
    switch (field.type) {
        default: return new UnkownInputSchema(formSchema, field);
        case 'int': return new IntInputSchema(formSchema, field);
        case 'dec': return new DecInputSchema(formSchema, field);
        case 'float': return new FloatInputSchema(formSchema, field);
        case 'string': return new StringInputSchema(formSchema, field);
        case 'password': return new PasswordInputSchema(formSchema, field);
        case 'text': return new TextInputSchema(formSchema, field);
    }
}
//# sourceMappingURL=inputSchema.js.map