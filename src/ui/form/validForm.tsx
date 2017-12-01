import * as React from 'react';
import {observer} from 'mobx-react';
import {InputSchema} from './inputSchema';
import {FormSchema} from './formSchema';

export interface FormProps {
    formSchema: FormSchema;
}

@observer 
export class ValidForm extends React.Component<FormProps, {}> {
    render() {
        let {children, formSchema} = this.props;
        let content:any[];
        if (children === undefined) {
            let sep;
            content = [];
            formSchema.inputs.forEach((v, index) => {
                sep = formSchema.renderSeperator(v);
                if (sep !== null) content.push(sep);
                content.push(formSchema.renderField(v));
            });
            sep = formSchema.renderSeperator();
            if (sep !== null) content.push(sep);
            content.push(formSchema.renderButtons());
        }
        else
            content = children as any;
        return <div className='container'>
            <form onSubmit={formSchema.onSubmit}>{content}</form>
        </div>;
    }
}
