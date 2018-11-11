import React, { Component } from 'react';
import SingleInput from './SingleInput';
import ErrorList from './ErrorList';
import { getXSRFToken } from '../utils';

class AccountForm extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
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

        if(this.state.email.length === 0) {
            errors.push("Email can't be empty");
        }

        if(this.state.password.length === 0) {
            errors.push("Password can't be empty");
        }

        if(this.state.password !== this.state.confirmPassword) {
            errors.push("Password fields must be equal");
        }

        if(errors.length > 0) {
            this.setState({errors});
            return;
        }

        this.props.setLoading(true, "Creating account ...");

        let data = {};
        data.email = this.state.email;
        data.password = this.state.password;
        data.confirmPassword = this.state.confirmPassword;

        fetch('/install/account', 
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'RequestVerificationToken' : getXSRFToken()
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            if (!res.ok) {
                res.json().then((error) => {

                    if (Array.isArray(error)) {
                        for(let i = 0; i < error.length; i++) {
                            errors.push(error[i].description);
                        }
                    } else {
                        errors.push(error);
                    }
                    
                    this.setState({ errors }, () => {
                        this.props.setLoading(false, "");
                    });
                });
            }
            return res;
        })
        .then(() => {
            document.location.href="/";
        }).catch((error) => {
            console.log('Error: \n', error.message);
        });
    }

    render() {
        if(!this.props.display) {
            return (null);
        }
        
        return (
            <form onSubmit={this.handleSubmit}>
                <ErrorList messages={this.state.errors} />
                <SingleInput type="text" name="email" title="Email" value={this.state.email} handleChange={this.handleChange} />
                <SingleInput type="password" name="password" title="Password" value={this.state.password} handleChange={this.handleChange} />
                <SingleInput type="password" name="confirmPassword" title="Confirm password" value={this.state.confirmPassword} handleChange={this.handleChange} />

                <div className="actions">
                    <button type="submit" className="button button-primary">Install</button>
                </div>
            </form>
        );
    }
}

export default AccountForm;