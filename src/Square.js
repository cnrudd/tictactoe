import React from 'react';

export class Square extends React.Component {
    render() {
        const cls = this.props.cls || '';
        return (
            <button
                className={'square ' + cls}
                onClick={this.props.onClick}>
                {this.props.value}
            </button>
        );
    }
}