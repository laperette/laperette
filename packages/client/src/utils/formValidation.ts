import Joi from "joi";

export const houseSchema = Joi.object({
  name: Joi.string().trim().min(1).max(30).invalid(null).required().messages({
    "string.base": `The house name should be a text`,
    "string.empty": `The house name can't be empty`,
    "string.min": `The house name should have a minimum length of {#limit} letters`,
    "string.max": `The house name should have a maximum length of {#limit} letters`,
    "any.required": `The house name is a required field`,
  }),
}).required();

export const bookingSchema = Joi.object({
  houseId: Joi.string().required().messages({
    "string.base": `The house name should be an existing house`,
    "string.empty": `Please choose a house for this booking`,
    "any.required": `The house name is a required field`,
  }),
  companions: Joi.string().trim().regex(/^\d+$/).required().messages({
    "string.empty": `The number of people can't be empty`,
    "any.required": `The number of people is a required field`,
    "string.pattern.base": `The number of people must be a number`,
  }),
  comments: Joi.string().max(240).allow(null, "").messages({
    "string.base": `The comments should be a text`,
    "string.max": `The comments should have a maximum length of {#limit} letters`,
  }),
  arrivalTime: Joi.string()
    .regex(/^(3[01]|[12][0-9]|0[1-9])\/(1[0-2]|0[1-9])\/[0-9]{4}$/)
    .required()
    .messages({
      "string.base": `The arrival date should be a valid date`,
      "string.empty": `The arrival date can't be empty`,
      "any.required": `The arrival date is a required field`,
      "string.pattern.base": `The arrival date must follow format dd/mm/yyyy`,
    }),
  departureTime: Joi.string()
    .regex(/^(3[01]|[12][0-9]|0[1-9])\/(1[0-2]|0[1-9])\/[0-9]{4}$/)
    .required()
    .messages({
      "string.base": `The departure date should be a valid date`,
      "string.empty": `The departure date can't be empty`,
      "any.required": `The departure date is a required field`,
      "string.pattern.base": `The departure date must follow format dd/mm/yyyy`,
    }),
}).required();
