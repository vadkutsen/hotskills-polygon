import { body, validationResult } from 'express-validator'

export const reviewValidationRules = () => {
  return [
    body("rating").notEmpty().isFloat({min:0, max:5}),
  ]
};

export const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}