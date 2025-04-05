import HttpError from "./HttpError.js";

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(400, error.message));
    } else {
      next();
    }
  };
};

export default validateBody;
