import React from "react";
import { FormField, TextInput, Button, Box, Heading, Anchor } from "grommet";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

export const Login = () => {
  const { login } = useAuth();
  return (
    <Box fill justify="center" align="center">
      <Box
        pad="medium"
        border={{ style: "solid", size: "1px", color: "black", side: "all" }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("submit");
            login({ email: "lol", password: "lol" });
          }}
        >
          <Heading>Log in</Heading>
          <Link to="/signup">
            <Anchor as="span" label="Or sign up" />
          </Link>

          <FormField htmlFor="email" label="Email">
            <TextInput
              autoComplete="email"
              id="email"
              name="email"
              placeholder="email"
              type="email"
            />
          </FormField>
          <FormField htmlFor="password" label="Mot de passe">
            <TextInput
              autoComplete="current-password"
              id="password"
              name="password"
              placeholder="password"
              type="password"
            />
          </FormField>
          <Button type="submit" primary label="Log me in" />
        </form>
      </Box>
    </Box>
  );
};
