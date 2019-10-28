'use strict';
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
    const PostSchema = new Schema({
        uid: {
            type: String,
        },
        type: {
            type: String,
        },
        url: {
            type: String,
        },
        tags: [
            {
                type: String,
            }
        ],
        consumes: {
            type: [String],
        },
        deprecated: {
            type: Boolean,
        },
        operationId: {
            type: String,
        },
        // parameters: [{
        //     description: String,
        //     format: String,
        //     in: String,
        //     name: String,
        //     required: Boolean,
        //     type: String,
        // }],
        produces: {
            type: [String],
        },
        responses: [
            {
                200: {
                    type: {
                        description: String,
                    },
                },
            }
        ],
        summary: {
            type: String,
        },
        columnId: {
            type: Schema.Types.ObjectId,
        },
    });
    return mongoose.model('Url', PostSchema);
};
