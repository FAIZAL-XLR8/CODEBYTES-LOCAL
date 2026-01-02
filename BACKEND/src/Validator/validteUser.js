const validator = require("validator");
const validateUser = (data) => {
  const mandatoryFields = ["password", "firstName", "emailID"];
  if (!mandatoryFields.every((field) => Object.keys(data).includes(field))) {
    throw new Error("All the mandatory fields not included!");
  }
  const { password, firstName, emailID } = data;
  if (!validator.isStrongPassword(password))
    throw new Error(
      "Strong password required : { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }"
    );
  if (!validator.isEmail(emailID)) throw new Error("emailID INvalid");
};
module.exports = validateUser;
