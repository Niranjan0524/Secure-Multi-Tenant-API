const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: function () {
        // Only required if user is not creating first org
        return this.role !== "admin" || this.isNew === false;
      },
      ref: "Organization",
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword =  function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;