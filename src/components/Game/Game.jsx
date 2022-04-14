import React, {useState} from "react";
import Cell from "../Cell/Cell";
import Button from "../Button/Button";

const Game = () => {
    const [numberX, setNumberX] = useState([]);
    const [stepNumber, setStepNumber] = useState(0);
    const [isGameStart, setGameStart] = useState(false);
    const [historyList, setHistory] = useState([{
                    numbers: Array(4).fill(null),
                    bullsCows: {
                        bulls: 0, 
                        cows: 0
                    }
                }]);
    const arrLength = 4;
    const [error, setError] = useState('');
    const [inputs, setInputs] = useState({
        input1: '',
        input2: '',
        input3: '',
        input4: '',
    });
    
    const handleInput = (e) => {
        validateInput(e);
    }

    const validateInput = (e) => {
        let name = e.target.name;
        
        if (e.target.value >= 0 && e.target.value <= 9 && e.target.value !== ' ') {
            setInputs({
                ...inputs,
                [name]: e.target.value
            }
            );
        } else {
            setInputs({
                ...inputs,
                [name]: ''
            });
        };
    }    

    const validateEquals = (arr) => {
        const map = new Map();
    
        for (const el of arr) {
            map.set(el, map.has(el) ? map.get(el) + 1 : 1);
        }
        return map;
    }

    const randomNumber = () => {
        return Math.floor(Math.random()*10);
    }

    const handleRandom = () => {
        let number = [];
        for (let i=0; i<arrLength; i++) {
            let x = randomNumber();
            
            if (number.indexOf(x) < 0){
                number.push(x);
            } else {
                i--;
            }
        }    
        
        setNumberX(number);
        setStepNumber(0);
        setGameStart(true);
        setHistory([{
            numbers: Array(4).fill(null),
            bullsCows: {
                bulls: 0, 
                cows: 0
            }
        }]);
        setError('');
        setInputs({
            input1: '',
            input2: '',
            input3: '',
            input4: '',
        });
    }

    const checkBullsCows = (arr, arrX) => {
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

    const handleClick = () => {
        let arr = [];
        const history = historyList.slice(0, stepNumber + 1);
        let err1 = '';

        for (let i=0; i < arrLength; i++) {
            if (inputs['input'+(i+1)].length === 0) {
                err1 += '#  Error: empty value  ';
                i = arrLength;
            } else {
                arr.push(inputs['input'+(i+1)]); 
            }
        }

        let equals = Object.fromEntries(validateEquals(arr));
        
        for (let i=0; i<Object.keys(equals).length; i++) {
            if (Object.values(equals)[i] > 1) {
                err1 += '#  Error: equal values  ';
                i = Object.keys(equals).length;
            }
        }

        if (!err1.length) {
            let bullsCows = checkBullsCows(arr, numberX);
            setStepNumber(history.length);

            setHistory(historyList => [...historyList, {
                numbers: arr,
                bullsCows: bullsCows,
            }]);
            setError('');
        } else {
            setError(err1);
        }
    }
    
    const moves = historyList.map((step, move) => {
        return (
            <li key={move}>
                Bulls: {historyList[move].bullsCows.bulls}. 
                Cows: {historyList[move].bullsCows.cows}. 
            </li>
        );
    });

    let game = '';
    if (isGameStart) {
        game = 
            <div className="game">
                <div className="game-board">
                    <div className="board-row">
                        <Cell name='input1'
                            value={inputs.input1}
                            onChange={handleInput}
                        />
                        <Cell name='input2'
                            value={inputs.input2}
                            onChange={handleInput}
                        />
                        <Cell name='input3'
                            value={inputs.input3}
                            onChange={handleInput}
                        />
                        <Cell name='input4'
                            value={inputs.input4}
                            onChange={handleInput}
                        />
                    </div>
                    <br />
                    { historyList[historyList.length - 1].bullsCows.bulls !== 4
                        ?  <Button onClick={handleClick} text='Check'/>    
                        :  ''    
                    }
                </div>
                <div className="game-info">
                    <div className="error">{error.length ? error : ''}</div>
                    <ol>{moves}</ol>

                    {historyList[historyList.length - 1].bullsCows.bulls === 4 ? "You're win!" : ''}
                </div>
            </div>
            ;
    }

    return (
        <div className="game-wrap">
            <div className="game-top">
                <Button onClick={handleRandom} text='Start new' />
            </div>
            {game}
        </div>
    );
}

export default Game;