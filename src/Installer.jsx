// Libs
import React, { useState, useEffect } from "react";

// Components
import { DatabaseForm } from "./components/DatabaseForm";
import { AccountForm } from "./components/AccountForm";
import { Loader } from "./components/Loader";

// Utils
import { checkError } from "./utils";

export const Installer = () => {
  const [{ isLoading, message }, setLoader] = useState({ isLoading: false, message: undefined });
  const [accountCreateMode, setAccountCreateMode] = useState(false);
  const [databaseExists, setDatabaseExists] = useState(false);

  useEffect(checkDatabase, []);

  function checkDatabase() {
    setLoader({ isLoading: true, message: "Checking database..." });

    return fetch('/install/checkdatabase',
      {
        method: 'GET'
      })
      .then(checkError).then(res => {
        console.log(`Db created : ${res}`);
        setDatabaseExists(res);

        if (res) {
          checkDatabaseTables();
        }
        setLoader({ isLoading: false, message: "" });

        return true;
      }).catch(function (error) {
        setDatabaseExists(false);
        setLoader({ isLoading: false, message: "" });

        return false;
      });
  }

  function checkDatabaseTables() {
    setLoader({ isLoading: true, message: "Checking database tables..." });
    fetch('/install/checkdatabasetables',
      {
        method: 'GET'
      })
      .then(checkError)
      .then(res => {
        console.log(`Account created : ${res}`);
        setAccountCreateMode(!res);
        setLoader({ isLoading: false, message: "" });
      }).catch((error) => {
        console.log(error);
        setLoader({ isLoading: false, message: "" });
      });
  }

  function setLoading(isLoading, message) {
    setLoader({ isLoading, message });
  }

  return (
    <div>
      <h2 className="title">Kastra - Installation</h2>
      <hr />
      <h3 className="subtitle">Configure your website.</h3>
      <Loader isLoading={isLoading} message={message} />
      <DatabaseForm display={!isLoading && !databaseExists} checkDatabase={checkDatabase} setLoading={setLoading} />
      <AccountForm display={!isLoading && databaseExists && accountCreateMode} setLoading={setLoading} />
    </div>
  );
};
