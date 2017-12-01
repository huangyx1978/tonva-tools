import * as React from 'react';
import * as _ from 'lodash';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {Field, FormFields, Rule, Rules} from './def';
import {FormSchema} from './formSchema';

@observer
export class Err extends React.Component<{err?:string}, {}> {
    render() {
        return <span>{this.props.err}</span>;
    }
}

export type Validator = (values?:any)=>string|undefined;

export abstract class InputSchema {
    props: any;
    id: string;
    label: string;
    @observable err?: string;
    @observable value: any;
    
    field: Field;
    inputTag: string = 'input';
    protected abstract setProps():void;
    protected formSchema: FormSchema;
    protected validators: Validator[];
    
    constructor(formSchema:FormSchema, field:Field) {
        this.field = field;
        this.formSchema = formSchema;
        this.id = _.uniqueId();
        this.label = field.label;
        this.props = {
            name: field.name,
            placeholder: field.placeholder,
            onFocus: () => {this.err = undefined},
        }
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

    protected buildValidators() {
        let rules = this.field.rules;
        if (rules === undefined) return;
        this.validators = [];
        if (Array.isArray(rules)) {
            for (let rule of rules) {
                let validator = this.buildValidator(rule);
                if (validator !== undefined) this.validators.push(validator);
            }
        }
        else {
            let validator = this.buildValidator(rules);
            if (validator !== undefined) this.validators.push(validator);
        }
    }

    private buildValidator(rule:Rule):Validator|undefined {
        if (typeof rule === 'function') return rule;
        let parts = rule.split(':');
        return this.stringValidator(parts[0], parts[1]);
    }

    protected stringValidator(rule:string, param?:string):Validator|undefined {
        switch (rule) {
            default: return undefined;
            case 'required': return this.required.bind(this);
        }
    }

    protected required(values?:any):string|undefined {return undefined;}
}

class UnkownInputSchema extends InputSchema {
    protected setProps() {
        this.props.type = 'text';
        this.props.disabled = true;
        this.props.placeholder = 'unknown type ' + this.field.type;
    }
}

abstract class SingleInputSchema extends InputSchema {
    protected _input: HTMLInputElement;
    protected setProps() {
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
        }
        this.props.ref = this.ref.bind(this);
    }
    private ref(input:HTMLInputElement) {
        this._input = input; 
    }
    clear() {
        super.clear();
        this._input.value = '';
    }
    protected required(values?:any):string|undefined {
        if (this._input === undefined) return undefined;
        let value = this._input.value;
        if (value === undefined) return;
        if (value.trim().length > 0) return undefined;
        return '必填内容';
    }
}

abstract class NumberInputSchema extends SingleInputSchema {
    protected _min?:number;
    protected _max?:number;
    protected extraChars:number[];
    protected setProps() {
        super.setProps();
        this.props.type = 'number';
        this.props.onKeyPress = (event:KeyboardEvent)=>{
            let ch = event.charCode;
            if (ch === 8 || ch === 0 || ch === 13 || ch >= 48 && ch <= 57) {
                if (this.extraChars === undefined) return;
                if (this.extraChars.indexOf(ch) >= 0) return;
                return;
            }
            event.preventDefault();
        }
    }

    protected stringValidator(rule:string, param?:string):Validator|undefined {
        switch (rule) {
            default: return super.stringValidator(rule, param);
            case 'min': 
                this._min = Number(param); 
                if (this._min === NaN) this._min = undefined;
                return this.min.bind(this);
            case 'max':
                this._max = Number(param); 
                if (this._max === NaN) this._max = undefined;
                return this.max.bind(this);
        }
    }

    protected min(values:any):string|undefined {
        if (this._min === undefined) return;
        let value = this._input.value;
        if (value === undefined) return;
        if (value.trim().length === 0) return;
        let val = Number(value);
        if (val === NaN) return;
        if (val < this._min) return '最小值为' + this._min;
        return undefined;
    }

    protected max(values:any):string|undefined {
        if (this._max === undefined) return;
        let value = this._input.value;
        if (value === undefined) return;
        if (value.trim().length === 0) return;
        let val = Number(value);
        if (val === NaN) return;
        if (val > this._max) return '最大值为' + this._max;
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
    type = 'text';
    protected stringValidator(rule:string, param?:string):Validator|undefined {
        switch (rule) {
            default: return super.stringValidator(rule, param);
            case 'maxlength': 
                this.props.maxLength = param;
                return;
        }
    }
}

class TextInputSchema extends InputSchema {
    private _textArea: HTMLTextAreaElement;
    protected setProps() {
        this.props.inputTag = 'textarea';
        this.props.ref = (textArea:HTMLTextAreaElement)=>{ 
            this._textArea = textArea;
        }
    }
}

export function inputFactory(formSchema:FormSchema, field: Field): InputSchema {
    switch (field.type) {
        default: return new UnkownInputSchema(formSchema, field);
        case 'int': return new IntInputSchema(formSchema, field);
        case 'dec': return new DecInputSchema(formSchema, field);
        case 'float': return new FloatInputSchema(formSchema, field);
        case 'string': return new StringInputSchema(formSchema, field);
        case 'text': return new TextInputSchema(formSchema, field);
    }
}
