let keySeed = 1;
export class ArrRow {
    constructor(form, arrSchema, data) {
        this.key = keySeed++;
        this.form = form;
        this.arrSchema = arrSchema;
        let { uiSchema } = form;
        if (uiSchema !== undefined) {
            this.uiArr = uiSchema.items[arrSchema.name];
        }
        this.data = data;
    }
}
//# sourceMappingURL=arrRow.js.map