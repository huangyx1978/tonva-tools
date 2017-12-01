"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const mobx_1 = require("mobx");
const _ = require("lodash");
const page_1 = require("../page");
const nav_1 = require("../nav");
const inputSchema_1 = require("./inputSchema");
class FormSchema {
    constructor(formFields) {
        let { fields, onSumit, fieldTag, submitText, resetButton, clearButton } = formFields;
        this.fieldTag = fieldTag || 'div';
        this.submitText = submitText || '提交';
        if (resetButton === true)
            this.resetButton = '重来';
        else
            this.resetButton = resetButton;
        if (clearButton === true)
            this.clearButton = '清除';
        else
            this.clearButton = clearButton;
        this.submit = onSumit;
        this._inputs = {};
        this.inputs = [];
        for (let field of fields) {
            let v = this._inputs[field.name] = inputSchema_1.inputFactory(this, field);
            this.inputs.push(v);
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onClear = this.onClear.bind(this);
        this.onFinish = this.onFinish.bind(this);
        this.onNext = this.onNext.bind(this);
    }
    clear() {
        this.inputs.forEach(v => v.clear());
    }
    reset() {
        this.inputs.forEach(v => v.reset());
    }
    values() {
        let ret = {};
        for (let vi of this.inputs) {
            ret[vi.field.name] = vi.value;
        }
        return ret;
    }
    get hasError() {
        return this.inputs.some(vi => vi.err !== undefined);
    }
    get notFilled() {
        return this.inputs.every(vi => {
            let ret = !vi.value;
            return ret;
        });
    }
    $(name) { return this._inputs[name]; }
    onReset() {
        this.reset();
    }
    onClear() {
        this.clear();
    }
    onSubmit(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            if (this.submit === undefined) {
                alert('no submit funciton defined');
                return;
            }
            let ret = yield this.submit(this.values());
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
            nav_1.nav.push(React.createElement(ResultPage, { return: ret, onFinish: this.onFinish, onNext: this.onNext }));
        });
    }
    onFinish() {
        nav_1.nav.pop();
    }
    onNext() {
        this.clear();
    }
    renderInput(vInput) {
        let { err } = vInput;
        return React.createElement("input", Object.assign({ className: 'form-control has-success is-valid' }, vInput.props));
    }
    renderLabel(vInput) {
        return React.createElement("label", { className: 'col-sm-2 col-form-label' }, vInput.label);
    }
    renderErr(vInput) {
        return React.createElement("div", { className: "invalid-feedback" }, vInput.err);
    }
    renderField(vInput) {
        return React.createElement("div", { className: 'form-group row', key: vInput.id },
            this.renderLabel(vInput),
            React.createElement("div", { className: "col-sm-10" },
                this.renderInput(vInput),
                vInput.err && this.renderErr(vInput)));
    }
    renderSeperator(vInput) {
        return React.createElement("hr", { key: _.uniqueId(), style: { margin: '20px 0px' } });
    }
    renderSumit() {
        return React.createElement("button", { className: 'btn btn-primary', key: _.uniqueId(), type: 'submit', disabled: this.notFilled || this.hasError }, this.submitText);
    }
    renderReset() {
        return React.createElement("button", { className: 'btn btn-secondary"', key: _.uniqueId(), type: 'button', onClick: this.onReset }, this.resetButton);
    }
    renderClear() {
        return React.createElement("button", { className: 'btn btn-secondary"', key: _.uniqueId(), type: 'button', onClick: this.onClear }, this.clearButton);
    }
    renderButtons() {
        return React.createElement("div", { className: 'form-group row', key: _.uniqueId() },
            React.createElement("div", { className: 'col-sm-2' }),
            React.createElement("div", { className: 'col-sm-10' },
                React.createElement("div", { className: "row container" },
                    React.createElement("div", { className: "col-auto mr-auto" }, this.renderSumit()),
                    React.createElement("div", { className: "col-auto" }, this.clearButton && this.renderClear()),
                    React.createElement("div", { className: "col-auto" }, this.resetButton && this.renderReset()))));
    }
}
__decorate([
    mobx_1.computed
], FormSchema.prototype, "hasError", null);
__decorate([
    mobx_1.computed
], FormSchema.prototype, "notFilled", null);
exports.FormSchema = FormSchema;
class ResultPage extends React.Component {
    render() {
        let { return: ret, onNext, onFinish } = this.props;
        let { success, message, result } = ret;
        if (message === undefined) {
            message = success === true ? '提交成功' : '提交发生错误';
        }
        return React.createElement(page_1.Page, { close: true },
            React.createElement("div", { className: 'jumbotron' },
                React.createElement("div", { className: 'lead' }, message),
                React.createElement("p", null, JSON.stringify(result)),
                React.createElement("hr", { className: "my-4" }),
                React.createElement("div", { className: 'lead' },
                    React.createElement("button", { className: 'btn btn-primary mr-2', type: 'button', onClick: () => { nav_1.nav.pop(); onFinish(); } }, "\u5B8C\u6210"),
                    React.createElement("button", { className: 'btn btn-default mr-2', type: 'button', onClick: () => { nav_1.nav.pop(); onNext(); } }, "\u7EE7\u7EED"))));
    }
}
//# sourceMappingURL=formSchema.js.map