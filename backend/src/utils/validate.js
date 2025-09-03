import validator from 'validator';

export const validateSignUpData = (rawData) => {
  const data = {
    name : rawData.name?.trim() || '',
    username : rawData.username?.trim() || '',
    email : rawData.email?.trim() || '',
    password : rawData.password || '',
    confirmPassword : rawData.confirmPassword || '',
  }
  const errors = {};

  if (!data.name) {
    errors.name = 'Name is required';
  } else if (!validator.isLength(data.name, { min: 3, max: 30 })) {
    errors.name = 'Name must be between 3 and 30 characters';
  }

  if (!data.username) {
    errors.username = 'Username is required';
  } else if (!validator.isLength(data.username, { min: 5, max: 30 })) {
    errors.username = 'Username must be between 5 and 30 characters';
  }

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(data.email)) {
    errors.email = 'Email is not valid';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  } else if (!validator.isLength(data.password, { min: 8, max: 30 })) {
    errors.password = 'Password must be between 8 and 30 characters';
  } else if (
    !validator.isStrongPassword(data.password, {
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

  if (!data.confirmPassword) {
    errors.confirmPassword = 'Confirm password is required';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
