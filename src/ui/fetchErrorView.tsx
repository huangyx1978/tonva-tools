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
        let {error, url} = this.props;
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
        return <li
            onClick={() => this.click()}>
            <article className="page-container">
                <section>
                    <div  className="va-error">
                        <div>网络出现问题</div>
                        <div>点击重新访问</div>
                        <div>url: {url}</div>
                        {errContent}
                    </div>
                </section>
            </article>
        </li>;
    }
}
