import React from 'react';

const ErrorList = (props) =>  {
    let message;

    if(props.messages !== undefined && props.messages.length > 0) {
        message = (<ul>
            {props.messages.map((message, index) => {
                return (
                    <li key={index}>{message}</li>
                );
            })}
        </ul>);
    } else {
        message = props.message;
    }

    if(message === undefined || message === null || message.length === 0) {
        return null;
    }

    return (
        <div className="text-danger validation-summary-errors">
            {message}
        </div>
    );
}

export default ErrorList;