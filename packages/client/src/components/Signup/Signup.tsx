import React from "react";
import { FormField, TextInput, Button, Box, Heading } from "grommet";
import { Link, Redirect } from "react-router-dom";
import { OnSubmit, useForm } from "react-hook-form";
import Axios from "axios";
import { fieldsErrorsMapping } from "../../utils/authClient";

export interface SignupData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export const Signup = () => {
  const { register, handleSubmit, setError, errors } = useForm<SignupData>();
  const [accountCreationSuccess, setAccountCreationSuccess] = React.useState<
    null | boolean
  >(null);
  const [accountCreationError, setAccountCreationError] = React.useState<
    null | boolean
  >(null);

  const onSubmit: OnSubmit<SignupData> = (data) => {
    const { firstName, lastName, email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      setAccountCreationError(true);
      setError("password", "differentPassword");
      setError("confirmPassword", "differentPassword");
      return;
    }

    if (password.length <= 6) {
      setError("password", "passwordTooShort");
      return;
    }

    return Axios({
      method: "post",
      url: `${process.env.REACT_APP_SERVER_URL}/signup`,
      data: {
        email,
        firstName,
        lastName,
        password,
      },
      withCredentials: true,
    })
      .then(() => {
        setAccountCreationSuccess(true);
      })
      .catch((error) => {
        console.log(error);
        setAccountCreationError(true);
      });
  };

  if (accountCreationSuccess) {
    return <Redirect to="/pending-validation" />;
  }

  return (
    <Box fill justify="center" align="center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          pad="medium"
          border={{
            style: "solid",
            size: "1px",
            color: "black",
            side: "all",
          }}
          alignContent="center"
        >
          <Heading>Créer un compte</Heading>
          {accountCreationError && (
            <p>Navré une erreur s'est produite, veuillez réessayer</p>
          )}
          <FormField
            htmlFor="email"
            error={errors.email && fieldsErrorsMapping["required"]}
          >
            <TextInput
              autoComplete="email"
              id="email"
              name="email"
              placeholder="Adresse mail"
              type="email"
              ref={register({ required: true })}
            />
          </FormField>
          <FormField
            htmlFor="firstName"
            error={errors.firstName && fieldsErrorsMapping["required"]}
          >
            <TextInput
              autoComplete="given-name"
              id="firstName"
              name="firstName"
              placeholder="Prénom"
              type="text"
              ref={register({ required: true })}
            />
          </FormField>
          <FormField
            htmlFor="lastName"
            error={errors.lastName && fieldsErrorsMapping["required"]}
          >
            <TextInput
              autoComplete="family-name"
              id="lastName"
              name="lastName"
              placeholder="Nom de famille"
              type="text"
              ref={register({ required: true })}
            />
          </FormField>
          <FormField
            htmlFor="password"
            error={errors.password && fieldsErrorsMapping[errors.password.type]}
          >
            <TextInput
              autoComplete="password"
              id="password"
              name="password"
              placeholder="Choisissez un mot de passe"
              type="password"
              ref={register({ required: true })}
            />
          </FormField>
          <FormField
            htmlFor="confirm-password"
            error={
              errors.confirmPassword &&
              fieldsErrorsMapping[errors.confirmPassword.type]
            }
          >
            <TextInput
              id="confirm-password"
              name="confirmPassword"
              placeholder="Confirmez votre mot de passe"
              type="password"
              ref={register({ required: true })}
            />
          </FormField>
          <Button type="submit" primary label="S'inscrire !" />
        </Box>
      </form>
      <p>
        Vous êtes déjà membre? <Link to={"/sign-in"}>Se connecter</Link>
      </p>
    </Box>
  );
};
