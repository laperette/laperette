import React from "react";
import { FormField, TextInput, Button, Box, Heading } from "grommet";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useForm, OnSubmit } from "react-hook-form";
import { fieldsErrorsMapping } from "../../utils";

type LoginData = { email: string; password: string };

export const Login = () => {
  const { login } = useAuth();
  const { register, handleSubmit, setError, errors } = useForm<LoginData>();
  const onSubmit: OnSubmit<LoginData> = async (data) => {
    try {
      await login(data);
    } catch (error) {
      if (
        error?.response?.data?.error_description === "Member validation pending"
      ) {
        window.location.replace("/account-validation");
        return;
      }

      setError("email", "wrongEmail");
      setError("password", "wrongPassword");
    }
  };

  return (
    <Box fill justify="center" align="center">
      <Box
        pad="medium"
        border={{ style: "solid", size: "1px", color: "black", side: "all" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Heading>Se connecter</Heading>
          <p>
            Pas encore inscrit? <Link to="/signup">Créer un compte</Link>
          </p>

          <FormField
            htmlFor="email"
            error={errors.email && fieldsErrorsMapping[errors.email.type]}
          >
            <TextInput
              autoComplete="email"
              id="email"
              name="email"
              placeholder="Email"
              type="email"
              ref={register({ required: true })}
            />
          </FormField>
          <FormField
            htmlFor="password"
            error={errors.password && fieldsErrorsMapping[errors.password.type]}
          >
            <TextInput
              autoComplete="current-password"
              id="password"
              name="password"
              placeholder="Mot de passe"
              type="password"
              ref={register({ required: true })}
            />
          </FormField>
          <Button type="submit" primary label="Se connecter !" />
        </form>
      </Box>
    </Box>
  );
};
