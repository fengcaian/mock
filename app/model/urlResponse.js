'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UrlResponseSchema = new Schema({
    url: {
        type: String,
    },
    urlId: {
        type: String,
    },
    dataType: {
      type: String,
    },
    response: {},
  });
  return mongoose.model('UrlResponse', UrlResponseSchema);
};