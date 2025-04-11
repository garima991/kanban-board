import validator from 'validator';

export const validateSignUpData = (data) => {
  const { name, username, email, password, confirmPassword } = data;
  const errors = {};

  if (!name) {
    errors.name = 'Name is required';
  } else if (!validator.isLength(name, { min: 3, max: 30 })) {
    errors.name = 'Name must be between 3 and 30 characters';
  }

  if (!username) {
    errors.username = 'Username is required';
  } else if (!validator.isLength(username, { min: 5, max: 30 })) {
    errors.username = 'Username must be between 5 and 30 characters';
  }

  if (!email) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(email)) {
    errors.email = 'Email is not valid';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (!validator.isLength(password, { min: 8, max: 30 })) {
    errors.password = 'Password must be between 8 and 30 characters';
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    errors.password =
      'Password must contain uppercase, lowercase, number, and special character';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirm password is required';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
