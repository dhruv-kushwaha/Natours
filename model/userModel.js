const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Creating User Schema
// name , email, photo, password , passwordConfirm
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'User must enter his or her Email Address'],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please Provide a password'],
    minlength: 8,
    // select: false => By default password will excluded from query results for security and privacy reasons
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please Confirm your Password'],
    // validate whether password and passwordConfirm are the same
    validate: {
      // This only works on CREATE and SAVE!!!
      // Callback function called when a new document is created
      validator: function (el) {
        return el === this.password; // abc == abc
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

/* pre - 'save' middleware
Encryption is related to data therefore in model.
This middleware function encrypts the input user password before saving it into the database.

this has access to the current document.(current user)

isModified : mongoose method available on all documents to check if a certain field is modified

When are we saving a password into database :
  1) Create a new User
  2) Update existing password
  3) Reset Password (forgot the password)
*/
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// set the passwordChangedAt property when the password is changed
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// query middleware
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// Compare the input password to encrypted password saved in database
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Used in protect function to check whether the user who is trying to access a protected route has send the jwt token which has been generated after he has changed the password (if he has changed the passsword).
userSchema.methods.changedPasswordAfter = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(changedTimestamp, JWTTimestamp);
    // console.log(JWTTimestamp < changedTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordsResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};

// Creating model out of the schema
const User = mongoose.model('User', userSchema);
module.exports = User;
