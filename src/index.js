import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return(
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]} 
                onClick = {() => {this.props.onClick(i)}}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [
                {squares: Array(9).fill(null)}
            ],
            stepNumber: 0,
            isXnext: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (checkWinner(squares) || squares[i]) {
            return;
        }

        if (checkDraw(squares)){
            return;
        }

        squares[i] = (this.state.isXnext ? 'X' : 'O');
        this.setState({
            history: history.concat([
                {
                    squares: squares
                }
            ]),
            stepNumber: history.length,
            isXnext: !this.state.isXnext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            isXnext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = checkWinner(current.squares);

        let status;
        if (winner) {
            status = "Player " + winner + " has won!";
        } else if(checkDraw(current.squares)){
            status = "Game Tied!";
        } else{
            status = "Next Move for Player " + (this.state.isXnext ? 'X' : 'O');
        } 

        return (
            <div className="game">
                <table>
                    <tr>
                        <td>
                            <h1>xoxo --- TIC - TAC - TOE --- xoxo</h1>
                        </td>  
                    </tr>
                    <tr>
                        <td>
                            <div className="game-board">                  
                                <div><u>{status}</u></div>
                                <br></br>
                                <Board 
                                    squares = {current.squares}
                                    onClick = {i => this.handleClick(i)}
                                />
                                <div className="game-info">
                                    <button onClick={() => this.jumpTo(this.state.stepNumber - 1)}>Undo</button>
                                    <button onClick={() => this.jumpTo(0)}>Restart</button>
                                </div>                    
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function checkWinner(squares){
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

    for(let i=0; i<lines.length; i++){
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        } 
    }

    return null;
}

function checkDraw(squares){
    let flag = 1;
    for(let i = 0; i<9; i++){
        if (squares[i] === null){
            flag = 0;
        }
    }
    return flag;
}
