'use strict';
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const PostSchema = new Schema({
        wid: {
            type: String,
        },
        release: {
            type: Boolean,
        },
        sort: {
            type: Number,
        },
        img: {
            type: String,
        },
        abstract: {
            type: String,
        },
        text: {
            type: String,
        },
        isSetTop: {
            type: Number,
        },
        title: {
            type: String,
        },
        keywords: {
            type: String,
        },
        describe: {
            type: String,
        },
        updateTime: {
            type: Date,
        },
        num: {
            type: Number,
        },
        uid: {
            type: String,
        },
        editors: {
            type: String,
        },
        disable: {
            type: Boolean,
        },
        columnId: {
            type: Schema.Types.ObjectId,
        },
    });
    return mongoose.model('Article', PostSchema);
};
