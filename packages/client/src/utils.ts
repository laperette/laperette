import range from "lodash/range";

export const repeat = (length: number, ret: string) =>
  range(length).map(() => ret);

export const fieldsErrorsMapping = {
  "required": "Ce champ ne peut être vide",
  "wrongEmail": " Cet email est incorrect",
  "wrongPassword": "Ce mot de passe est incorrect",
  "differentPassword": "Les mots de passe sont différents",
  "passwordTooShort": "Le mot de passe doit contenir 6 caractères minimum",
};
