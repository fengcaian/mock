'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UrlResponseSchema = new Schema({
    system: {
      type: String,
    },
    url: {
      type: String,
    },
    type: {
      type: String,
    },
    dataType: {
      type: String,
    },
    isPriority: {
      type: Boolean,
    },
    createTime: {
      type: String,
    },
    response: {},
  });
  return mongoose.model('UrlResponse', UrlResponseSchema);
};