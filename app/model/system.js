'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const SystemSchema = new Schema({
    systemUrl: {
      type: String,
    },
    systemApi: {
      type: String,
    },
    systemName: {
      type: String,
    },
    isEnabled: {
      type: Boolean,
    },
    ipAddressList: [],
    port: {
      type: String,
    },
  });
  return mongoose.model('System', SystemSchema);
};