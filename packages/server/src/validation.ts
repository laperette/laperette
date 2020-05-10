import * as Joi from "@hapi/joi";

export const accountSchema = Joi.object({
  firstName: Joi.string().alphanum().min(3).max(30).required(),
  lastName: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "fr"] },
    })
    .required(),
  password: Joi.string().alphanum().min(6).max(30).required(),
});
