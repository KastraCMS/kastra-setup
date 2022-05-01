// Libs
import React from 'react';

export const SingleInput = ({ name, title, type, value, handleChange }) => {
    return (
        <div className="field">
            <label htmlFor={name}>{title}</label>
            <input id={name} type={type} name={name} value={value} onChange={handleChange} />
        </div>
    );
}