// Libs
import React from 'react';

export const Loader = ({ isLoading, message }) => {

    if (!isLoading) {
        return (null);
    }

    return (
        <div className="loader-component">
            <div className="loader-content">
                <div className="loader">
                    <div className="inner one"></div>
                    <div className="inner two"></div>
                    <div className="inner three"></div>
                </div>
                <p className="message">{message}</p>
            </div>
        </div>
    );
}