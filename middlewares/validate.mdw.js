const Ajv = require('ajv').default;
const addFormats = require("ajv-formats");

module.exports = schema => (req, res, next) => {
  const ajv = new Ajv();
  addFormats(ajv)
  const validate = ajv.compile(schema);
  const valid = validate(req.body);
  if (!valid) {
    return res.status(400).json({
      "status": false,
      "error": validate.errors,
    });
  }

  next();
}