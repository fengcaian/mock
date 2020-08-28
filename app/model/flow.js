'use strict';
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const flowSchema = new Schema({
      flowName: {
          type: String,
      },
      createTime: {
        type: String,
      },
      combos: [],
      groups: [],
      nodes: [],
      edges: [],
    });
    return mongoose.model('Flow', flowSchema);
};