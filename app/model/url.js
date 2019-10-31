'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UrlSchema = new Schema({
    uid: {
      type: String,
    },
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
    columnId: {
      type: Schema.Types.ObjectId,
    },
});
return mongoose.model('Url', UrlSchema);
};
