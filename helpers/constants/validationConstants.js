export const LENGTH_CONSTANTS = {
  NAME_LENGTH: 50,
  ADDRESS_LENGTH: 200,
  IDENTITIY_LENGTH: 50,
  EMAIL_LENGTH: 50,
  PASS_MIN: 5,
  PASS_MAX: 25,
};

export const VALIDATION_MSGS = {
  requiredField: (fieldName) => {
    return fieldName + " is required";
  },
  notEmpty: (fieldName) => {
    return fieldName + " can not be empty";
  },
  maxLength: (fieldName, lengthGot) => {
    return fieldName + " length should not exceed " + lengthGot + " characters";
  },
  minLength: (fieldName, lengthGot) => {
    return (
      fieldName + " length should be at least " + lengthGot + " characters"
    );
  },
  emailFormat: () => {
    return "Invalid email format";
  },
  notFromEnum: (fieldName) => {
    return "The " + fieldName + " value is not in the described options";
  },
  invalidType: (fieldName, typeName) => {
    return "The type of " + fieldName + " should be " + typeName;
  },
};
