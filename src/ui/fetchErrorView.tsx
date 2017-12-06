import * as React from 'react';
import {FetchError} from '../fetchError';
import { refetchApi } from '../net';

export interface FetchErrorProps extends FetchError {
    clearError: ()=>void
}

export default class FetchErrorView extends React.Component<FetchErrorProps, null> {
    private click() {
        this.props.clearError();
        const {channel, url, options, resolve, reject} = this.props;
        refetchApi(channel, url, options, resolve, reject);
    }
    render() {
        let {error} = this.props;
            //let errMsg = fetchError.errorMsg;
        let errContent;
        if (typeof error === 'object') {
            let err = [];
            for (let i in error) {
                err.push(<li key={i}><label>{i}</label><div>{error[i]}</div></li>);
            }
            errContent = <ul>{err}</ul>;
        }
        else {
            errContent = <div>{error}</div>;
        }
        return <li className='va-error'
            onClick={() => this.click()}>
                <div>
                    <div>网络出现问题</div>
                    <div>点击重新访问</div>
                    {errContent}
                </div>
        </li>;
    }
}
