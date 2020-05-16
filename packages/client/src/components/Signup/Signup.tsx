import React from "react";
import { FormField, TextInput, Button, Box, Heading, Anchor } from "grommet";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

export const Signup = () => {
  const { login } = useAuth();
  return (
    <Box fill justify="center" align="center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("submit");
          login({ email: "lol", password: "lol" });
        }}
      >
        <Box
          pad="medium"
          border={{ style: "solid", size: "1px", color: "black", side: "all" }}
          alignContent="center"
        >
          <Heading>Sign up</Heading>
          <Link to="/login">
            <Anchor as="span" label="Or log in" />
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
          <FormField htmlFor="firstName" label="First name">
            <TextInput
              autoComplete="given-name"
              id="firstName"
              name="firstName"
              placeholder="First name"
              type="text"
            />
          </FormField>
          <FormField htmlFor="lastName" label="Last name">
            <TextInput
              autoComplete="family-name"
              id="lastName"
              name="lastName"
              placeholder="Last name"
              type="text"
            />
          </FormField>
          <FormField htmlFor="new-password" label="Choose a password">
            <TextInput
              autoComplete="new-password"
              id="new-password"
              name="new-password"
              placeholder="password"
              type="password"
            />
          </FormField>
          <FormField
            htmlFor="confirm-new-password"
            label="Confirm your password"
          >
            <TextInput
              autoComplete="new-password"
              id="confirm-new-password"
              name="confirm-new-password"
              placeholder="password"
              type="password"
            />
          </FormField>
          <Button type="submit" primary label="Sign up" />
        </Box>
      </form>
    </Box>
  );
};
