import React from 'react';
import { Square } from './Square.js';

export class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRow(y, sideLength) {
        let squares = [];
        const start = y * sideLength,
            end = start + sideLength;

        for (let i = start; i < end; i++) {
            squares.push(this.renderSquare(i));
        }

        return (
            <div className="board-row">
                {squares}
            </div>
        );
    }

    render() {
        const squares = 9,
            sideLength = Math.sqrt(squares);

        let board = [];

        for (let y = 0; y < sideLength; y++) {
            board.push(this.renderRow(y, sideLength));
        }

        return (
            <div>{board}</div>
        );
    }
}
