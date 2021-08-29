import React, { useEffect, useState } from 'react';
import {
  CardActions,
  CardContent,
  Button,
  Grid,
} from '@material-ui/core';
import RequiredTextField from '../../components/TextFields/RequiredTextField';
import ErrorAlert from '../../components/ErrorAlert';
import Api from '../../services/api';
import './styles.css';
import { useApp } from '../../contexts/AppContext';
import { Link } from 'react-router-dom';

const TryRegister = async (firstName, lastName, email, password) => {
  let res = await Api.post('/users', {
    firstName,
    lastName,
    email,
    password,
  });
  return res;
}

export default function SignUpPage() {

  const { error, setError, setLoading } = useApp();

  const [firstNameField, setFirstNameField] = useState({
    value: "",
    error: null,
  });
  const [lastNameField, setLastNameField] = useState({
    value: "",
    error: null,
  });
  const [emailField, setEmailField] = useState({
    value: "",
    error: null,
  });
  const [passwordField, setPasswordField] = useState({
    value: "",
    error: null,
  });
  const [repeatPasswordField, setRepeatPasswordField] = useState({
    value: "",
    error: null,
  });

  const onSubmit = async () => {
    setLoading(true)

    let res = await TryRegister(firstNameField.value, lastNameField.value, emailField.value, passwordField.value);

    console.log(res.error)

    if (res.error) {
      console.log(res.error)
      res.error.map((e) => {
        console.log(e.firstName)
        if (!!e.firstName) { setFirstNameField({ ...firstNameField, error: e.firstName } ) ; console.log("oi") }
        else if (!!e.lastName) { setLastNameField({ errors: e.lastName }); }
        else if (!!e.email) { setEmailField({ errors: e.email }); }
        else if (!!e.password) { setPasswordField({ errors: e.password }); }
      })
     } else {
    //   setLoading(false)
    //   window.location = '/signin'
    }
    setLoading(false)
  }

  useEffect( () => {
    console.log(firstNameField)
  }, [firstNameField])

  return (
    <div className={"root-SignUpPage"}>
      <h1>Criar conta</h1>
      <CardContent className="signUpCardContent">
        <ErrorAlert message={error ? error : ""} />
        <form className={"form"} noValidate>
          <RequiredTextField
            id="firstName"
            label="Nome"
            autoFocus={true}
            onChange={event => setFirstNameField({ value: event.target.value })}
            error={firstNameField.error}
          />
          <RequiredTextField
            id="lastName"
            label="Sobrenome"
            onChange={event => setLastNameField({ value: event.target.value })}
            error={lastNameField.errors ? lastNameField.errors.map(e => e) : ""}
          />
          <RequiredTextField
            id="email"
            label="Email"
            onChange={event => setEmailField({ value: event.target.value })}
            error={emailField.errors ? emailField.errors.map(e => e) : ""}
          />
          <RequiredTextField
            id="password"
            label="Senha"
            onChange={event => setPasswordField({ value: event.target.value })}
            error={passwordField.errors ? passwordField.errors.map(e => e) : ""}
          />
          <RequiredTextField
            id="password"
            autoComplete="password"
            label="Repetir senha"
            onChange={event => setRepeatPasswordField({ value: event.target.value })}
            error={repeatPasswordField.errors ? repeatPasswordField.errors.map(e => e) : ""}
          />
        </form>
      </CardContent>
      <CardActions className="signUpCardActions">
        <Button
          fullWidth
          variant="default"
          onClick={onSubmit}
        >
          Enviar
        </Button>
      </CardActions>
      <Grid container justify="flex-end">
        <Grid item>
          <Link to="/signin" variant="body2">
            Já tem uma conta? Entrar
          </Link>
        </Grid>
      </Grid>

    </div>


  );
}