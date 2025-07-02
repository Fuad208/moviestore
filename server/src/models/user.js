const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;
const userSchema = Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, unique: true, required: true, trim: true, lowercase: true },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password should not contain word: password');
        }
      },
    },
    role: {
      type: String,
      default: 'guest',
      enum: ['guest', 'admin', 'superadmin', 'staff', 'user'],
    },
    facebook: String,
    google: String,
    phone: {
      type: String,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error('Phone is invalid');
        }
      },
    },
    imageurl: String,
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  if (user.role !== 'superadmin') {
    delete user.updatedAt;
    delete user.__v;
  }

  delete user.password;
  delete user.tokens;
  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, 'mySecret');
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

userSchema.statics.findByCredentials = async function (username, password) {
  const user = await this.findOne({ username });
  if (!user) throw new Error('Unable to login');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Unable to login');

  return user;
};

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
