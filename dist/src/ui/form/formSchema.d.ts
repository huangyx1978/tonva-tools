import { FormFields } from './field';
import { InputSchema } from './inputSchema';
import { FormEvent } from 'react';
export declare class FormSchema {
    private initValues;
    private _inputs;
    private submit;
    fieldTag: string;
    submitText: string;
    resetButton?: string;
    clearButton?: string;
    inputs: InputSchema[];
    hasLabel: boolean;
    errors: string[];
    onError: (result: any) => void;
    onSuccess: (result: any) => void;
    constructor(formFields: FormFields, values?: any);
    clear(): void;
    reset(): void;
    values(): object;
    readonly hasError: boolean;
    readonly notFilled: boolean;
    $(name: string): InputSchema;
    removeInput(name: string): void;
    setInputError(name: string, err: string): void;
    onReset(): void;
    onClear(): void;
    onSubmit(event: FormEvent<HTMLFormElement>): Promise<void>;
    private onFinish;
    private onNext;
    private fieldContainerClassNames;
    setInputValues(): void;
    renderInput(vInput: InputSchema): JSX.Element;
    renderString(vInput: InputSchema): JSX.Element;
    renderTextArea(vInput: InputSchema): JSX.Element;
    renderCheckBox(vInput: InputSchema): JSX.Element;
    renderLabel(vInput: InputSchema): JSX.Element;
    renderErr(vInput: InputSchema): JSX.Element;
    renderField(vInput: InputSchema): JSX.Element;
    renderSeperator(vInput?: InputSchema): JSX.Element;
    renderSumit(): JSX.Element;
    renderReset(): JSX.Element;
    renderClear(): JSX.Element;
    renderFormErrors(): JSX.Element;
    renderButtons(): JSX.Element;
}
