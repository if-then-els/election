const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    hasVoted: { type: Boolean, default: false },
    role: { type: String, enum: ['voter', 'admin'], default: 'voter' },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.phoneNumber) {
    this.phoneNumber = this.phoneNumber.replace(/[\s\-\(\)]/g, "");
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
