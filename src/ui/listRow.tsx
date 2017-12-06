import * as React from 'react';
import * as classNames from 'classnames';
import '../css/va-row.css';

export interface ListItem {
    key?: string|number|undefined;
    date?: Date;
    icon?: string | JSX.Element;
    main?: string;
    vice?: string;
    right?: string | JSX.Element;
    unread?: number;         // <0 表示red dot
    onClick?: () => void;
}

export interface ListRowProps extends ListItem {
    //onClick: () => void;
}

export interface ListRowState {
    pressed: boolean;
}

export class ListRow extends React.Component<ListRowProps, ListRowState> {
    constructor(props) {
        super(props);
        this.state = {
            pressed: false,
        }
    }
    render() {
        let {date, main, vice, icon, unread, right, onClick} = this.props;
        let header, isIcon:boolean;
        switch (typeof icon) {
            case 'object':
                header = <header>{icon}</header>; 
                isIcon= false;
                break;
            case 'string': 
                header = <header className='icon'><img src={icon as string} /></header>; 
                isIcon= true; 
                break;
        }
        let footer;
        if (right !== undefined) {
            if (typeof right === 'string')
                footer = <footer><small className="text-muted">{right}</small></footer>;
            else
                footer = <footer>{right}</footer>;
        }
        let viceSpan;
        if (vice !== undefined) viceSpan = <span>{vice}</span>;
        let cn = classNames('va-row', {icon:isIcon, pressed: this.state.pressed}, {"va-action": onClick !== undefined});
        return (
        <li className={cn} onClick={onClick}>
            {header}
            <div>
                <div>{main}</div>
                {viceSpan}
            </div>
            {footer}
        </li>
        );
    }
}
