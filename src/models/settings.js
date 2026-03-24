const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    votingEnabled: { type: Boolean, default: true },
    votingStartDate: { type: Date, default: null },
    votingEndDate: { type: Date, default: null },
    registrationEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model("Settings", settingsSchema);
