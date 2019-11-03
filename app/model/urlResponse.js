'use strict';
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const UrlResponseSchema = new Schema({
        uid: {
            type: String,
        },
        url: {
            type: String,
        },
        urlId: {
            type: String,
        },
        code: {
            type: Number,
        },
        msg: {
            type: String,
        },
        result: {},
        dataType: {
            type: String,
        },
        columnId: {
            type: Schema.Types.ObjectId,
        },
    });
    return mongoose.model('UrlResponse', UrlResponseSchema);
};