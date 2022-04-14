import React from "react";
import classes from './Cell.module.css'

const Cell = (props) => {
    return (
        <input type="text" name={props.name} value={props.value}
            onChange={props.onChange} className={classes.square}/>
    );
};

export default Cell;