"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const reactstrap_1 = require("reactstrap");
const ui_1 = require("../ui");
const userApi_1 = require("./userApi");
require("../css/va-form.css");
class RegSuccess extends React.Component {
    failed() {
        return;
    }
    login() {
        const { user, pwd } = this.props;
        userApi_1.default
            .login({ user: user, pwd: pwd })
            .then(retUser => {
            if (retUser === undefined) {
                this.failed();
                return;
            }
            ui_1.nav.logined(retUser);
        });
    }
    render() {
        const { user, pwd } = this.props;
        return (React.createElement(ui_1.Page, { header: false },
            React.createElement(reactstrap_1.Container, { className: "entry-form" },
                React.createElement(reactstrap_1.Form, null,
                    React.createElement("span", { className: "info" },
                        "\u7528\u6237 ",
                        React.createElement("strong", null,
                            user,
                            " "),
                        " \u6CE8\u518C\u6210\u529F\uFF01"),
                    React.createElement(reactstrap_1.Button, { color: "success", block: true, onClick: () => this.login() }, "\u76F4\u63A5\u767B\u5F55")))));
    }
}
exports.default = RegSuccess;
//# sourceMappingURL=regSuccess.js.map