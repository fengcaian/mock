'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const SynthesizeConfigScheme = new Schema({
    system: {
      type: String,
    },
    prefix: {
      type: String,
    },
    isProxy: {
      type: Boolean,
    },
  });
  return mongoose.model('SynthesizeConfig', SynthesizeConfigScheme);
};