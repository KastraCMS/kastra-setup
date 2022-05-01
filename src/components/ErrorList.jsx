// Libs
import React from 'react';

export const ErrorList = ({ messages, message }) => {
    let displayedMessage;

    if (messages && messages.length > 0) {
        displayedMessage = (<ul>
            {messages.map((message, index) => {
                return (
                    <li key={index}>{message}</li>
                );
            })}
        </ul>);
    } else {
        displayedMessage = message;
    }

    if (!displayedMessage || displayedMessage.length === 0) {
        return null;
    }

    return (
        <div className="text-danger validation-summary-errors">
            {displayedMessage}
        </div>
    );
}