import React from "react";
import { FormField, TextInput, Button, Box, Heading, Anchor } from "grommet";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useForm, OnSubmit } from "react-hook-form";
import { ERROR_FIELD_REQUIRED } from "../../constants";

type LoginData = { email: string; password: string };

export const Login = () => {
  const { login } = useAuth();
  const { register, handleSubmit, setError, errors } = useForm<LoginData>();
  const onSubmit: OnSubmit<LoginData> = async (data) => {
    try {
      await login(data);
    } catch (error) {
      setError("email", "auth", "Invalid email");
      setError("password", "auth", "Invalid password");
    }
  };

  return (
    <Box fill justify="center" align="center">
      <Box
        pad="medium"
        border={{ style: "solid", size: "1px", color: "black", side: "all" }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Heading>Log in</Heading>
          <Link to="/signup">
            <Anchor as="span" label="Or sign up" />
          </Link>
          <FormField
            htmlFor="email"
            label="Email"
            error={errors.email && errors.email.message}
          >
            <TextInput
              autoComplete="email"
              id="email"
              name="email"
              placeholder="email"
              type="email"
              ref={register({ required: true })}
            />
          </FormField>
          <FormField
            htmlFor="password"
            label="Mot de passe"
            error={errors.password && errors.password.message}
          >
            <TextInput
              autoComplete="current-password"
              id="password"
              name="password"
              placeholder="password"
              type="password"
              ref={register({ required: true })}
            />
          </FormField>
          <Button type="submit" primary label="Log me in" />
        </form>
      </Box>
    </Box>
  );
};
