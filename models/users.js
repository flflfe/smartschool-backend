import mongoose from "mongoose";
const { Schema, model } = mongoose;
import validator from "validator";
const { isEmail } = validator;
import bcryptjs from "bcryptjs";
const { compare, hash } = bcryptjs;
import jwt from "jsonwebtoken";
const { sign } = jwt;
import config from "../config.js";
const { jwtsigninKey } = config;

const userSchema = new Schema(
  {
    Name: {
      type: String,
      trim: true,
      required: [true, "Enter the name"],
    },
    DOB: {
      type: Date,
      required: [true, "Enter a valid date of birth."],
      validate(value) {
        try {
          const age = Math.floor(
            (new Date() - new Date(value).getTime()) / 3.15576e10
          );
          if (age < 7) throw new Error("Age must be greater than 7");
        } catch (err) {
          console.log(err);
          throw new Error("invalid data");
        }
      },
    },
    Email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Email Address is Required"],
      validate(value) {
        if (!isEmail(value)) throw new Error("Invalid Email");
      },
    },
    Password: {
      type: String,
      trim: true,
      required: [true, "Password is Needed"],
      minlength: 10,
      validate(value) {
        const regex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{10,})/;
        if (!regex.test(value))
          throw new Error(
            "at least one lowercase letter, one uppercase letter, one digit, one special character, and at least eight characters long"
          );
      },
    },
    tokens: [
      {
        token: {
          required: true,
          type: String,
        },
      },
    ],
    role: {
      type: String,
      required: false,
    },
    classroom: { type: Schema.Types.ObjectId, ref: "classrooms" },
  },
  {
    timestamps: true,
  }
);

//Generate Token FOR ADMINISTRATIVE PURPOSE
userSchema.methods.getToken = async function () {
  const user = this;
  const token = sign({ _id: user._id.toString() }, jwtsigninKey);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const filteredObj = user.toObject();
  delete filteredObj.Password;
  delete filteredObj.tokens;
  return filteredObj;
};

userSchema.statics.findByProvideInfo = async (Email, password) => {
  const user = await Users.findOne({
    Email: `${Email[0].toLowerCase()}${Email.slice(1)}`,
  });

  if (!user) {
    throw new Error("Invalid Email or Password");
  }
  const isPasswordMatched = await compare(password, user.Password);
  if (!isPasswordMatched) {
    throw new Error("Invalid Email or Password");
  }
  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("Password")) {
    user.Password = await hash(user.Password, 7);
  }

  next();
});

const Users = model("users", userSchema);

export default Users;
