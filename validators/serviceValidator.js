import { body, validationResult } from 'express-validator'

export const serviceValidationRules = () => {
  return [
    body("category").notEmpty(),
    body("title").notEmpty(),
    body("authorAddress").notEmpty(),
    body("price").notEmpty().isFloat({min:0}),
    body("description").notEmpty(),
  ]
};

export const idListValidationRules = () => {
    return [
      body("ids").notEmpty(),
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

// export default {
//   serviceValidationRules,
//   idListValidationRules,
//   validate,
// }