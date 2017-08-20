import React from 'react';
import { Square } from './Square.js';

export class Board extends React.Component {

    renderSquare(i) {
        const sq = this.props.squares[i],
            val = sq ? sq.val : null,
            cls = sq ? sq.cls : null;

        return (
            <Square
                value={val}
                onClick={() => this.props.onClick(i)}
                cls={cls}
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
