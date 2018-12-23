import * as React from 'react';
import { TextWidget } from './textWidget';
import { RuleNum, RuleInt, RuleMin, RuleMax } from '../rules';
import { NumBaseSchema } from '../schema';

export class NumberWidget extends TextWidget {
    protected inputType = 'number';
    protected itemSchema: NumBaseSchema;

    protected buildRules() {
        super.buildRules();
        this.rules.push(new RuleNum);
        if (this.itemSchema.type === 'integer') {
            this.rules.push(new RuleInt);
        }
        let {min, max} = this.itemSchema;
        if (min !== undefined) this.rules.push(new RuleMin(min));
        if (max !== undefined) this.rules.push(new RuleMax(max));
    }

    protected parse(value:any):any {
        if (value === undefined || value === null) return;
        return Number(value);
    }
}
