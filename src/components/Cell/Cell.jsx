import React from "react";
import classes from './Cell.module.css'

const Cell = (props) => {
    const handleInput = (e) => {
        let name = e.target.name;
        
        if (e.target.value >= 0 && e.target.value <= 9 && e.target.value !== ' ') {
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
            onChange={e => handleInput(e)} className={classes.square}/>
    );
};

export default Cell;