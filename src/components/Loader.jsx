import React from 'react';

const Loader = (props) => {

    if(!props.isLoading) {
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
                <p className="message">{props.message}</p>
            </div>
        </div>
    );
}

export default Loader;