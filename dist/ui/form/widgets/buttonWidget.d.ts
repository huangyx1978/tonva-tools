/// <reference types="react" />
import { UiButton } from '../../schema';
import { Widget } from './widget';
export declare class ButtonWidget extends Widget {
    protected ui: UiButton;
    protected onClick: () => Promise<void>;
    private observerRender;
    render(): JSX.Element;
    renderContainer(): JSX.Element;
}
