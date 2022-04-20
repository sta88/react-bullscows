import React from "react";
import classes from './Cell.module.css'

const Cell = (props) => {
    const handleInput = (e) => {
        let name = e.target.name;
        let currIndex = name.toString().slice(-1);
        
        if (e.target.value >= 0 && e.target.value <= 9 && e.target.value !== ' ') {
            if (parseInt(currIndex, 10) <= 4) {
                const nextSibling = document.querySelector(
                    `input[name=input${parseInt(currIndex, 10) + 1}]`
                );
      
                if (nextSibling !== null) {
                    nextSibling.focus();
                }
            }

            props.setInputs({
                ...props.inputs,
                [name]: e.target.value
            });
        } else {
            props.setInputs({
                ...props.inputs,
                [name]: ''
            });
        };
    }

    return (
        <input type="text" name={props.name} value={props.value}
            onChange={e => handleInput(e)} onKeyDown={props.onKeyDown} className={classes.square}/>
    );
};

export default Cell;