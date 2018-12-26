import * as React from 'react';
import { nav, Page } from '../ui';
import userApi from './userApi';
import '../css/va-form.css';

export interface Props {
    user: string;
    pwd: string;
}

export default class RegSuccess extends React.Component<Props, null> {
    failed() {
        return;
    }
    login() {
        const {user, pwd} = this.props;
        userApi
            .login({user: user, pwd: pwd})
            .then(async retUser => {
                if (retUser === undefined) {
                    this.failed();
                    return;
                }
                await nav.logined(retUser);
            });
    }

    render() {
        const {user, pwd} = this.props;
        return (
        <Page header={false}>
            <div className="container entry-form">
                <form>
                    <span className="info">
                        用户 <strong>{user} </strong> 注册成功！
                    </span>
                    <button className="btn btn-success btn-block" onClick={() => this.login()}>
                        直接登录
                    </button>
                </form>
            </div>
        </Page>
        );
    }
}
