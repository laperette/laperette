import React from "react";
import { FormField, TextInput, Button, Box, Heading, Anchor } from "grommet";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { OnSubmit, useForm } from "react-hook-form";
import { ERROR_FIELD_REQUIRED } from "../../constants";

type SignupData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export const Signup = () => {
  const { login } = useAuth();
  const { register, handleSubmit, errors } = useForm<SignupData>();
  const onSubmit: OnSubmit<SignupData> = (data) => {
    console.log(data);
    login(data);
  };

  return (
    <Box fill justify="center" align="center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          pad="medium"
          border={{ style: "solid", size: "1px", color: "black", side: "all" }}
          alignContent="center"
        >
          <Heading>Sign up</Heading>
          <Link to="/login">
            <Anchor as="span" label="Or log in" />
          </Link>
          <FormField
            htmlFor="email"
            label="Email"
            error={errors.email && ERROR_FIELD_REQUIRED}
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
            htmlFor="firstName"
            label="First name"
            error={errors.firstName && ERROR_FIELD_REQUIRED}
          >
            <TextInput
              autoComplete="given-name"
              id="firstName"
              name="firstName"
              placeholder="First name"
              type="text"
              ref={register({ required: true })}
            />
          </FormField>
          <FormField
            htmlFor="lastName"
            label="Last name"
            error={errors.lastName && ERROR_FIELD_REQUIRED}
          >
            <TextInput
              autoComplete="family-name"
              id="lastName"
              name="lastName"
              placeholder="Last name"
              type="text"
              ref={register({ required: true })}
            />
          </FormField>
          <FormField htmlFor="new-password" label="Choose a password">
            error={errors.password && ERROR_FIELD_REQUIRED}
            <TextInput
              autoComplete="new-password"
              id="new-password"
              name="new-password"
              placeholder="password"
              type="password"
              ref={register({ required: true })}
            />
          </FormField>
          <FormField
            htmlFor="confirm-new-password"
            label="Confirm your password"
            error={errors.password && ERROR_FIELD_REQUIRED}
          >
            <TextInput
              autoComplete="new-password"
              id="confirm-new-password"
              name="confirm-new-password"
              placeholder="password"
              type="password"
              ref={register({ required: true })}
            />
          </FormField>
          <Button type="submit" primary label="Sign up" />
        </Box>
      </form>
    </Box>
  );
};
