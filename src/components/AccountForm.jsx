// Libs
import React, { useState } from "react";

// Components
import { SingleInput } from "./SingleInput";
import { ErrorList } from "./ErrorList"

// Utils
import { getXSRFToken } from "../utils";

export const AccountForm = ({ setLoading, display }) => {
    const [values, setValues] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        errors: []
    });

    const [errors, setErrors] = useState([]);

    const {
        email,
        password,
        confirmPassword
    } = values;

    function handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setValues({
            ...values,
            [name]: value
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        let err = [];

        if (email.length === 0) {
            err.push("Email can't be empty");
        }

        if (password.length === 0) {
            err.push("Password can't be empty");
        }

        if (password !== confirmPassword) {
            err.push("Password fields must be equal");
        }

        if (err.length > 0) {
            setErrors(err);
            return;
        }

        setLoading(true, "Creating account ...");

        let data = {
            email,
            password,
            confirmPassword
        };

        fetch('/install/account',
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': getXSRFToken()
                },
                body: JSON.stringify(data)
            })
            .then(res => {
                if (!res.ok) {
                    res.json().then((error) => {
                        if (Array.isArray(error)) {
                            for (let i = 0; i < error.length; i++) {
                                err.push(error[i].description);
                            }
                        } else {
                            err.push(error);
                        }

                        setErrors(err);
                        setLoading(false, "");
                    });
                } else {
                    window.location.href = "/";
                }
            }).catch((error) => {
                console.log(error);

                if (error) {
                    err.push(error.toString());
                } else {
                    err.push("Unknown error");
                }
                setErrors(err);

                setLoading(false, "");
            });
    }

    if (!display) {
        return (null);
    }

    return (
        <form onSubmit={handleSubmit}>
            <ErrorList messages={errors} />
            <SingleInput type="text" name="email" title="Email" value={email} handleChange={handleChange} />
            <SingleInput type="password" name="password" title="Password" value={password} handleChange={handleChange} />
            <SingleInput type="password" name="confirmPassword" title="Confirm password" value={confirmPassword} handleChange={handleChange} />

            <div className="actions">
                <button type="submit" className="button button-primary">Install</button>
            </div>
        </form>
    );
};