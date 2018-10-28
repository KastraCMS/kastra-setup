
import React from 'react';

const CheckboxInput = (props) => {
    return (
        <div className="field">
            <label className="field-checkbox" htmlFor={`${props.name}-${props.value}`}>
                {props.title}
                <input id={`${props.name}-${props.value}`} name={props.name} type="checkbox" value={props.value} checked={props.checked} onChange={props.handleChange} /> 
                <span className="checkmark"></span>
            </label> 
        </div>
    );
}

export default CheckboxInput;