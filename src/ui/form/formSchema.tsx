import * as React from 'react';
import {observable, computed} from 'mobx';
import * as _ from 'lodash';
import {Page} from '../page';
import {nav} from '../nav';
import {Field, FormFields, Rule, Rules, SubmitReturn} from './def';
import {InputSchema, inputFactory, Err} from './inputSchema';
import { FormEvent } from 'react';

export class FormSchema {
    private _inputs: {[name:string]: InputSchema};
    private submit: (values:any) => Promise<SubmitReturn>;
    fieldTag: string;
    submitText: string;
    resetButton?: string;
    clearButton?: string;
    inputs: InputSchema[];
    onError: (result:any) => void;
    onSuccess: (result:any) => void;
    constructor(formFields: FormFields) {
        let {fields, onSumit, fieldTag, submitText, resetButton, clearButton} = formFields;
        this.fieldTag = fieldTag || 'div';
        this.submitText = submitText || '提交';
        if (resetButton === true) this.resetButton = '重来';
        else this.resetButton = resetButton as string;
        if (clearButton === true) this.clearButton = '清除';
        else this.clearButton = clearButton as string;
        this.submit = onSumit;
        this._inputs = {};
        this.inputs = [];
        for (let field of fields) {
            let v = this._inputs[field.name] = inputFactory(this, field);
            this.inputs.push(v);
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onFinish = this.onFinish.bind(this);
        this.onNext = this.onNext.bind(this);
    }

    private clear() {
        this.inputs.forEach(v => v.clear());
    }
    private reset() {
        this.inputs.forEach(v => v.reset());
    }

    values():object {
        let ret:any = {};
        for (let vi of this.inputs) {
            ret[vi.field.name] = vi.value;
        }
        return ret;
    }

    @computed get hasError():boolean {
        return this.inputs.some(vi => vi.err !== undefined);
    }
    @computed get notFilled():boolean {
        return this.inputs.every(vi => {
            let ret = !vi.value;
            return ret;
        });
    }

    $(name:string):InputSchema {return this._inputs[name];}
    
    onReset() {
        this.reset();
    }
    onClear() {
        this.clear();
    }
    async onSubmit(event:FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (this.submit === undefined) {
            alert('no submit funciton defined');
            return;
        }
        let ret = await this.submit(this.values());
        if (ret === undefined) {
            alert('no submit return');
            return;
        }
        if (ret.success === true) {
            if (this.onSuccess !== undefined) {
                this.onSuccess(ret.result);
                return;
            }
        }
        else {
            if (this.onError !== undefined) {
                this.onError(ret.result);
                return;
            }
        }
        nav.push(<ResultPage return={ret} onFinish={this.onFinish} onNext={this.onNext} />)
    }

    private onFinish() {
        nav.pop();
    }

    private onNext() {
        this.clear();
    }

    renderInput(vInput:InputSchema):JSX.Element {
        let {err} = vInput;
        return <input className='form-control has-success is-valid' {...vInput.props} />;
    }
    renderLabel(vInput:InputSchema):JSX.Element {
        return <label className='col-sm-2 col-form-label'>{vInput.label}</label>
    }
    renderErr(vInput:InputSchema):JSX.Element {
        return <div className="invalid-feedback">{vInput.err}</div>
    }
    renderField(vInput:InputSchema):JSX.Element {
        return <div className='form-group row' key={vInput.id}>
            {this.renderLabel(vInput)}
            <div className="col-sm-10">
                {this.renderInput(vInput)}
                {vInput.err && this.renderErr(vInput)}
            </div>
        </div>
    }
    renderSeperator(vInput?:InputSchema):JSX.Element {
        return <hr key={_.uniqueId()} style={{margin:'20px 0px'}} />;
    }
    renderSumit():JSX.Element {
        return <button 
            className='btn btn-primary'
            key={_.uniqueId()} 
            type='submit' 
            disabled={this.notFilled || this.hasError}>
            {this.submitText}
        </button>;
    }
    renderReset():JSX.Element {
        return <button
            className='btn btn-secondary"'
            key={_.uniqueId()} type='button' 
            onClick={this.onReset}>
            {this.resetButton}
        </button>
    }
    renderClear():JSX.Element {
        return <button
            className='btn btn-secondary"'
            key={_.uniqueId()} type='button' 
            onClick={this.onClear}>
            {this.clearButton}
        </button>
    }
    renderButtons():JSX.Element {
        return <div className='form-group row' key={_.uniqueId()}>
            <div className='col-sm-2'/>
            <div className='col-sm-10'>
                <div className="row container">
                    <div className="col-auto mr-auto">{this.renderSumit()}</div>
                    <div className="col-auto">{this.clearButton&&this.renderClear()}</div>
                    <div className="col-auto">{this.resetButton&&this.renderReset()}</div>
                </div>
            </div>
        </div>
    }
}

interface ResultProps {
    return: SubmitReturn;
    onNext: () => void;
    onFinish: () => void;
}
class ResultPage extends React.Component<ResultProps, null> {
    render() {
        let {return:ret, onNext, onFinish} = this.props;
        let {success, message, result} = ret;
        if (message === undefined) {
            message = success === true? '提交成功': '提交发生错误'
        }
        return <Page close={true}>
        <div className='jumbotron'>
            <div className='lead'>{message}</div>
            <p>{JSON.stringify(result)}</p>
            <hr className="my-4" />
            <div className='lead'>
                <button className='btn btn-primary mr-2' type='button' onClick={()=>{nav.pop(); onFinish();}}>完成</button>
                <button className='btn btn-default mr-2' type='button' onClick={()=>{nav.pop(); onNext();}}>继续</button>
            </div>
        </div>
        </Page>
    }
}
