const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    title: { type: String, minlength: 3, required: true },
    timestamp: { type: String, required: true },
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Comment', CommentSchema);
