import { Container } from "@material-ui/core";
import React from "react";

export const PendingValidation = () => {
  return (
    <Container>
      <h1>Merci pour votre demande</h1>
      <h2>
        Nous validons actuellement votre compte auprès de l'administrateur
      </h2>
      <h2>Cette étape prend généralement quelques heures</h2>
    </Container>
  );
};
