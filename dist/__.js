import * as _ from 'lodash';
export function __(p) {
    let v = __.__dict__[p];
    return typeof v === 'function' ? v() : v;
}
__.__dict__ = {};
__.dict = function (dict) {
    _.merge(__.__dict__, dict);
};
//# sourceMappingURL=__.js.map