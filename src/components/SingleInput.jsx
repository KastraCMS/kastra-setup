import React from 'react';

const SingleInput = (props) => {
        return (
            <div className="field">
                <label htmlFor={props.name}>{props.title}</label>
                <input id={props.name} type={props.type} name={props.name} value={props.value} onChange={props.handleChange} />
            </div>
        );
}

export default SingleInput;