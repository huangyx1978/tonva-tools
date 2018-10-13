import * as React from 'react';
import { Container, Button, Form } from 'reactstrap';
import { nav, Page } from '../ui';
import userApi from './userApi';
import '../css/va-form.css';
export default class RegSuccess extends React.Component {
    failed() {
        return;
    }
    login() {
        const { user, pwd } = this.props;
        userApi
            .login({ user: user, pwd: pwd })
            .then(async (retUser) => {
            if (retUser === undefined) {
                this.failed();
                return;
            }
            await nav.logined(retUser);
        });
    }
    render() {
        const { user, pwd } = this.props;
        return (React.createElement(Page, { header: false },
            React.createElement(Container, { className: "entry-form" },
                React.createElement(Form, null,
                    React.createElement("span", { className: "info" },
                        "\u7528\u6237 ",
                        React.createElement("strong", null,
                            user,
                            " "),
                        " \u6CE8\u518C\u6210\u529F\uFF01"),
                    React.createElement(Button, { color: "success", block: true, onClick: () => this.login() }, "\u76F4\u63A5\u767B\u5F55")))));
    }
}
//# sourceMappingURL=regSuccess.js.map