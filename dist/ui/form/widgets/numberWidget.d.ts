import { TextWidget } from './textWidget';
import { NumBaseSchema } from '../../schema';
export declare class NumberWidget extends TextWidget {
    protected inputType: string;
    protected itemSchema: NumBaseSchema;
    protected buildRules(): void;
    protected parse(value: any): any;
}
