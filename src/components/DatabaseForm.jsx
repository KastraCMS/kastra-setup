import React, { Component } from 'react';
import CheckboxInput from './CheckboxInput'
import SingleInput from './SingleInput';
import ErrorList from './ErrorList';

class DatabaseForm extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            databaseServer: '',
            databaseName: '',
            integratedSecurity: false,
            databaseLogin: '',
            databasePassword: '',
            errors: []
        }; 
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        
        this.setState({
            [name]: value,
            displaySuccess: false
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        let errors = [];

        if(this.state.databaseServer.length === 0) {
            errors.push("Database server can't be empty");
        }

        if(this.state.databaseName.length === 0) {
            errors.push("Database name can't be empty");
        }

        if(!this.state.integratedSecurity) {
            if(this.state.databaseLogin.length === 0) {
                errors.push("Database login can't be empty");
            }

            if(this.state.databasePassword.length === 0) {
                errors.push("Database password can't be empty");
            }
        }

        if(errors.length > 0) {
            this.setState({errors});
            return;
        }

        this.props.setLoading(true, "Saving database ...");
        let data = {};
        data.databaseServer = this.state.databaseServer;
        data.databaseName = this.state.databaseName;
        data.databaseLogin = this.state.databaseLogin;
        data.databasePassword = this.state.databasePassword;
        data.integratedSecurity = this.state.integratedSecurity;

        fetch('/install/database/', 
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then((res) => {
            if (!res.ok) {
                res.json().then((error) => {
                    errors.push(error);
                    
                    this.setState({ errors }, () => {
                        this.props.setLoading(false, "");
                    });
                });
            }
            return res.json();
        })
        .then((result) => {
            this.props.checkDatabase();
        }).catch((error) => {
            console.log('Error: \n', error.message);
        });
    }

    renderCredentials() {
        if(this.state.integratedSecurity) {
            return;
        }

        return (
            <div>
                <SingleInput type="text" name="databaseLogin" title="Database login"  value={this.state.password} handleChange={this.handleChange} />
                <SingleInput type="password" name="databasePassword" title="Database password"  value={this.state.password} handleChange={this.handleChange} />
            </div>
        );
    }

    render() {
        if(!this.props.display) {
            return (null);
        }

        return (
            <form onSubmit={this.handleSubmit}>
                <ErrorList messages={this.state.errors} />
                <SingleInput type="text" name="databaseServer" title="Database server" value={this.state.email} handleChange={this.handleChange} />
                <SingleInput type="text" name="databaseName" title="Database name" value={this.state.email} handleChange={this.handleChange} />
                <CheckboxInput name="integratedSecurity" title="Integrated security" checked={this.state.integratedSecurity} handleChange={this.handleChange} />
                {this.renderCredentials()}
                <div className="actions">
                    <button type="submit" className="button button-primary">Validate</button>
                </div>
            </form>
        );
    }
}

export default DatabaseForm;