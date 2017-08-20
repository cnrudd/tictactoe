import React from 'react';
import ReactDOM from 'react-dom';
import { SegmentedControl } from 'segmented-control';
import { Board } from './Board.js';
import './index.css';

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                square: null,
                player: null
            }],
            order: 'ASC',
            stepNumber: 0,
            xIsNext: true
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1),
            current = history[history.length - 1],
            squares = current.squares.slice(),
            player = this.state.xIsNext ? 'X' : '0';

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = player;
        this.setState({
            history: history.concat([{ squares: squares, square: i, player: player }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            moves: []
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    listMoves() {
        const history = this.state.history.slice(),
            stepNumber = this.state.stepNumber,
            order = this.state.order;

        if (order == 'DESC') history.reverse();

        return history.map((step, move) => {
            move = (order == 'DESC') ?
                (Math.abs(move - history.length)) - 1 :
                move;

            const coord = JSON.stringify(calcCellCoordinates(step.square)),
                desc = move ?
                    `Move # ${move}: ${step.player} in square ${coord}` :
                    'Game start',
                selected = move === stepNumber ? 'selected-move' : '';

            return (
                <li key={move}>
                    <a href="#" onClick={() => this.jumpTo(move)} className={selected} >{desc}</a>
                </li>
            );
        });
    }

    changeMovesSort(order) {
        this.setState({ order: order });
    }

    render() {
        const history = this.state.history,
            stepNumber = this.state.stepNumber,
            current = history[stepNumber],
            winner = calculateWinner(current.squares),
            moves = this.listMoves();

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : '0');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div><SegmentedControl
                        name="oneDisabled"
                        options={[
                            { label: "ASC", value: "ASC", default: true },
                            { label: "DESC", value: "DESC" }
                        ]}
                        setValue={newValue => this.changeMovesSort(newValue)}
                        style={{ width: 130, color: '#47bc9d', fontSize: '12px' }} // purple400
                    /></div>
                    <ul >{moves}</ul>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

function calcCellCoordinates(cell) {
    cell++;
    return {
        x: cell % 3 || 3,
        y: Math.ceil(cell / 3)
    };
}