'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UrlSchema = new Schema({
    consumes: {
      type: [String],
    },
    deprecated: {
      type: Boolean,
    },
    operationId: {
      type: String,
    },
    parameters: [{}],
    produces: {
      type: [String],
    },
    responses: {},
    summary: {
      type: String,
    },
    tags: [
      {
        type: String,
      }
    ],
    type: {
      type: String,
    },
    url: {
      type: String,
    },
    requestTarget: {
      type: String,
    },
    host: {
      type: String,
    },
    hostIp: {
      type: String,
    },
  });
  return mongoose.model('Url', UrlSchema);
};
