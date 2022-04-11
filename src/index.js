import React from "react";
import ReactDOM from 'react-dom';
import './index.css';

function Cell(props) {
    return (
        <input type="text" name={props.name} value={props.value}
            onChange={props.onChange} className="square"/>
    );
}

class Button extends React.Component {
    render() {
        return (
            <button onClick={this.props.onClick}>{this.props.text}</button>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numberX: [],
            arrLength: 4,
            stepNumber: 0,
            history: [{
                numbers: Array(4).fill(null),
                bullsCows: {
                    bulls: 0, 
                    cows: 0
                }
            }],
            error: '',
            input1: '',
            input2: '',
            input3: '',
            input4: '',
            isGameStart: false
        }

        // Эта привязка обязательна для работы `this` в колбэке.    
        this.handleInput = this.handleInput.bind(this);  
    }
    
    handleInput = (e) => {
        this.validateInput(e);
    }

    validateInput(e) {
        let name = e.target.name;
        if (e.target.value >= 0 && e.target.value <= 9) {
            this.setState({
                [name]: e.target.value
            });
        } else {
            this.setState({
                [name]: ''
            });
        }
    }    

    validateEquals(arr) {
        const map = new Map();
    
        for (const el of arr) {
            map.set(el, map.has(el) ? map.get(el) + 1 : 1);
        }
        return map;
    }

    randomNumber() {
        return Math.floor(Math.random()*10);
    }

    handleRandom() {
        let number = [];
        for (let i=0; i<this.state.arrLength; i++) {
            let x = this.randomNumber();
            
            if (number.indexOf(x) < 0){
                number.push(x);
            } else {
                i--;
            }
        }      
        
        this.setState({
            numberX: number,
            history: [{
                numbers: Array(4).fill(null),
                bullsCows: {
                    bulls: 0, 
                    cows: 0
                }
            }],
            stepNumber: 0,
            error: '',
            input1: '',
            input2: '',
            input3: '',
            input4: '',
            isGameStart: true
        });
    }

    checkBullsCows(arr, arrX) {
        let bullsCows = {bulls: 0, cows: 0};
        for (let i=0; i<arr.length; i++) {
            if (arrX.indexOf(+arr[i]) >= 0) {
                if (arrX.indexOf(+arr[i]) !== i) {
                    bullsCows.cows++;
                } else {
                    bullsCows.bulls++;
                }
            }
        }

        return bullsCows;
    }

    handleClick() {
        let arr = [];
        const arrLength = this.state.arrLength;
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        let err1 = '';

        for (let i=0; i < arrLength; i++) {
            if (this.state['input'+(i+1)].length === 0) {
                err1 += '#  Error: empty value  ';
                i = arrLength;
            } else {
                arr.push(this.state['input'+(i+1)]); 
            }
        }

        let equals = Object.fromEntries(this.validateEquals(arr));
        
        for (let i=0; i<Object.keys(equals).length; i++) {
            if (Object.values(equals)[i] > 1) {
                err1 += '#  Error: equal values  ';
                i = Object.keys(equals).length;
            }
        }

        if (!err1.length) {
            let bullsCows = this.checkBullsCows(arr, this.state.numberX);
            
            this.setState({
                history: history.concat([{
                    numbers: arr,
                    bullsCows: bullsCows,
                }]),
                stepNumber: history.length,
                error: '',
            });
        } else {
            this.setState({
                error: err1,
            });
        }
    }

    render() {
        const history = this.state.history;

        const moves = history.map((step, move) => {
            return (
                <li key={move}>
                    Bulls: {history[move].bullsCows.bulls}. 
                    Cows: {history[move].bullsCows.cows}. 
                </li>
            );
        });

        let game = '';
        if (this.state.isGameStart) {
            game = 
                <div className="game">
                    <div className="game-board">
                        <div className="board-row">
                            <Cell name='input1'
                                value={this.state.input1}
                                onChange={this.handleInput}
                            />
                            <Cell name='input2'
                                value={this.state.input2}
                                onChange={this.handleInput}
                            />
                            <Cell name='input3'
                                value={this.state.input3}
                                onChange={this.handleInput}
                            />
                            <Cell name='input4'
                                value={this.state.input4}
                                onChange={this.handleInput}
                            />
                        </div>
                        <br />
                        { this.state.history[this.state.history.length - 1].bullsCows.bulls !== 4
                            ?  <Button onClick={() => this.handleClick()} text='Check'/>    
                            :  ''    
                        }
                    </div>
                    <div className="game-info">
                        <div className="error">{this.state.error.length ? this.state.error : ''}</div>
                        <ol>{moves}</ol>

                        {this.state.history[this.state.history.length - 1].bullsCows.bulls === 4 ? "You're win!" : ''}
                    </div>
                </div>
                ;
        }

        return (
            <div className="game-wrap">
                <div className="game-top">
                    <Button onClick={() => this.handleRandom()} text='Start new'/>
                </div>
                {game}
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
