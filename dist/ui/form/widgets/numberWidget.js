import { TextWidget } from './textWidget';
import { RuleNum, RuleInt, RuleMin, RuleMax } from '../rules';
export class NumberWidget extends TextWidget {
    constructor() {
        super(...arguments);
        this.inputType = 'number';
    }
    buildRules() {
        super.buildRules();
        this.rules.push(new RuleNum);
        if (this.itemSchema.type === 'integer') {
            this.rules.push(new RuleInt);
        }
        let { min, max } = this.itemSchema;
        if (min !== undefined)
            this.rules.push(new RuleMin(min));
        if (max !== undefined)
            this.rules.push(new RuleMax(max));
    }
    parse(value) {
        if (value === undefined || value === null)
            return;
        return Number(value);
    }
}
//# sourceMappingURL=numberWidget.js.map