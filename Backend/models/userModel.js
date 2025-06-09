import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: function () {
      return this.provider === "local";
    },
  },
    profilePhoto: {
    type: String,
    default: null,
  },
  cartData: {
    type: Object,
    default: {},
  },
  role: {
    type: String,
    enum: ["admin", "company", "customer"],
    default: "customer",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  provider: {
    type: String,
    enum: ["facebook", "google", "local"],
    default: "local",
    required: true,
  },
  providerId: {
    type: String,
    unique: true,
    sparse: true,
  },
}, {
  toObject: {
    transform(doc, user) {
      delete user.password;
      delete user.__v;
      user.id = user._id;
      delete user._id;
      return user;
    },
  },
  minimize: false,
  timestamps: true,
});

// Register the model
const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
