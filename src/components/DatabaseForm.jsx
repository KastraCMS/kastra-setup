// Libs
import React, { useState } from "react";

// Components
import { CheckboxInput } from "./CheckboxInput"
import { SingleInput } from "./SingleInput";
import { ErrorList } from "./ErrorList";

// Utils
import { getXSRFToken } from "../utils";

export const DatabaseForm = ({ setLoading, display, checkDatabase }) => {
    const [values, setValues] = useState({
        databaseServer: "",
        databaseName: "",
        integratedSecurity: false,
        databaseLogin: "",
        databasePassword: "",
        errors: []
    });

    const [errors, setErrors] = useState([]);
    const [retryCount, setRetryCount] = useState(0);

    const {
        databaseServer,
        databaseName,
        databaseLogin,
        databasePassword,
        integratedSecurity
    } = values;

    function checkInstallation() {
        setTimeout(() => {
            console.log("Check installation");
            checkDatabase().then((success) => {
                if (!success && retryCount < 30) {
                    setRetryCount(retryCount + 1);
                    checkInstallation();
                } else {
                    setRetryCount(0);
                }
            });
        }, 1000);
    }

    function handleChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        setValues({
            ...values,
            [name]: value
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        let err = [];

        if (databaseServer.length === 0) {
            err.push("Database server can't be empty");
        }

        if (databaseName.length === 0) {
            err.push("Database name can't be empty");
        }

        if (!integratedSecurity) {
            if (databaseLogin.length === 0) {
                err.push("Database login can't be empty");
            }

            if (databasePassword.length === 0) {
                err.push("Database password can't be empty");
            }
        }

        if (errors.length > 0) {
            setErrors(err);
            return;
        }

        setLoading(true, "Saving database ...");

        let data = {
            databaseServer,
            databaseName,
            databaseLogin,
            databasePassword,
            integratedSecurity
        };

        fetch('/install/database/',
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
            .then((res) => {
                if (res.ok) {
                    checkInstallation();
                }
                setLoading(false, "");
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

    function renderCredentials() {
        return (
            <div>
                <SingleInput type="text" name="databaseLogin" title="Database login" value={databaseLogin} handleChange={handleChange} />
                <SingleInput type="password" name="databasePassword" title="Database password" value={databasePassword} handleChange={handleChange} />
            </div>
        );
    }

    if (!display) {
        return (null);
    }

    return (
        <form onSubmit={handleSubmit}>
            <ErrorList messages={errors} />
            <SingleInput type="text" name="databaseServer" title="Database server" value={databaseServer} handleChange={handleChange} />
            <SingleInput type="text" name="databaseName" title="Database name" value={databaseName} handleChange={handleChange} />
            <CheckboxInput name="integratedSecurity" title="Integrated security" checked={integratedSecurity} handleChange={handleChange} />
            {!integratedSecurity && renderCredentials()}
            <div className="actions">
                <button type="submit" className="button button-primary">Validate</button>
            </div>
        </form>
    );
};