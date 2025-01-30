const validator = require('validator');

const validateSignUpData = (req) => {
  const validGender = ['Male', 'Female', 'Other'];

  const { body } = req;
  if (!body) {
    throw new Error('Please enter valid details');
  }
  const {
    firstName,
    lastName,
    emailID,
    password,
    age,
    gender,
    about,
    role,
    skills,
  } = body;
  if (!firstName || !lastName) {
    throw new Error(
      'Please enter a valid ' + !firstName ? 'firstName' : 'lastName'
    );
  } else if (!validator.isEmail(emailID)) {
    throw new Error('Please enter a valid emailID');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('Please enter a strong password');
  } else if (!age) {
    throw new Error('Please enter valid age');
  } else if (!validGender.includes(gender)) {
    throw new Error('Please enter valid gender');
  } else if (!about) {
    throw new Error('Please enter about details');
  } else if (!role) {
    throw new Error('Please enter a valid role');
  }
};

const validateLoginCreds = (req) => {
  const { body } = req;
  if (!body) {
    throw new Error('Please enter valid credentials');
  }
  const { emailID, password } = body;
  if (!validator.isEmail(emailID)) {
    throw new Error('Please enter a valid emailID');
  } else if (!validator.isStrongPassword(password)) {
    throw new Error('Please enter a strong password');
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    'firstName',
    'lastName',
    'emailID',
    'password',
    'age',
    'gender',
    'photoUrl',
    'about',
    'skills',
    'role',
  ];
  const isEditAllowed = Object.keys(req.body).every((field) => {
    allowedEditFields.includes(field);
  });

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateLoginCreds,
  validateEditProfileData,
};
