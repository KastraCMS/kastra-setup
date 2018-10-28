import React, { Component } from 'react';
import DatabaseForm from './components/DatabaseForm';
import AccountForm from './components/AccountForm';
import Loader from './components/Loader';

class Installer extends Component {
  constructor() {
    super();
    this.state = {
      databaseExists: false,
      accountCreateMode: false,
      isLoading: false,
      message: false
    }
  }

  componentDidMount() {
    this.checkDatabase();
  }

  checkDatabase() {
    this.setState({ isLoading: true, message: "Checking database..." });
      fetch('/install/checkdatabase', 
      {
          method: 'GET'
      })
      .then(res => {
        if(res.ok) {
          this.setState({ isLoading: false, databaseExists: true });
          this.checkDatabaseTables();
        } else {
          this.setState({ isLoading: false, databaseExists: false });
        }
      }).catch(function(error) {
        this.setState({ isLoading: false, databaseExists: false });
      });
  }

  checkDatabaseTables() {
    this.setState({ isLoading: true, message: "Checking database tables..." });
      fetch('/install/checkdatabasetables', 
      {
          method: 'GET'
      })
      .then(res => {
        if(res.ok) {
          this.setState({ isLoading: false, accountCreateMode: false });
        } else {
          this.setState({ isLoading: false, accountCreateMode: true });
        }
      }).catch((error) => {
        console.log(error);
      });
  }

  setLoading(isLoading, message) {
    this.setState({ isLoading, message });
  }
  
  render() {
    const isLoading = this.state.isLoading;
    return (
      <div>
        <h2 className="title">Kastra - Installation</h2>
        <hr />
        <h3 className="subtitle">Configure your website.</h3>
        
        <Loader isLoading={this.state.isLoading} message={this.state.message} />
        <DatabaseForm display={!isLoading && !this.state.databaseExists} checkDatabase={() => this.checkDatabase()} setLoading={(isLoading, message) => this.setLoading(isLoading, message)} />
        <AccountForm display={!isLoading && this.state.databaseExists && this.state.accountCreateMode} setLoading={(isLoading, message) => this.setLoading(isLoading, message)} />
      </div>
    );
  }
}

export default Installer;
