import * as React from 'react';
import { refetchApi } from '../net';
export default class FetchErrorView extends React.Component {
    click() {
        this.props.clearError();
        const { url, options, resolve, reject } = this.props;
        refetchApi(url, options, resolve, reject);
    }
    render() {
        let { error } = this.props;
        //let errMsg = fetchError.errorMsg;
        let errContent;
        if (typeof error === 'object') {
            let err = [];
            for (let i in error) {
                err.push(React.createElement("li", { key: i },
                    React.createElement("label", null, i),
                    React.createElement("div", null, error[i])));
            }
            errContent = React.createElement("ul", null, err);
        }
        else {
            errContent = React.createElement("div", null, error);
        }
        return React.createElement("li", { className: 'va-error', onClick: () => this.click() },
            React.createElement("div", null,
                React.createElement("div", null, "\u7F51\u7EDC\u51FA\u73B0\u95EE\u9898"),
                React.createElement("div", null, "\u70B9\u51FB\u91CD\u65B0\u8BBF\u95EE"),
                errContent));
    }
}
//# sourceMappingURL=fetchErrorView.js.map