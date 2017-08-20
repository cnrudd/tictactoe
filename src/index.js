import React from 'react';
import ReactDOM from 'react-dom';
import { SegmentedControl } from 'segmented-control';
import { Utils } from './Utils.js';
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

        if (Utils.calculateWinner(squares) || (squares[i] && squares[i].val)) {
            return;
        }
        squares[i] = { val: player, cls: '' };
        
        const winner = Utils.calculateWinner(squares);
        if (winner) {
            winner.squares.forEach(it => it.cls = 'winner');
        }

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

            const coord = JSON.stringify(Utils.calcCellCoordinates(step.square)),
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
            winner = Utils.calculateWinner(current.squares),
            moves = this.listMoves();

        let status;
        if (winner) {
            status = 'Winner: ' + winner.val;
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
                        style={{ width: 130, color: '#47bc9d', fontSize: '12px' }}
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