/// <reference types="react" />
import { FormFields } from './def';
import { InputSchema } from './inputSchema';
import { FormEvent } from 'react';
export declare class FormSchema {
    private _inputs;
    private submit;
    fieldTag: string;
    submitText: string;
    resetButton?: string;
    clearButton?: string;
    inputs: InputSchema[];
    onError: (result: any) => void;
    onSuccess: (result: any) => void;
    constructor(formFields: FormFields);
    private clear();
    private reset();
    values(): object;
    readonly hasError: boolean;
    readonly notFilled: boolean;
    $(name: string): InputSchema;
    onReset(): void;
    onClear(): void;
    onSubmit(event: FormEvent<HTMLFormElement>): Promise<void>;
    private onFinish();
    private onNext();
    renderInput(vInput: InputSchema): JSX.Element;
    renderLabel(vInput: InputSchema): JSX.Element;
    renderErr(vInput: InputSchema): JSX.Element;
    renderField(vInput: InputSchema): JSX.Element;
    renderSeperator(vInput?: InputSchema): JSX.Element;
    renderSumit(): JSX.Element;
    renderReset(): JSX.Element;
    renderClear(): JSX.Element;
    renderButtons(): JSX.Element;
}
